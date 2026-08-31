import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  sendReservationConfirmationToCafe, 
  sendReservationConfirmationToCustomer 
} from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, numberOfGuests, reservationDate, reservationTime, specialRequest } = body

    console.log('Prisma client available:', !!prisma)
    console.log('Prisma reservation model available:', !!prisma?.reservation)

    // Validate required fields
    if (!name || !email || !phone || !numberOfGuests || !reservationDate || !reservationTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate numberOfGuests
    const guestsNum = parseInt(numberOfGuests)
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 20) {
      return NextResponse.json(
        { error: 'Number of guests must be between 1 and 20' },
        { status: 400 }
      )
    }

    // Validate reservation date (must be today or in the future)
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Set to start of today for comparison
    
    const reservationDateOnly = new Date(reservationDate)
    reservationDateOnly.setHours(0, 0, 0, 0)
    
    if (reservationDateOnly < now) {
      return NextResponse.json(
        { error: 'Reservation date must be today or in the future' },
        { status: 400 }
      )
    }

    // Generate reservation ID
    const reservationId = `RES-${Date.now().toString().slice(-4)}`

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phone,
        numberOfGuests: guestsNum,
        reservationDate: new Date(reservationDate),
        reservationTime,
        specialRequest: specialRequest || null,
        status: 'PENDING'
      }
    })

    // Send email notifications
    try {
      await sendReservationConfirmationToCafe({
        id: reservation.id,
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        numberOfGuests: reservation.numberOfGuests,
        reservationDate: reservation.reservationDate,
        reservationTime: reservation.reservationTime,
        specialRequest: reservation.specialRequest
      })

      await sendReservationConfirmationToCustomer({
        id: reservation.id,
        name: reservation.name,
        email: reservation.email,
        numberOfGuests: reservation.numberOfGuests,
        reservationDate: reservation.reservationDate,
        reservationTime: reservation.reservationTime,
        specialRequest: reservation.specialRequest
      })
    } catch (emailError) {
      console.error('Failed to send reservation emails:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      reservationId,
      reservation: {
        id: reservation.id,
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        numberOfGuests: reservation.numberOfGuests,
        reservationDate: reservation.reservationDate,
        reservationTime: reservation.reservationTime,
        specialRequest: reservation.specialRequest,
        status: reservation.status
      }
    })

  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating reservation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
