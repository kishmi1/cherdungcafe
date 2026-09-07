import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      brevoConfigured: !!process.env.BREVO_API_KEY,
      brevoApiKeyLength: process.env.BREVO_API_KEY?.length || 0,
      brevoApiKeyPrefix: process.env.BREVO_API_KEY?.substring(0, 8) + '...' || 'not set',
      fromEmail: process.env.FROM_EMAIL || 'not set',
      cafeEmail: process.env.CAFE_EMAIL || 'not set',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'not set',
      environment: process.env.NODE_ENV || 'not set'
    }

    // Test if Brevo client can be initialized
    let brevoTest: { success: boolean; error: string | null } = { success: false, error: null }
    try {
      const { BrevoClient } = await import('@getbrevo/brevo')
      if (process.env.BREVO_API_KEY) {
        const client = new BrevoClient({
          apiKey: process.env.BREVO_API_KEY
        })
        brevoTest = { success: true, error: null }
      } else {
        brevoTest = { success: false, error: 'BREVO_API_KEY not set' }
      }
    } catch (error) {
      brevoTest = { success: false, error: error instanceof Error ? error.message : String(error) }
    }

    return NextResponse.json({
      debug: true,
      config: debugInfo,
      brevoTest,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}