import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all services
export async function GET() {
  try {
    console.log('Fetching all services...')
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    console.log('Services fetched:', services)
    console.log('Services is array:', Array.isArray(services))
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

// POST create new service
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received service data:', body)
    
    const { title, description, image, priceNote, sortOrder, isActive } = body

    // Validate required fields
    if (!title || !description) {
      console.log('Validation failed: missing required fields')
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    console.log('Attempting to create service with data:', {
      title,
      description,
      image,
      priceNote,
      sortOrder,
      isActive
    })

    const service = await prisma.service.create({
      data: {
        title,
        description,
        image: image || null,
        priceNote: priceNote || null,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    console.log('Service created successfully:', service)
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      error: 'Failed to create service', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
