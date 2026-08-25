import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireStaffSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check staff session
    const authResult = requireStaffSession(request)
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    // Get all enquiries
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        replies: {
          orderBy: { sentAt: 'desc' }
        }
      }
    })

    return NextResponse.json(enquiries)
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching enquiries' },
      { status: 500 }
    )
  }
}
