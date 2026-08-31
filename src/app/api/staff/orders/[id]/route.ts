import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireStaffSession } from '@/lib/auth'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

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

    const { id } = await params
    const orderId = parseInt(id)
    const { status, paymentStatus } = await request.json()

    if (!status && !paymentStatus) {
      return NextResponse.json(
        { error: 'Status or paymentStatus is required' },
        { status: 400 }
      )
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