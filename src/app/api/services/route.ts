import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

// POST create new service
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, icon, image, priceNote, sortOrder, isActive } = body

    const service = await prisma.service.create({
      data: {
        title,
        description,
        icon: icon || 'coffee',
        image,
        priceNote,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
