import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { $Enums } from '@/generated/prisma/client'

export async function POST() {
  try {
    console.log('Checking for existing STAFF users...');
    
    const staffUsers = await prisma.user.findMany({
      where: { role: $Enums.UserRole.STAFF }
    });
    
    console.log(`Found ${staffUsers.length} users with STAFF role`);
    
    if (staffUsers.length > 0) {
      console.log('Updating STAFF users to ADMIN...');
      
      for (const user of staffUsers) {
        console.log(`Updating user: ${user.email} (${user.name})`);
        await prisma.user.update({
          where: { id: user.id },
          data: { role: $Enums.UserRole.ADMIN }
        });
      }
      
      console.log('Successfully updated all STAFF users to ADMIN');
      return NextResponse.json({ 
        success: true, 
        message: `Updated ${staffUsers.length} STAFF users to ADMIN` 
      });
    } else {
      console.log('No STAFF users found, no update needed');
      return NextResponse.json({ 
        success: true, 
        message: 'No STAFF users found' 
      });
    }
    
  } catch (error) {
    console.error('Error updating roles:', error);
    return NextResponse.json(
      { error: 'Failed to update roles' },
      { status: 500 }
    );
  }
}