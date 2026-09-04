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

    // Validate payment method
    const validPaymentMethods = ['CASH', 'ESEWA', 'KHALTI']
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // SECURITY: Server-side price verification
    // Calculate the actual total from database prices to prevent price manipulation
    let calculatedSubtotal = 0
    const validatedItems = []

    for (const item of items) {
      // Fetch the actual menu item from database
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      })

      if (!menuItem) {
        return NextResponse.json(
          { error: `Menu item with ID ${item.menuItemId} not found` },
          { status: 400 }
        )
      }

      if (!menuItem.isAvailable) {
        return NextResponse.json(
          { error: `Menu item ${menuItem.title} is not available` },
          { status: 400 }
        )
      }

      // Parse the price from string to float
      const actualPrice = parseFloat(menuItem.price.replace(/[^0-9.]/g, ''))
      const itemSubtotal = actualPrice * item.quantity
      calculatedSubtotal += itemSubtotal

      validatedItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price, // Use the actual price from database
      })
    }

    // Calculate expected delivery fee
    const expectedDeliveryFee = orderType === 'DELIVERY' ? 50 : 0
    const expectedTotal = calculatedSubtotal + expectedDeliveryFee

    // Verify the total amount matches (with small tolerance for floating point)
    if (Math.abs(totalAmount - expectedTotal) > 0.01) {
      return NextResponse.json(
        { error: 'Amount mismatch. Please refresh and try again.' },
        { status: 400 }
      )
    }

    // Create order with validated items and prices
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
        paymentStatus: paymentMethod === 'CASH' ? 'PENDING' : 'PENDING', // Online payments start as PENDING
        subtotal: calculatedSubtotal,
        deliveryFee: expectedDeliveryFee,
        totalAmount: expectedTotal,
        items: {
          create: validatedItems,
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