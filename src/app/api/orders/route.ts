import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
        email: email || null,
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

    return NextResponse.json({ orderId: order.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating your order' },
      { status: 500 }
    )
  }
}