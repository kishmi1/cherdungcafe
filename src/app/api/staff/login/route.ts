import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is STAFF role
    if (user.role !== 'STAFF') {
      return NextResponse.json(
        { error: 'Access denied. Staff access only.' },
        { status: 403 }
      )
    }

    // Check if staff account is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Your account is currently inactive. Please contact your administrator.' },
        { status: 403 }
      )
    }

    // Create session data
    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      position: user.position
    }

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        position: user.position
      },
      redirectUrl: '/staff/dashboard'
    })

    // Set staff session cookie
    response.cookies.set('staffSession', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    console.log('Staff session cookie set for:', user.email)
    return response
  } catch (error) {
    console.error('Staff login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}