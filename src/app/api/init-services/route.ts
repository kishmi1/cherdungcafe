import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Delete existing services
    await prisma.service.deleteMany()

    // Create initial services
    const services = [
      {
        title: 'Specialty Coffee',
        description: 'Freshly brewed coffee crafted by our baristas using quality beans.',
        icon: 'coffee',
        priceNote: 'Starting from $3.50',
        sortOrder: 1,
        isActive: true,
      },
      {
        title: 'Dine-In Experience',
        description: 'Enjoy delicious food and drinks in our warm and comfortable space.',
        icon: 'utensils',
        priceNote: 'No minimum order',
        sortOrder: 2,
        isActive: true,
      },
      {
        title: 'Takeaway',
        description: 'Freshly prepared meals and beverages, ready to enjoy wherever you go.',
        icon: 'takeaway',
        priceNote: 'Ready in 5 minutes',
        sortOrder: 3,
        isActive: true,
      },
      {
        title: 'Bakery & Fresh Bakes',
        description: 'Fresh pastries, cakes, muffins and other delicious baked treats.',
        icon: 'bakery',
        priceNote: 'Daily from 7am',
        sortOrder: 4,
        isActive: true,
      },
      {
        title: 'Catering',
        description: 'Food and beverage service for meetings, gatherings and special occasions.',
        icon: 'truck',
        priceNote: 'Custom quotes available',
        sortOrder: 5,
        isActive: true,
      },
      {
        title: 'Private Events',
        description: 'A cozy space for birthdays, celebrations, meetings and private gatherings.',
        icon: 'events',
        priceNote: 'Requires booking',
        sortOrder: 6,
        isActive: true,
      },
    ]

    for (const service of services) {
      await prisma.service.create({
        data: service,
      })
    }

    return NextResponse.json({ message: 'Services initialized successfully!' })
  } catch (error) {
    console.error('Error initializing services:', error)
    return NextResponse.json({ error: 'Failed to initialize services' }, { status: 500 })
  }
}