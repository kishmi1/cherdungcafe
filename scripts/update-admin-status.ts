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
  // Update existing admin user to have ACTIVE status
  const admin = await prisma.user.updateMany({
    where: { email: 'admin@cherdungcafe.com' },
    data: { status: 'ACTIVE' }
  })

  console.log('Admin user status updated:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
