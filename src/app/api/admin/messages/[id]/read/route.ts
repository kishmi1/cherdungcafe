import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const messageId = parseInt(id)

    if (isNaN(messageId)) {
      return NextResponse.json(
        { error: 'Invalid message ID' },
        { status: 400 }
      )
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    })

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error) {
    console.error('Error marking message as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark message as read' },
      { status: 500 }
    )
  }
}
