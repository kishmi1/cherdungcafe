import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireStaffSession } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const menuItemId = Number(id)
    const body = await request.json()
    const { title, description, image, price, category, isPopular, isAvailable, sortOrder } = body

    if (!Number.isInteger(menuItemId) || !title?.trim() || !price?.trim()) {
      return NextResponse.json(
        { error: 'Valid ID, title, and price are required' },
        { status: 400 }
      )
    }

    const menuItem = await prisma.menuItem.update({
      where: { id: menuItemId },
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

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    await prisma.menuItem.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}
