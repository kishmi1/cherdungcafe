import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function updateRoles() {
  try {
    console.log('Checking for existing users...');
    
    const allUsers = await prisma.user.findMany();
    
    console.log(`Found ${allUsers.length} users in database`);
    
    // This script is now obsolete since we removed the permission system
    console.log('This script is no longer needed - permission system has been removed');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateRoles();