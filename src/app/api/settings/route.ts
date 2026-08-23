import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

// GET settings (returns the first settings record or creates default)
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
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT update settings
export async function PUT(request: Request) {
  try {
    console.log('PUT request received for settings')
    const body = await request.json()
    console.log('Received settings update:', body)
    
    // Get the first settings record
    let settings = await prisma.settings.findFirst()
    console.log('Current settings:', settings)
    
    if (!settings) {
      // Create if doesn't exist
      console.log('Creating new settings')
      settings = await prisma.settings.create({
        data: body
      })
    } else {
      // Update existing
      console.log('Updating existing settings with ID:', settings.id)
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: body
      })
    }
    
    console.log('Settings saved successfully:', settings)
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Error updating settings:', error)
    console.error('Error type:', typeof error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update settings', 
      details: errorMessage 
    }, { status: 500 })
  }
}