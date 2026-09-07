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

    // Check if this is a debug request
    const { searchParams } = new URL(request.url)
    const debug = searchParams.get('debug')

    if (debug === 'emails') {
      // Debug: Return all email addresses in reservations
      const reservations = await prisma.reservation.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          status: true
        }
      })

      const emailCounts: Record<string, number> = {}

      // Count emails
      reservations.forEach(r => {
        emailCounts[r.email] = (emailCounts[r.email] || 0) + 1
      })

      const emailStats = {
        total: reservations.length,
        uniqueEmails: [...new Set(reservations.map(r => r.email))],
        emailCounts
      }

      return NextResponse.json({
        debug: true,
        reservations,
        stats: emailStats
      })
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

    // First, get the current reservation to check email
    const currentReservation = await prisma.reservation.findUnique({
      where: { id }
    })

    if (!currentReservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    console.log('Current reservation email:', currentReservation.email)
    console.log('Updating reservation ID:', id, 'from status:', currentReservation.status, 'to:', status)

    // Update reservation status
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status }
    })

    // Send email notification to customer about status update
    try {
      console.log('Sending status update email to:', reservation.email, 'for reservation:', reservation.id)
      await sendReservationStatusUpdateEmail({
        id: reservation.id,
        name: reservation.name,
        email: reservation.email,
        numberOfGuests: reservation.numberOfGuests,
        reservationDate: reservation.reservationDate,
        reservationTime: reservation.reservationTime,
        status: reservation.status
      })
      console.log('Status update email sent successfully to:', reservation.email)
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