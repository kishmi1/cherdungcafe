import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get('adminSession')
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    if (!sessionData.userId || !sessionData.role) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Check if user is ADMIN
    if (sessionData.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      messages,
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
