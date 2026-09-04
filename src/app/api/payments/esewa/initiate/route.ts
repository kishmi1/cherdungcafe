import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount } = await request.json()

    // Validate required fields
    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Order ID and amount are required' },
        { status: 400 }
      )
    }

    // Validate order ID is a number
    if (typeof orderId !== 'number' || isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      )
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Get eSewa credentials from environment variables
    const productCode = process.env.ESEWA_PRODUCT_CODE
    const secretKey = process.env.ESEWA_SECRET_KEY

    console.log('eSewa credentials check:')
    console.log('Product code:', productCode)
    console.log('Secret key configured:', !!secretKey)
    console.log('Secret key length:', secretKey?.length)

    if (!productCode || !secretKey) {
      console.error('eSewa credentials not configured')
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      )
    }

    // Fetch order to validate
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        payments: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order already has a successful payment
    const existingPayment = order.payments.find(p => p.paymentStatus === 'PAID')
    if (existingPayment) {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      )
    }

    // Check if order is cancelled
    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Cannot process payment for cancelled order' },
        { status: 400 }
      )
    }

    // Validate amount matches order total
    if (Math.abs(amount - order.totalAmount) > 0.01) {
      return NextResponse.json(
        { error: 'Amount mismatch. Please refresh and try again.' },
        { status: 400 }
      )
    }

    // Check for existing pending payment (prevent duplicate payment initiation)
    const existingPendingPayment = order.payments.find(p => 
      p.paymentStatus === 'PENDING' && 
      p.paymentMethod === 'ESEWA' &&
      p.createdAt > new Date(Date.now() - 15 * 60 * 1000) // Within last 15 minutes
    )

    if (existingPendingPayment) {
      return NextResponse.json(
        { error: 'Payment already initiated. Please complete or cancel the existing payment.' },
        { status: 400 }
      )
    }

    // Generate unique transaction ID (format: ORD-{orderId}-{uuid})
    const uuid = crypto.randomUUID()
    const transactionId = `ORD-${orderId}-${uuid}`

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        paymentMethod: 'ESEWA',
        amount,
        transactionId,
        paymentStatus: 'PENDING'
      }
    })

    // ePay V2 signature generation
    // Signature format: total_amount=X,transaction_uuid=Y,product_code=Z
    const signedFieldNames = 'total_amount,transaction_uuid,product_code'
    
    // Format amount to exactly 2 decimal places as string
    const totalAmountStr = amount.toFixed(2)
    
    // Create signature data exactly as eSewa expects
    const signatureData = `total_amount=${totalAmountStr},transaction_uuid=${transactionId},product_code=${productCode}`
    
    console.log('Signature generation debug:')
    console.log('Signature data:', signatureData)
    console.log('Product code:', productCode)
    console.log('Transaction UUID:', transactionId)
    console.log('Total amount:', totalAmountStr)
    
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(signatureData)
      .digest('base64')
    
    console.log('Generated signature:', signature)

    // eSewa ePay V2 payment URL
    const esewaUrl = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'

    // Ensure APP_URL has proper protocol
    let appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    if (!appUrl.startsWith('http://') && !appUrl.startsWith('https://')) {
      appUrl = `http://${appUrl}`
    }

    // Construct payment parameters for ePay V2
    const paymentParams = {
      amount: totalAmountStr,
      tax_amount: "0",
      total_amount: totalAmountStr,
      transaction_uuid: transactionId,
      product_code: productCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${appUrl}/api/payments/esewa/verify`,
      failure_url: `${appUrl}/api/payments/esewa/cancel`,
      signed_field_names: signedFieldNames,
      signature: signature
    }
    
    console.log('Payment parameters being sent to eSewa:', JSON.stringify(paymentParams, null, 2))

    return NextResponse.json({
      paymentUrl: esewaUrl,
      paymentParams: paymentParams,
      paymentId: payment.id,
      transactionId
    })
  } catch (error) {
    console.error('Error initiating eSewa payment:', error)
    return NextResponse.json(
      { error: 'An error occurred while initiating payment. Please try again.' },
      { status: 500 }
    )
  }
}