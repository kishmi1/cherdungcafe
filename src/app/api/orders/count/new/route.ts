import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Count orders with PENDING status (new orders)
    const newOrderCount = await prisma.order.count({
      where: {
        status: 'PENDING'
      }
    })

    return NextResponse.json({ count: newOrderCount })
  } catch (error) {
    console.error('Error fetching new order count:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching order count' },
      { status: 500 }
    )
  }
}