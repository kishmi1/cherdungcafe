import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single offer
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const offer = await prisma.offer.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error fetching offer:', error)
    return NextResponse.json({ error: 'Failed to fetch offer' }, { status: 500 })
  }
}

// PUT update offer
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, image, discount, promoCode, startsAt, endsAt, isFeatured, terms } = body

    // Validate date range if provided
    if (startsAt && endsAt) {
      const startDate = new Date(startsAt)
      const endDate = new Date(endsAt)
      
      if (startDate >= endDate) {
        return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 })
      }
    }

    const offer = await prisma.offer.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(image !== undefined && { image }),
        ...(discount !== undefined && { discount }),
        ...(promoCode !== undefined && { promoCode }),
        ...(startsAt && { startsAt: new Date(startsAt) }),
        ...(endsAt && { endsAt: new Date(endsAt) }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(terms !== undefined && { terms })
      }
    })

    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error updating offer:', error)
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 })
  }
}

// DELETE offer
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.offer.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting offer:', error)
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 })
  }
}
