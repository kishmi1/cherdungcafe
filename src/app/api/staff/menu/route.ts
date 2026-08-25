import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireStaffSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check staff session
    const authResult = requireStaffSession(request)
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    // Get menu items
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        price: true,
        category: true,
        isPopular: true,
        isAvailable: true,
        sortOrder: true
      }
    })

    return NextResponse.json({ menuItems })
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching menu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check staff session
    const authResult = requireStaffSession(request)
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const { title, description, image, price, category, isPopular, isAvailable, sortOrder } = body

    if (!title?.trim() || !price?.trim()) {
      return NextResponse.json(
        { error: 'Title and price are required' },
        { status: 400 }
      )
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        image: image || null,
        price: price.trim(),
        category: category?.trim() || null,
        isPopular: Boolean(isPopular),
        isAvailable: isAvailable !== false,
        sortOrder: Number.isInteger(sortOrder) ? sortOrder : 0,
      },
    })

    return NextResponse.json(menuItem, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}