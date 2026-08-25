import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireStaffSession } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check staff session
    const authResult = requireStaffSession(request)
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const { message } = await request.json()
    const { id } = await params
    const enquiryId = parseInt(id)

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Create reply
    const reply = await prisma.enquiryReply.create({
      data: {
        enquiryId,
        message: message.trim()
      }
    })

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating reply' },
      { status: 500 }
    )
  }
}
