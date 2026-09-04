import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')
    const transactionId = searchParams.get('transactionId')
    const pidx = searchParams.get('pidx')
    const amount = searchParams.get('amount')
    const status = searchParams.get('status')

    // Log incoming Khalti callback parameters for debugging
    console.log('Khalti verification callback received:')
    console.log('Order ID:', orderId)
    console.log('Transaction ID:', transactionId)
    console.log('Pidx:', pidx)
    console.log('Amount:', amount)
    console.log('Status:', status)
    console.log('Full URL:', request.url)

    // Validate required parameters
    if (!orderId || !transactionId || !pidx || !amount || !status) {
      console.error('Missing Khalti verification parameters')
      return NextResponse.redirect(
        new URL(`/order-failed?reason=invalid_parameters`, request.url)
      )
    }

    // Validate order ID
    const parsedOrderId = parseInt(orderId)
    if (isNaN(parsedOrderId)) {
      console.error('Invalid order ID in Khalti verification')
      return NextResponse.redirect(
        new URL(`/order-failed?reason=invalid_parameters`, request.url)
      )
    }

    const secretKey = process.env.KHALTI_SECRET_KEY
    if (!secretKey) {
      console.error('Khalti credentials not configured for verification')
      return NextResponse.redirect(
        new URL(`/order-failed?reason=gateway_error`, request.url)
      )
    }

    // Fetch order and payment to validate
    const order = await prisma.order.findUnique({
      where: { id: parsedOrderId },
      include: {
        payments: true
      }
    })

    if (!order) {
      console.error('Order not found for Khalti verification')
      return NextResponse.redirect(
        new URL(`/order-failed?reason=order_not_found`, request.url)
      )
    }

    // Check if payment already exists and is paid
    const existingPayment = order.payments.find(p => 
      p.transactionId === transactionId && p.paymentStatus === 'PAID'
    )

    if (existingPayment) {
      // Payment already verified, redirect to success
      return NextResponse.redirect(
        new URL(`/order-success/${orderId}`, request.url)
      )
    }

    // Check if payment was successful from Khalti callback
    if (status !== 'Completed' && status !== 'Pending') {
      console.error('Khalti payment not completed:', status)
      
      // Payment failed or cancelled
      await prisma.payment.updateMany({
        where: {
          transactionId,
          orderId: parsedOrderId
        },
        data: {
          paymentStatus: 'FAILED'
        }
      })

      return NextResponse.redirect(
        new URL(`/order-failed?orderId=${orderId}&reason=payment_failed`, request.url)
      )
    }

    // Verify payment with Khalti using the verification API
    const isProduction = process.env.NODE_ENV === 'production'
    const verificationUrl = isProduction 
      ? 'https://khalti.com/api/v2/epayment/lookup/' 
      : 'https://a.khalti.com/api/v2/epayment/lookup/'
    
    console.log('Khalti verification URL:', verificationUrl)
    console.log('Khalti verification pidx:', pidx)
    
    const verificationResponse = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pidx })
    })

    const verificationData = await verificationResponse.json()

    console.log('Khalti verification response status:', verificationResponse.status)
    console.log('Khalti verification response data:', JSON.stringify(verificationData, null, 2))

    if (!verificationResponse.ok || verificationData.status !== 'Completed') {
      console.error('Khalti verification failed:', verificationData)
      console.error('Verification response ok:', verificationResponse.ok)
      console.error('Verification data status:', verificationData.status)
      
      // Payment verification failed
      await prisma.payment.updateMany({
        where: {
          transactionId,
          orderId: parsedOrderId
        },
        data: {
          paymentStatus: 'FAILED'
        }
      })

      return NextResponse.redirect(
        new URL(`/order-failed?orderId=${orderId}&reason=verification_failed`, request.url)
      )
    }

    // Update payment record
    const payment = await prisma.payment.updateMany({
      where: {
        transactionId,
        orderId: parsedOrderId
      },
      data: {
        paymentStatus: 'PAID',
        reference: pidx,
        paidAt: new Date()
      }
    })

    // Update order status
    await prisma.order.update({
      where: { id: parsedOrderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED'
      }
    })

    return NextResponse.redirect(
      new URL(`/order-success/${orderId}`, request.url)
    )
  } catch (error) {
    console.error('Error verifying Khalti payment:', error)
    return NextResponse.redirect(
      new URL(`/order-failed?reason=server_error`, request.url)
    )
  }
}