import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireStaffSession } from '@/lib/auth'

export async function PATCH(
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

    const { isRead } = await request.json()
    const { id } = await params
    const messageId = parseInt(id)

    if (typeof isRead !== 'boolean') {
      return NextResponse.json(
        { error: 'isRead must be a boolean' },
        { status: 400 }
      )
    }

    // Update message read status
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { isRead }
    })

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating message' },
      { status: 500 }
    )
  }
}
