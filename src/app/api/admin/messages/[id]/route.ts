import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function checkAdminAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get('adminSession')
  
  if (!sessionCookie) {
    return null
  }

  let sessionData
  try {
    sessionData = JSON.parse(sessionCookie.value)
  } catch (error) {
    return null
  }

  if (!sessionData.userId || !sessionData.role || sessionData.role !== 'ADMIN') {
    return null
  }

  return sessionData
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionData = await checkAdminAuth(request)
    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const messageId = parseInt(id)

    if (isNaN(messageId)) {
      return NextResponse.json(
        { error: 'Invalid message ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { isRead } = body

    const message = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: isRead !== undefined ? isRead : true },
    })

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionData = await checkAdminAuth(request)
    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const messageId = parseInt(id)

    if (isNaN(messageId)) {
      return NextResponse.json(
        { error: 'Invalid message ID' },
        { status: 400 }
      )
    }

    await prisma.message.delete({
      where: { id: messageId },
    })

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
}
