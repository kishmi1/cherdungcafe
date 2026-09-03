import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@cherdungcafe.com' }
  })

  if (existingAdmin) {
    console.log('Admin user already exists')
    return
  }

  // Hash password
  const passwordHash = await bcrypt.hash('admin123', 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@cherdungcafe.com',
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  })

  console.log('Admin user created successfully:', {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role
  })
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })