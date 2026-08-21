import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('adminSession')

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value)
      if (!sessionData.userId || !sessionData.email) {
        return NextResponse.json(
          { error: 'Invalid session' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        success: true,
        user: {
          id: sessionData.userId,
          email: sessionData.email,
          name: sessionData.name,
          role: sessionData.role
        }
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}