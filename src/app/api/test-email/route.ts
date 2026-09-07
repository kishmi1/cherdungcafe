import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

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

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Email - Cherdung Café</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7A4E2D 0%, #B68A52 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Test Email</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Cherdung Café</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="font-size: 16px; color: #333;">Hello!</p>
            
            <p style="color: #555;">This is a test email from Cherdung Café. If you received this email, it means the Brevo email integration is working correctly!</p>
            
            <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <h3 style="color: #7A4E2D; margin-top: 0; border-bottom: 2px solid #B68A52; padding-bottom: 10px;">Test Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 8px; font-weight: bold; color: #555; width: 40%;">Sent to:</td>
                  <td style="padding: 10px 8px; color: #333;">${email}</td>
                </tr>
                <tr style="background: #f9f9f9;">
                  <td style="padding: 10px 8px; font-weight: bold; color: #555;">Time:</td>
                  <td style="padding: 10px 8px; color: #333;">${new Date().toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 8px; font-weight: bold; color: #555;">Status:</td>
                  <td style="padding: 10px 8px; color: #333; font-weight: bold; color: #28a745;">✓ Success</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #d4edda; padding: 16px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #28a745;">
              <p style="margin: 0; color: #155724; font-size: 14px;">
                <strong>Success!</strong> Your email configuration is working properly.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Cherdung Café. All rights reserved.</p>
            <p>This is a test email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const success = await sendEmail({
      to: email,
      subject: 'Test Email - Cherdung Café',
      html
    })

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        to: email
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}