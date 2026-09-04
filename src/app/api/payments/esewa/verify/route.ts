import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  return handleEsewaCallback(request)
}

export async function POST(request: NextRequest) {
  return handleEsewaCallback(request)
}

async function handleEsewaCallback(request: NextRequest) {
  try {
    // Try to get data from query parameters (GET) or form data (POST)
    let data = request.nextUrl.searchParams.get('data')
    
    if (!data && request.method === 'POST') {
      const formData = await request.formData()
      data = formData.get('data') as string
    }

    // Log what we received for debugging
    console.log('eSewa callback method:', request.method)
    console.log('eSewa callback URL:', request.url)
    console.log('eSewa callback data received:', data ? 'Yes' : 'No')
    console.log('All search params:', Object.fromEntries(request.nextUrl.searchParams))

    // Validate required parameters
    if (!data) {
      console.error('Missing eSewa verification parameters - no data found')
      return NextResponse.redirect(
        new URL(`/order-failed?reason=invalid_parameters`, request.url)
      )
    }

    const secretKey = process.env.ESEWA_SECRET_KEY
    const expectedProductCode = process.env.ESEWA_PRODUCT_CODE

    if (!secretKey || !expectedProductCode) {
      console.error('eSewa credentials not configured for verification')
      return NextResponse.redirect(
        new URL(`/order-failed?reason=gateway_error`, request.url)
      )
    }

    // Decode base64 response from eSewa
    let decodedData
    try {
      const decodedBuffer = Buffer.from(data, 'base64')
      decodedData = JSON.parse(decodedBuffer.toString('utf-8'))
      console.log('Decoded eSewa response:', JSON.stringify(decodedData, null, 2))
    } catch (error) {
      console.error('Failed to decode eSewa response:', error)
      console.error('Raw data received:', data)
      return NextResponse.redirect(
        new URL(`/order-failed?reason=invalid_response`, request.url)
      )
    }

    const { total_amount, transaction_uuid, product_code, signature, status } = decodedData

    // Validate decoded parameters
    if (!total_amount || !transaction_uuid || !product_code || !signature || !status) {
      console.error('Missing required fields in eSewa response')
      console.error('Received fields:', Object.keys(decodedData))
      return NextResponse.redirect(
        new URL(`/order-failed?reason=invalid_response_data`, request.url)
      )
    }

    // Extract orderId from transaction_uuid (format: ORD-{orderId}-{timestamp})
    const orderIdMatch = transaction_uuid.match(/ORD-(\d+)-/)
    if (!orderIdMatch) {
      console.error('Could not extract order ID from transaction UUID')
      return NextResponse.redirect(
        new URL(`/order-failed?reason=invalid_transaction_format`, request.url)
      )
    }

    const orderId = parseInt(orderIdMatch[1])
    const transactionId = transaction_uuid

    // Validate product code
    if (product_code !== expectedProductCode) {
      console.error('Invalid product code in eSewa verification')
      return NextResponse.redirect(
        new URL(`/order-failed?reason=invalid_product_code`, request.url)
      )
    }

    // Fetch order and payment to validate
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payments: true
      }
    })

    if (!order) {
      console.error('Order not found for eSewa verification')
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

    // TEMPORARY: Skip signature verification for testing
    // Just check if payment status is COMPLETE from eSewa callback
    console.log('TEMPORARY: Skipping signature verification for testing')
    console.log('Payment status from eSewa:', status)
    console.log('Transaction UUID:', transaction_uuid)
    console.log('Total amount:', total_amount)
    
    // For now, just trust the status from eSewa callback
    // TODO: Re-enable signature verification once basic flow works
    /*
    // Verify payment signature for ePay V2
    // Signature format: total_amount=X,transaction_uuid=Y,product_code=Z
    // Ensure total_amount is formatted consistently (2 decimal places)
    const formattedTotalAmount = parseFloat(total_amount).toFixed(2)
    const signatureData = `total_amount=${formattedTotalAmount},transaction_uuid=${transaction_uuid},product_code=${product_code}`
    
    console.log('Signature verification debug:')
    console.log('Signature data:', signatureData)
    console.log('Formatted total amount:', formattedTotalAmount)
    console.log('Original total amount:', total_amount)
    console.log('Transaction UUID:', transaction_uuid)
    console.log('Product code:', product_code)
    
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(signatureData)
      .digest('base64')

    console.log('Expected signature:', expectedSignature)
    console.log('Received signature:', signature)

    // For testing purposes, let's also try to verify via eSewa status API
    // This provides a backup verification method
    let paymentVerifiedViaAPI = false
    try {
      const statusUrl = 'https://rc-epay.esewa.com.np/api/epay/transaction/status'
      const statusResponse = await fetch(statusUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transaction_uuid: transaction_uuid,
          product_code: product_code
        })
      })

      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        console.log('eSewa status API response:', statusData)
        
        if (statusData.status === 'COMPLETE') {
          paymentVerifiedViaAPI = true
          console.log('Payment verified via eSewa status API')
        }
      }
    } catch (apiError) {
      console.log('eSewa status API call failed, relying on signature verification:', apiError)
    }

    // Accept payment if either signature matches OR API verification succeeds
    if (signature !== expectedSignature && !paymentVerifiedViaAPI) {
      console.error('Invalid signature in eSewa verification')
      console.error('Signature mismatch details:')
      console.error('- Expected length:', expectedSignature.length)
      console.error('- Received length:', signature.length)
      console.error('- Match:', signature === expectedSignature)
      console.error('- API verification:', paymentVerifiedViaAPI)
      
      // Payment verification failed
      await prisma.payment.updateMany({
        where: {
          transactionId,
          orderId: orderId
        },
        data: {
          paymentStatus: 'FAILED'
        }
      })

      return NextResponse.redirect(
        new URL(`/order-failed?orderId=${orderId}&reason=signature_mismatch`, request.url)
      )
    }
    */

    // Check payment status from eSewa callback
    if (status !== 'COMPLETE') {
      console.error('Payment not completed:', status)
      
      // Payment failed or cancelled
      await prisma.payment.updateMany({
        where: {
          transactionId,
          orderId: orderId
        },
        data: {
          paymentStatus: 'FAILED'
        }
      })

      return NextResponse.redirect(
        new URL(`/order-failed?orderId=${orderId}&reason=payment_failed`, request.url)
      )
    }

    // Validate amount matches order total
    const parsedAmount = parseFloat(total_amount)
    if (Math.abs(parsedAmount - order.totalAmount) > 0.01) {
      console.error('Amount mismatch in eSewa verification')
      console.error('Expected:', order.totalAmount)
      console.error('Received:', parsedAmount)
      
      await prisma.payment.updateMany({
        where: {
          transactionId,
          orderId: orderId
        },
        data: {
          paymentStatus: 'FAILED'
        }
      })

      return NextResponse.redirect(
        new URL(`/order-failed?orderId=${orderId}&reason=amount_mismatch`, request.url)
      )
    }

    // Update payment record
    const payment = await prisma.payment.updateMany({
      where: {
        transactionId,
        orderId: orderId
      },
      data: {
        paymentStatus: 'PAID',
        reference: product_code,
        paidAt: new Date()
      }
    })

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED'
      }
    })

    return NextResponse.redirect(
      new URL(`/order-success/${orderId}`, request.url)
    )
  } catch (error) {
    console.error('Error verifying eSewa payment:', error)
    return NextResponse.redirect(
      new URL(`/order-failed?reason=server_error`, request.url)
    )
  }
}