import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, return_url } = await request.json()

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

    // Get Khalti credentials from environment variables
    const secretKey = process.env.KHALTI_SECRET_KEY

    console.log('Khalti Configuration Debug:')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('VERCEL_ENV:', process.env.VERCEL_ENV)
    console.log('Secret Key set:', !!secretKey)
    console.log('Secret Key length:', secretKey?.length)
    console.log('Secret Key prefix:', secretKey?.substring(0, 8))

    if (!secretKey) {
      console.error('Khalti credentials not configured')
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
      p.paymentMethod === 'KHALTI' &&
      p.createdAt > new Date(Date.now() - 15 * 60 * 1000) // Within last 15 minutes
    )

    if (existingPendingPayment) {
      return NextResponse.json(
        { error: 'Payment already initiated. Please complete or cancel the existing payment.' },
        { status: 400 }
      )
    }

    // Generate unique transaction ID
    const transactionId = `ORD-${orderId}-${Date.now()}`

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        paymentMethod: 'KHALTI',
        amount,
        transactionId,
        paymentStatus: 'PENDING'
      }
    })

    // Khalti payment initiation
    // Use production URL for Vercel deployments or if explicitly set
    const isProduction = process.env.NODE_ENV === 'production' || 
                        process.env.VERCEL_ENV === 'production' ||
                        process.env.KHALTI_ENV === 'production'
    const khaltiUrl = isProduction 
      ? 'https://khalti.com/api/v2/epayment/initiate/' 
      : 'https://a.khalti.com/api/v2/epayment/initiate/'

    // Ensure APP_URL has proper protocol
    let appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    if (!appUrl.startsWith('http://') && !appUrl.startsWith('https://')) {
      appUrl = `http://${appUrl}`
    }

    const paymentData = {
      return_url: return_url || `${appUrl}/api/payments/khalti/verify?orderId=${orderId}&transactionId=${transactionId}`,
      website_url: appUrl,
      amount: Math.round(amount * 100), // Khalti uses paisa (amount * 100)
      purchase_order_id: transactionId,
      purchase_order_name: `Order #${orderId}`,
      customer_info: {
        name: order.customerName,
        email: order.email || '',
        phone: order.phone
      }
    }

    const khaltiResponse = await fetch(khaltiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    })

    let khaltiData
    try {
      khaltiData = await khaltiResponse.json()
    } catch (jsonError) {
      console.error('Khalti API returned non-JSON response:', jsonError)
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: { paymentStatus: 'FAILED' }
      })

      return NextResponse.json(
        { error: 'Khalti gateway returned invalid response. Please try again.' },
        { status: 500 }
      )
    }

    if (!khaltiResponse.ok) {
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: { paymentStatus: 'FAILED' }
      })

      return NextResponse.json(
        { error: khaltiData.detail || 'Failed to initiate Khalti payment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      paymentUrl: khaltiData.payment_url,
      paymentId: payment.id,
      transactionId,
      pidx: khaltiData.pidx // Khalti payment index
    })
  } catch (error) {
    console.error('Error initiating Khalti payment:', error)
    return NextResponse.json(
      { error: 'An error occurred while initiating payment. Please try again.' },
      { status: 500 }
    )
  }
}