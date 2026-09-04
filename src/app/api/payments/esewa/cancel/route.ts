import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  return handleEsewaCancelCallback(request)
}

export async function POST(request: NextRequest) {
  return handleEsewaCancelCallback(request)
}

async function handleEsewaCancelCallback(request: NextRequest) {
  try {
    console.log('eSewa cancel callback method:', request.method)
    console.log('eSewa cancel callback URL:', request.url)
    console.log('All search params:', Object.fromEntries(request.nextUrl.searchParams))

    // Try to get data from query parameters (GET) or form data (POST)
    let data = request.nextUrl.searchParams.get('data')
    
    if (!data && request.method === 'POST') {
      const formData = await request.formData()
      data = formData.get('data') as string
    }

    console.log('eSewa cancel callback data received:', data ? 'Yes' : 'No')

    if (!data) {
      // If no data parameter, this might be a direct redirect without eSewa callback
      // Check if we have orderId in query params
      const orderId = request.nextUrl.searchParams.get('orderId')
      if (orderId) {
        console.log('Direct cancel redirect for order:', orderId)
        // Update payment status to failed for this order
        await prisma.payment.updateMany({
          where: {
            orderId: parseInt(orderId),
            paymentStatus: 'PENDING'
          },
          data: {
            paymentStatus: 'FAILED'
          }
        })

        return NextResponse.redirect(
          new URL(`/order-failed?orderId=${orderId}&reason=payment_cancelled`, request.url)
        )
      }

      return NextResponse.redirect(
        new URL(`/order-failed?reason=invalid_parameters`, request.url)
      )
    }

    // Decode base64 response from eSewa
    let decodedData
    try {
      const decodedBuffer = Buffer.from(data, 'base64')
      decodedData = JSON.parse(decodedBuffer.toString('utf-8'))
      console.log('Decoded eSewa cancel response:', JSON.stringify(decodedData, null, 2))
    } catch (error) {
      console.error('Failed to decode eSewa response:', error)
      console.error('Raw data received:', data)
      return NextResponse.redirect(
        new URL(`/order-failed?reason=invalid_response`, request.url)
      )
    }

    const { transaction_uuid, status } = decodedData

    if (!transaction_uuid) {
      console.error('Missing transaction_uuid in eSewa response')
      return NextResponse.redirect(
        new URL(`/order-failed?reason=invalid_response_data`, request.url)
      )
    }

    // Extract orderId from transaction_uuid (format: ORD-{orderId}-{uuid})
    const orderIdMatch = transaction_uuid.match(/ORD-(\d+)-/)
    if (!orderIdMatch) {
      console.error('Could not extract order ID from transaction UUID:', transaction_uuid)
      return NextResponse.redirect(
        new URL(`/order-failed?reason=invalid_transaction_format`, request.url)
      )
    }

    const orderId = parseInt(orderIdMatch[1])
    const transactionId = transaction_uuid

    // Update payment status to failed
    await prisma.payment.updateMany({
      where: {
        transactionId,
        orderId: orderId
      },
      data: {
        paymentStatus: 'FAILED'
      }
    })

    // Note: We don't cancel the order itself, just mark payment as failed
    // The order remains in PENDING status and customer can retry payment

    // Determine failure reason based on status
    let failureReason = 'payment_cancelled'
    if (status === 'FAILED') {
      failureReason = 'payment_failed'
    } else if (status === 'PENDING') {
      failureReason = 'payment_pending'
    }

    console.log('Payment cancelled for order:', orderId, 'reason:', failureReason)
    return NextResponse.redirect(
      new URL(`/order-failed?orderId=${orderId}&reason=${failureReason}`, request.url)
    )
  } catch (error) {
    console.error('Error handling eSewa payment cancellation:', error)
    return NextResponse.redirect(
      new URL(`/order-failed?reason=server_error`, request.url)
    )
  }
}