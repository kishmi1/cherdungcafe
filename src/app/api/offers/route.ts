import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all offers (only active ones based on date range)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeAll = searchParams.get('includeAll') === 'true'
    
    const now = new Date()
    
    const where = includeAll ? {} : {
      AND: [
        { startsAt: { lte: now } },
        { endsAt: { gte: now } }
      ]
    }
    
    const offers = await prisma.offer.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { startsAt: 'asc' }
      ]
    })
    
    return NextResponse.json(offers)
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 })
  }
}

// POST create new offer
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, image, discount, promoCode, startsAt, endsAt, isFeatured, terms } = body

    // Validate required fields
    if (!title || !description || !startsAt || !endsAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate date range
    const startDate = new Date(startsAt)
    const endDate = new Date(endsAt)
    
    if (startDate >= endDate) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 })
    }

    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        image,
        discount,
        promoCode,
        startsAt: startDate,
        endsAt: endDate,
        isFeatured: isFeatured || false,
        terms
      }
    })

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 })
  }
}
