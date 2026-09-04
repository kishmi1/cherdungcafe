import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin session
    const authResult = requireAdminSession(request)
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const { id } = await params
    const orderId = parseInt(id)
    const { status, paymentStatus } = await request.json()

    if (!status && !paymentStatus) {
      return NextResponse.json(
        { error: 'Status or paymentStatus is required' },
        { status: 400 }
      )
    }

    // Fetch the order first to check current state
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Admins have full permissions, but we should still prevent marking online payments as PAID
    // without proper verification for security
    if (paymentStatus === 'PAID' && existingOrder.paymentMethod !== 'CASH') {
      return NextResponse.json(
        { error: 'Online payments can only be marked as paid through payment gateway verification' },
        { status: 403 }
      )
    }

    // Validate status transitions
    if (status) {
      const statusOrder = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED']
      const currentIndex = statusOrder.indexOf(existingOrder.status)
      const targetIndex = statusOrder.indexOf(status)

      // Can only move forward or cancel
      if (status !== 'CANCELLED' && targetIndex < currentIndex) {
        return NextResponse.json(
          { error: 'Cannot revert order status' },
          { status: 400 }
        )
      }
    }

    // Update order status, payment status, or both
    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    })

    // Send status update email if customer email is provided and status was updated
    if (order.email && status) {
      try {
        await sendOrderStatusUpdateEmail({
          orderId: order.id,
          customerName: order.customerName,
          customerEmail: order.email,
          newStatus: status
        })
      } catch (emailError) {
        console.error('Failed to send order status update email:', emailError)
        // Don't fail the status update if email fails
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating order' },
      { status: 500 }
    )
  }
}