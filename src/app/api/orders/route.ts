import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    const {
      customerName,
      phone,
      email,
      orderType,
      address,
      paymentMethod,
      notes,
      items,
      subtotal,
      deliveryFee,
      totalAmount,
    } = orderData

    // Validate required fields
    if (!customerName || !phone || !orderType || !paymentMethod || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        )
      }
    }

    // Validate delivery address
    if (orderType === 'DELIVERY' && !address) {
      return NextResponse.json(
        { error: 'Address is required for delivery orders' },
        { status: 400 }
      )
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        email,
        orderType,
        address: orderType === 'DELIVERY' ? address : null,
        paymentMethod,
        notes: notes || null,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal,
        deliveryFee,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    })

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: email,
        items: order.items.map(item => ({
          title: item.menuItem.title,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: order.totalAmount,
        orderType: order.orderType,
        status: order.status
      })
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({ orderId: order.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating your order' },
      { status: 500 }
    )
  }
}