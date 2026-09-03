import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  // Delete existing services
  await prisma.service.deleteMany()

  // Create default settings if they don't exist
  const existingSettings = await prisma.settings.findFirst()
  if (!existingSettings) {
    await prisma.settings.create({
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
    console.log('Default settings created!')
  }

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

  console.log('Services seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })