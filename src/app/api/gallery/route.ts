import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all gallery images
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const where = category ? { category } : {}
    
    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    })
    
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
  }
}

// POST create new gallery image
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, caption, category, sortOrder } = body

    const image = await prisma.galleryImage.create({
      data: {
        url,
        caption,
        category,
        sortOrder: sortOrder || 0
      }
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 })
  }
}
