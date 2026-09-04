import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireStaffSession } from '@/lib/auth'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

// Role-based permission matrix
const rolePermissions = {
  SUPERVISOR: {
    canViewAllOrders: true,
    canUpdateOrderStatus: true,
    canViewPaymentInfo: true,
    canUpdatePaymentStatus: true,
    allowedStatusTransitions: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']
  },
  CASHIER: {
    canViewAllOrders: true,
    canUpdateOrderStatus: true,
    canViewPaymentInfo: true,
    canUpdatePaymentStatus: true, // Only for CASH payments
    allowedStatusTransitions: ['PENDING', 'CONFIRMED', 'CANCELLED']
  },
  KITCHEN_STAFF: {
    canViewAllOrders: true,
    canUpdateOrderStatus: true,
    canViewPaymentInfo: false,
    canUpdatePaymentStatus: false,
    allowedStatusTransitions: ['PREPARING', 'READY']
  },
  BARISTA: {
    canViewAllOrders: true,
    canUpdateOrderStatus: true,
    canViewPaymentInfo: false,
    canUpdatePaymentStatus: false,
    allowedStatusTransitions: ['PREPARING', 'READY']
  },
  WAITER: {
    canViewAllOrders: true,
    canUpdateOrderStatus: true,
    canViewPaymentInfo: false,
    canUpdatePaymentStatus: false,
    allowedStatusTransitions: ['READY', 'COMPLETED']
  }
}

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

    const session = authResult.session
    const userPosition = session.position as keyof typeof rolePermissions
    
    // Get permissions for user's position
    const permissions = rolePermissions[userPosition] || rolePermissions.WAITER // Default to WAITER if unknown

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

    // Check status update permissions
    if (status) {
      if (!permissions.canUpdateOrderStatus) {
        return NextResponse.json(
          { error: 'You do not have permission to update order status' },
          { status: 403 }
        )
      }

      if (!permissions.allowedStatusTransitions.includes(status)) {
        return NextResponse.json(
          { error: `You are not allowed to change order status to ${status}` },
          { status: 403 }
        )
      }

      // Validate status transitions
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

    // Check payment status update permissions
    if (paymentStatus) {
      if (!permissions.canUpdatePaymentStatus) {
        return NextResponse.json(
          { error: 'You do not have permission to update payment status' },
          { status: 403 }
        )
      }

      // Only CASHIER and SUPERVISOR can update payment status, and only for CASH payments
      if (existingOrder.paymentMethod !== 'CASH' && userPosition !== 'SUPERVISOR') {
        return NextResponse.json(
          { error: 'Cannot update payment status for online payments' },
          { status: 403 }
        )
      }

      // Prevent marking online payments as PAID without proper verification
      if (paymentStatus === 'PAID' && existingOrder.paymentMethod !== 'CASH') {
        return NextResponse.json(
          { error: 'Online payments can only be marked as paid through payment gateway verification' },
          { status: 403 }
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