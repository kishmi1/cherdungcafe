import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, return_url } = await request.json()

    // =========================
    // 1. Validate required fields
    // =========================
    if (!orderId || amount === undefined || amount === null) {
      return NextResponse.json(
        { error: 'Order ID and amount are required' },
        { status: 400 }
      )
    }

    // =========================
    // 2. Validate Order ID
    // =========================
    if (typeof orderId !== 'number' || Number.isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      )
    }

    // =========================
    // 3. Validate Amount
    // =========================
    if (
      typeof amount !== 'number' ||
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // =========================
    // 4. Get Khalti Secret Key
    // =========================
    const secretKey = process.env.KHALTI_SECRET_KEY

    console.log('========== KHALTI DEBUG ==========')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('VERCEL_ENV:', process.env.VERCEL_ENV)
    console.log('Secret Key exists:', Boolean(secretKey))
    console.log('Secret Key length:', secretKey?.length || 0)
    console.log(
      'Secret Key prefix:',
      secretKey ? secretKey.substring(0, 8) + '...' : 'NOT SET'
    )
    console.log('===================================')

    if (!secretKey) {
      console.error('KHALTI_SECRET_KEY is not configured')

      return NextResponse.json(
        {
          error:
            'Khalti payment gateway is not configured. Please contact support.'
        },
        { status: 500 }
      )
    }

    // =========================
    // 5. Find Order
    // =========================
    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      },
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

    // =========================
    // 6. Check if already paid
    // =========================
    const existingPaidPayment = order.payments.find(
      (payment) => payment.paymentStatus === 'PAID'
    )

    if (existingPaidPayment) {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      )
    }

    // =========================
    // 7. Check cancelled order
    // =========================
    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        {
          error:
            'Cannot process payment for a cancelled order'
        },
        { status: 400 }
      )
    }

    // =========================
    // 8. Check amount
    // =========================
    const orderTotal = Number(order.totalAmount)

    if (Math.abs(amount - orderTotal) > 0.01) {
      return NextResponse.json(
        {
          error:
            'Amount mismatch. Please refresh the page and try again.'
        },
        { status: 400 }
      )
    }

    // =========================
    // 9. Check existing pending payment
    // =========================
    const fifteenMinutesAgo = new Date(
      Date.now() - 15 * 60 * 1000
    )

    const existingPendingPayment = order.payments.find(
      (payment) =>
        payment.paymentStatus === 'PENDING' &&
        payment.paymentMethod === 'KHALTI' &&
        payment.createdAt > fifteenMinutesAgo
    )

    if (existingPendingPayment) {
      return NextResponse.json(
        {
          error:
            'Payment already initiated. Please complete or cancel the existing payment.'
        },
        { status: 400 }
      )
    }

    // =========================
    // 10. Generate transaction ID
    // =========================
    const transactionId = `ORD-${orderId}-${Date.now()}`

    // =========================
    // 11. Create pending payment
    // =========================
    const payment = await prisma.payment.create({
      data: {
        orderId,
        paymentMethod: 'KHALTI',
        amount,
        transactionId,
        paymentStatus: 'PENDING'
      }
    })

    // =========================
    // 12. Khalti API URL
    // =========================
    // Use production URL for Vercel deployments or if explicitly set
    const isProduction = process.env.NODE_ENV === 'production' || 
                        process.env.VERCEL_ENV === 'production' ||
                        process.env.KHALTI_ENV === 'production'
    
    const khaltiUrl = isProduction
      ? 'https://khalti.com/api/v2/epayment/initiate/'
      : 'https://a.khalti.com/api/v2/epayment/initiate/'

    // =========================
    // 13. App URL
    // =========================
    let appUrl = process.env.APP_URL

    // For Vercel deployments, use the host from the request
    if (!appUrl && process.env.VERCEL) {
      const host = request.headers.get('host') || 'localhost:3000'
      const protocol = request.headers.get('x-forwarded-proto') || 'https'
      appUrl = `${protocol}://${host}`
    }

    // Fallback to localhost for development
    if (!appUrl) {
      appUrl = 'http://localhost:3000'
    }

    // Remove trailing slash
    appUrl = appUrl.replace(/\/+$/, '')

    // Add protocol if missing
    if (
      !appUrl.startsWith('http://') &&
      !appUrl.startsWith('https://')
    ) {
      appUrl = `https://${appUrl}`
    }

    // =========================
    // 14. Return URL
    // =========================
    const finalReturnUrl =
      return_url ||
      `${appUrl}/api/payments/khalti/verify?orderId=${orderId}&transactionId=${transactionId}`

    // =========================
    // 15. Khalti Payment Data
    // =========================
    const paymentData = {
      return_url: finalReturnUrl,

      website_url: appUrl,

      // Khalti expects amount in paisa
      amount: Math.round(amount * 100),

      purchase_order_id: transactionId,

      purchase_order_name: `Order #${orderId}`,

      customer_info: {
        name: order.customerName,
        email: order.email || '',
        phone: order.phone
      }
    }

    console.log('========== KHALTI REQUEST ==========')
    console.log('Khalti URL:', khaltiUrl)
    console.log('Website URL:', appUrl)
    console.log('Return URL:', finalReturnUrl)
    console.log('Amount:', paymentData.amount)
    console.log('Purchase Order ID:', transactionId)
    console.log('Customer Name:', order.customerName)
    console.log('Customer Phone:', order.phone)
    console.log('=====================================')

    // =========================
    // 16. Send request to Khalti
    // =========================
    const khaltiResponse = await fetch(khaltiUrl, {
      method: 'POST',

      headers: {
        Authorization: `Key ${secretKey.trim()}`,
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(paymentData)
    })

    // =========================
    // 17. Get Khalti response
    // =========================
    const responseText = await khaltiResponse.text()

    console.log('========== KHALTI RESPONSE ==========')
    console.log('Status:', khaltiResponse.status)
    console.log('Response:', responseText)
    console.log('======================================')

    let khaltiData: any

    try {
      khaltiData = JSON.parse(responseText)
    } catch {
      console.error(
        'Khalti returned non-JSON response:',
        responseText
      )

      // Mark payment failed
      await prisma.payment.update({
        where: {
          id: payment.id
        },
        data: {
          paymentStatus: 'FAILED'
        }
      })

      return NextResponse.json(
        {
          error:
            'Khalti gateway returned an invalid response. Please try again.'
        },
        { status: 500 }
      )
    }

    // =========================
    // 18. Handle Khalti error
    // =========================
    if (!khaltiResponse.ok) {
      console.error(
        'Khalti API Error:',
        khaltiData
      )

      // Mark payment failed
      await prisma.payment.update({
        where: {
          id: payment.id
        },
        data: {
          paymentStatus: 'FAILED'
        }
      })

      return NextResponse.json(
        {
          error:
            khaltiData?.detail ||
            khaltiData?.message ||
            khaltiData?.error_key ||
            'Failed to initiate Khalti payment',

          khaltiError:
            process.env.NODE_ENV === 'development'
              ? khaltiData
              : undefined
        },
        { status: 500 }
      )
    }

    // =========================
    // 19. Validate payment URL
    // =========================
    if (!khaltiData?.payment_url) {
      console.error(
        'Khalti response does not contain payment_url:',
        khaltiData
      )

      await prisma.payment.update({
        where: {
          id: payment.id
        },
        data: {
          paymentStatus: 'FAILED'
        }
      })

      return NextResponse.json(
        {
          error:
            'Khalti did not return a payment URL. Please try again.'
        },
        { status: 500 }
      )
    }

    // =========================
    // 20. Success response
    // =========================
    return NextResponse.json({
      success: true,

      paymentUrl: khaltiData.payment_url,

      paymentId: payment.id,

      transactionId,

      pidx: khaltiData.pidx || null
    })
  } catch (error) {
    console.error(
      'Error initiating Khalti payment:',
      error
    )

    return NextResponse.json(
      {
        error:
          'An error occurred while initiating payment. Please try again.'
      },
      { status: 500 }
    )
  }
}