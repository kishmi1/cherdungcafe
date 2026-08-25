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

    // Get counts
    const newEnquiries = await prisma.enquiry.count({
      where: { status: 'NEW' }
    })

    const unreadMessages = await prisma.message.count({
      where: { isRead: false }
    })

    const pendingEnquiries = await prisma.enquiry.count({
      where: { status: 'IN_PROGRESS' }
    })

    const confirmedEnquiries = await prisma.enquiry.count({
      where: { status: 'RESOLVED' }
    })

    // Get recent enquiries
    const recentEnquiries = await prisma.enquiry.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        subject: true,
        status: true,
        createdAt: true
      }
    })

    // Get recent messages
    const recentMessages = await prisma.message.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        subject: true,
        isRead: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      newEnquiries,
      unreadMessages,
      pendingEnquiries,
      confirmedEnquiries,
      recentEnquiries,
      recentMessages
    })
  } catch (error) {
    console.error('Error fetching staff dashboard stats:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching dashboard statistics' },
      { status: 500 }
    )
  }
}
