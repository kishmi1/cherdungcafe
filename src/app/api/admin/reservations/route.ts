import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'
import { sendReservationStatusUpdateEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    // Check admin session
    const authResult = requireAdminSession(request)
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    // Fetch reservations from database
    const reservations = await prisma.reservation.findMany({
      orderBy: [
        { reservationDate: 'asc' },
        { reservationTime: 'asc' }
      ]
    })

    return NextResponse.json({ reservations })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching reservations' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin session
    const authResult = requireAdminSession(request)
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update reservation status
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status }
    })

    // Send email notification to customer about status update
    try {
      await sendReservationStatusUpdateEmail({
        id: reservation.id,
        name: reservation.name,
        email: reservation.email,
        numberOfGuests: reservation.numberOfGuests,
        reservationDate: reservation.reservationDate,
        reservationTime: reservation.reservationTime,
        status: reservation.status
      })
    } catch (emailError) {
      console.error('Failed to send reservation status update email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ reservation })
  } catch (error) {
    console.error('Error updating reservation:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating reservation' },
      { status: 500 }
    )
  }
}