import { Resend } from 'resend'

// Initialize Resend with API key from environment variable
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@cherdungcafe.com'
const CAFE_EMAIL = process.env.CAFE_EMAIL || 'info@cherdungcafe.com'

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailData): Promise<boolean> {
  if (!resend) {
    console.warn('Email service not configured. Email sending is disabled.')
    return false
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for plain text version
    })
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export async function sendEnquiryNotificationToCafe(enquiry: {
  name: string
  email: string
  phone?: string
  type: string
  subject: string
  message: string
}): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Enquiry - Cherdung Café</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7A4E2D 0%, #B68A52 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Enquiry Received</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #7A4E2D; margin-top: 0;">Enquiry Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 8px; font-weight: bold; color: #555; width: 30%;">Name:</td>
              <td style="padding: 12px 8px; color: #333;">${enquiry.name}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 12px 8px; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 12px 8px; color: #333;">${enquiry.email}</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 12px 8px; color: #333;">${enquiry.phone || 'Not provided'}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 12px 8px; font-weight: bold; color: #555;">Type:</td>
              <td style="padding: 12px 8px; color: #333;">${enquiry.type}</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; font-weight: bold; color: #555;">Subject:</td>
              <td style="padding: 12px 8px; color: #333;">${enquiry.subject}</td>
            </tr>
          </table>
          
          <h3 style="color: #7A4E2D; margin-top: 24px;">Message:</h3>
          <div style="background: white; padding: 16px; border-left: 4px solid #B68A52; margin: 12px 0; border-radius: 4px;">
            <p style="margin: 0; color: #333; white-space: pre-wrap;">${enquiry.message}</p>
          </div>
          
          <div style="margin-top: 24px; padding: 16px; background: #fff8e1; border-radius: 4px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Action Required:</strong> Please review this enquiry and respond to the customer within 24 hours.
            </p>
          </div>
          
          <div style="margin-top: 24px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/enquiries" 
               style="background: #7A4E2D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              View in Admin Panel
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This is an automated notification from Cherdung Café enquiry system.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: CAFE_EMAIL,
    subject: `New Enquiry: ${enquiry.subject} - ${enquiry.name}`,
    html
  })
}

export async function sendAcknowledgementToEnquirer(enquiry: {
  name: string
  email: string
  type: string
  subject: string
}): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for your enquiry - Cherdung Café</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7A4E2D 0%, #B68A52 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Your enquiry has been received</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333;">Dear ${enquiry.name},</p>
          
          <p style="color: #555;">Thank you for contacting Cherdung Café. We have received your enquiry regarding <strong>${enquiry.subject}</strong> and will get back to you within 24 hours.</p>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <h3 style="color: #7A4E2D; margin-top: 0; border-bottom: 2px solid #B68A52; padding-bottom: 10px;">Enquiry Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555; width: 40%;">Type:</td>
                <td style="padding: 10px 8px; color: #333;">${enquiry.type}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">Subject:</td>
                <td style="padding: 10px 8px; color: #333;">${enquiry.subject}</td>
              </tr>
            </table>
          </div>
          
          <h3 style="color: #7A4E2D;">What happens next?</h3>
          <ul style="color: #555; padding-left: 20px;">
            <li>Our team will review your enquiry</li>
            <li>You'll receive a personalized response via email</li>
            <li>For urgent matters, you can call us at +1 (555) 123-4567</li>
          </ul>
          
          <div style="margin-top: 24px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
               style="background: #7A4E2D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Visit Our Website
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Cherdung Café. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: enquiry.email,
    subject: `Thank you for your enquiry - ${enquiry.subject}`,
    html
  })
}

export async function sendReplyToCustomer(replyData: {
  customerName: string
  customerEmail: string
  enquirySubject: string
  replyMessage: string
}): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Response to your enquiry - Cherdung Café</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7A4E2D 0%, #B68A52 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Response to Your Enquiry</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Cherdung Café</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333;">Dear ${replyData.customerName},</p>
          
          <p style="color: #555;">Thank you for your patience. We have reviewed your enquiry regarding <strong>${replyData.enquirySubject}</strong> and have a response for you.</p>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <h3 style="color: #7A4E2D; margin-top: 0; border-bottom: 2px solid #B68A52; padding-bottom: 10px;">Our Response</h3>
            <div style="padding: 16px 0;">
              <p style="color: #333; white-space: pre-wrap; margin: 0;">${replyData.replyMessage}</p>
            </div>
          </div>
          
          <div style="background: #fff8e1; padding: 16px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Reference:</strong> ${replyData.enquirySubject}
            </p>
          </div>
          
          <h3 style="color: #7A4E2D;">Need further assistance?</h3>
          <ul style="color: #555; padding-left: 20px;">
            <li>Reply directly to this email for any follow-up questions</li>
            <li>Call us at +1 (555) 123-4567 for immediate assistance</li>
            <li>Visit our café for in-person consultation</li>
          </ul>
          
          <div style="margin-top: 24px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
               style="background: #7A4E2D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Visit Our Website
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Cherdung Café. All rights reserved.</p>
          <p>This message was sent in response to your enquiry. Feel free to reply!</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: replyData.customerEmail,
    subject: `Re: ${replyData.enquirySubject} - Response from Cherdung Café`,
    html
  })
}