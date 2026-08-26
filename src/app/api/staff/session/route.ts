import { NextRequest, NextResponse } from 'next/server'
import { getStaffSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = getStaffSession(request)
    
    if (!session) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      position: session.position,
      permissions: session.permissions || []
    })
  } catch (error) {
    console.error('Error getting staff session:', error)
    return NextResponse.json(
      { error: 'An error occurred while getting session' },
      { status: 500 }
    )
  }
}