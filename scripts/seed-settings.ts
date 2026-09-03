import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  // Check if settings already exist
  const existingSettings = await prisma.settings.findFirst()

  if (existingSettings) {
    console.log('Settings already exist')
    return
  }

  // Create default settings
  const settings = await prisma.settings.create({
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
      socialLinkedIn: '',
      logoUrl: '',
      faviconUrl: '',
      logoSize: 'medium',
    }
  })

  console.log('Default settings created successfully:', {
    id: settings.id,
    siteName: settings.siteName,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
