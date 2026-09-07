import { NextRequest, NextResponse } from 'next/server'
import { sendReservationStatusUpdateEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, email, numberOfGuests, reservationDate, reservationTime, status } = body

    if (!email || !name || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, status' },
        { status: 400 }
      )
    }

    const testData = {
      id: id || 1,
      name,
      email,
      numberOfGuests: numberOfGuests || 2,
      reservationDate: reservationDate ? new Date(reservationDate) : new Date(),
      reservationTime: reservationTime || '18:00',
      status: status.toUpperCase()
    }

    console.log('Testing reservation status update email with data:', testData)

    const success = await sendReservationStatusUpdateEmail(testData)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Reservation status update email sent successfully',
        testData
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send reservation status update email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending test reservation email:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}