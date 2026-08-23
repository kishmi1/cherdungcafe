import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

// GET public settings (for frontend use)
export async function GET() {
  try {
    let settings = await prisma.settings.findFirst()
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          siteName: 'Cherdung Café',
          siteDescription: 'Your neighborhood café serving delicious coffee and more',
          contactEmail: 'info@cherdungcafe.com',
          contactPhone: '+977-1-1234567',
          contactAddress: 'Sankhamul, Kathmandu 44600, Nepal',
          openingHours: 'Mon-Sun: 7:00 AM - 9:00 PM',
          businessHours: 'Mon-Sun: 7:00 AM - 9:00 PM',
          seoTitle: 'Cherdung Café - Coffee & More',
          seoDescription: 'Welcome to Cherdung Café, your neighborhood café serving delicious coffee, food, and more.',
          themeColor: '#B68A52',
          accentColor: '#7A4E2D',
          backgroundColor: '#F7F4EF',
          socialWhatsApp: '',
          socialTikTok: '',
        }
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching public settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}