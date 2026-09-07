import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    const debugResults: {
      config: {
        brevoConfigured: boolean
        fromEmail: string
        cafeEmail: string
      }
      apiCall: { success: boolean; response: any; timestamp: string } | null
      error: { message: string; stack: string; response: any; status: number } | null
    } = {
      config: {
        brevoConfigured: !!process.env.BREVO_API_KEY,
        fromEmail: process.env.FROM_EMAIL || 'not set',
        cafeEmail: process.env.CAFE_EMAIL || 'not set'
      },
      apiCall: null,
      error: null
    }

    try {
      const { BrevoClient } = await import('@getbrevo/brevo')
      
      if (!process.env.BREVO_API_KEY) {
        throw new Error('BREVO_API_KEY not configured')
      }

      const brevo = new BrevoClient({
        apiKey: process.env.BREVO_API_KEY
      })

      const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@cherdungcafe.com'

      const sendSmtpEmail = {
        to: [{ email }],
        sender: { email: FROM_EMAIL, name: 'Cherdung Café' },
        subject: 'Brevo API Test - Debug',
        htmlContent: '<h1>Test Email</h1><p>This is a test email from Brevo API.</p>',
        textContent: 'Test email from Brevo API'
      }

      console.log('Sending Brevo API call with data:', {
        to: email,
        from: FROM_EMAIL,
        subject: 'Brevo API Test - Debug'
      })

      const result = await brevo.transactionalEmails.sendTransacEmail(sendSmtpEmail)
      
      debugResults.apiCall = {
        success: true,
        response: result,
        timestamp: new Date().toISOString()
      }

      console.log('Brevo API result:', result)

    } catch (error) {
      debugResults.error = {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? (error.stack || 'No stack available') : String(error),
        response: (error as any).response?.data || (error as any).response,
        status: (error as any).response?.status
      }
      console.error('Brevo API error:', error)
    }

    return NextResponse.json(debugResults)
  } catch (error) {
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}