import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireStaffSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    // Check staff session
    const authResult = requireStaffSession(request)
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const session = authResult.session

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        position: true,
        profileImage: true,
        joiningDate: true,
        status: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check staff session
    const authResult = requireStaffSession(request)
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const session = authResult.session

    const { name, email, phone, currentPassword, newPassword } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser && existingUser.id !== session.userId) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {
      name,
      email,
      phone: phone || null
    }

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        )
      }

      // Verify current password
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { passwordHash: true }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Hash new password
      updateData.passwordHash = await bcrypt.hash(newPassword, 10)
    }

    // Update user (cannot change role, position, or status)
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        position: true,
        profileImage: true,
        joiningDate: true,
        status: true,
        createdAt: true
      }
    })

    // Update session cookie with new data
    const newSessionData = {
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      position: updatedUser.position
    }

    const response = NextResponse.json(updatedUser)
    response.cookies.set('staffSession', JSON.stringify(newSessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating profile' },
      { status: 500 }
    )
  }
}
