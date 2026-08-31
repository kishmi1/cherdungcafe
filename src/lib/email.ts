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

export async function sendOrderConfirmationEmail(orderData: {
  orderId: number
  customerName: string
  customerEmail: string
  items: Array<{
    title: string
    quantity: number
    price: string
  }>
  totalAmount: number
  orderType: string
  status: string
}): Promise<boolean> {
  const trackOrderUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order?orderId=${orderData.orderId}`
  
  const itemsHtml = orderData.items.map(item => `
    <tr style="border-bottom: 1px solid #e0e0e0;">
      <td style="padding: 12px 8px; color: #333;">${item.title}</td>
      <td style="padding: 12px 8px; color: #333; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 8px; color: #333; text-align: right;">Rs. ${item.price}</td>
    </tr>
  `).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Cherdung Café</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7A4E2D 0%, #B68A52 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Cherdung Café</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333;">Dear ${orderData.customerName},</p>
          
          <p style="color: #555;">Your order has been received successfully. Thank you for choosing Cherdung Café!</p>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <h3 style="color: #7A4E2D; margin-top: 0; border-bottom: 2px solid #B68A52; padding-bottom: 10px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555; width: 40%;">Order ID:</td>
                <td style="padding: 10px 8px; color: #333; font-weight: bold;">ORD-${orderData.orderId}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">Status:</td>
                <td style="padding: 10px 8px; color: #333;">${orderData.status}</td>
              </tr>
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">Order Type:</td>
                <td style="padding: 10px 8px; color: #333;">${orderData.orderType}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <h3 style="color: #7A4E2D; margin-top: 0; border-bottom: 2px solid #B68A52; padding-bottom: 10px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 12px 8px; text-align: left; color: #555;">Item</th>
                  <th style="padding: 12px 8px; text-align: center; color: #555;">Qty</th>
                  <th style="padding: 12px 8px; text-align: right; color: #555;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div style="margin-top: 16px; text-align: right; padding-top: 16px; border-top: 2px solid #B68A52;">
              <span style="font-size: 18px; font-weight: bold; color: #7A4E2D;">Total: Rs. ${orderData.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div style="margin-top: 24px; text-align: center;">
            <a href="${trackOrderUrl}" 
               style="background: #7A4E2D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Track Your Order
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
    to: orderData.customerEmail,
    subject: `Order Confirmation - ORD-${orderData.orderId}`,
    html
  })
}

export async function sendOrderStatusUpdateEmail(orderData: {
  orderId: number
  customerName: string
  customerEmail: string
  newStatus: string
}): Promise<boolean> {
  const trackOrderUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track-order?orderId=${orderData.orderId}`
  
  const statusMessages: Record<string, string> = {
    PENDING: 'Your order has been received and is pending confirmation.',
    CONFIRMED: 'Your order has been confirmed and is being prepared.',
    PREPARING: 'Your order is now being prepared by our team.',
    READY: 'Your order is ready for pickup!',
    COMPLETED: 'Your order has been completed. Thank you for your order!',
    CANCELLED: 'Your order has been cancelled. Please contact us if you have any questions.'
  }

  const statusMessage = statusMessages[orderData.newStatus] || 'Your order status has been updated.'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Status Update - Cherdung Café</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7A4E2D 0%, #B68A52 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Status Update</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Cherdung Café</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333;">Dear ${orderData.customerName},</p>
          
          <p style="color: #555;">${statusMessage}</p>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <h3 style="color: #7A4E2D; margin-top: 0; border-bottom: 2px solid #B68A52; padding-bottom: 10px;">Order Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555; width: 40%;">Order ID:</td>
                <td style="padding: 10px 8px; color: #333; font-weight: bold;">ORD-${orderData.orderId}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">New Status:</td>
                <td style="padding: 10px 8px; color: #333; font-weight: bold; color: #7A4E2D;">${orderData.newStatus}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 24px; text-align: center;">
            <a href="${trackOrderUrl}" 
               style="background: #7A4E2D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Track Your Order
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
    to: orderData.customerEmail,
    subject: `Order Status Update - ORD-${orderData.orderId} - ${orderData.newStatus}`,
    html
  })
}

export async function sendReservationConfirmationToCafe(reservation: {
  id: number
  name: string
  email: string
  phone: string
  numberOfGuests: number
  reservationDate: Date
  reservationTime: string
  specialRequest: string | null
}): Promise<boolean> {
  const formattedDate = new Date(reservation.reservationDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Table Reservation - Cherdung Café</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7A4E2D 0%, #B68A52 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Table Reservation</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #7A4E2D; margin-top: 0;">Reservation Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 8px; font-weight: bold; color: #555; width: 30%;">Reservation ID:</td>
              <td style="padding: 12px 8px; color: #333; font-weight: bold;">RES-${reservation.id}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 12px 8px; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 12px 8px; color: #333;">${reservation.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 12px 8px; color: #333;">${reservation.email}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 12px 8px; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 12px 8px; color: #333;">${reservation.phone}</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; font-weight: bold; color: #555;">Number of Guests:</td>
              <td style="padding: 12px 8px; color: #333;">${reservation.numberOfGuests}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 12px 8px; font-weight: bold; color: #555;">Date:</td>
              <td style="padding: 12px 8px; color: #333;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; font-weight: bold; color: #555;">Time:</td>
              <td style="padding: 12px 8px; color: #333;">${reservation.reservationTime}</td>
            </tr>
          </table>
          
          ${reservation.specialRequest ? `
          <h3 style="color: #7A4E2D; margin-top: 24px;">Special Request:</h3>
          <div style="background: white; padding: 16px; border-left: 4px solid #B68A52; margin: 12px 0; border-radius: 4px;">
            <p style="margin: 0; color: #333; white-space: pre-wrap;">${reservation.specialRequest}</p>
          </div>
          ` : ''}
          
          <div style="margin-top: 24px; padding: 16px; background: #fff8e1; border-radius: 4px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Action Required:</strong> Please review this reservation and confirm or decline it within 24 hours.
            </p>
          </div>
          
          <div style="margin-top: 24px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/reservations" 
               style="background: #7A4E2D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Manage in Admin Panel
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This is an automated notification from Cherdung Café reservation system.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: CAFE_EMAIL,
    subject: `New Table Reservation - ${reservation.name} - ${formattedDate}`,
    html
  })
}

export async function sendReservationConfirmationToCustomer(reservation: {
  id: number
  name: string
  email: string
  numberOfGuests: number
  reservationDate: Date
  reservationTime: string
  specialRequest: string | null
}): Promise<boolean> {
  const formattedDate = new Date(reservation.reservationDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reservation Confirmed - Cherdung Café</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7A4E2D 0%, #B68A52 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Reservation Received!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Cherdung Café</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333;">Dear ${reservation.name},</p>
          
          <p style="color: #555;">Thank you for choosing Cherdung Café! We have received your table reservation request and will confirm it shortly.</p>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <h3 style="color: #7A4E2D; margin-top: 0; border-bottom: 2px solid #B68A52; padding-bottom: 10px;">Reservation Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555; width: 40%;">Reservation ID:</td>
                <td style="padding: 10px 8px; color: #333; font-weight: bold;">RES-${reservation.id}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">Number of Guests:</td>
                <td style="padding: 10px 8px; color: #333;">${reservation.numberOfGuests}</td>
              </tr>
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">Date:</td>
                <td style="padding: 10px 8px; color: #333;">${formattedDate}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">Time:</td>
                <td style="padding: 10px 8px; color: #333;">${reservation.reservationTime}</td>
              </tr>
              ${reservation.specialRequest ? `
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">Special Request:</td>
                <td style="padding: 10px 8px; color: #333;">${reservation.specialRequest}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <h3 style="color: #7A4E2D;">What happens next?</h3>
          <ul style="color: #555; padding-left: 20px;">
            <li>Our team will review your reservation request</li>
            <li>You'll receive a confirmation email once approved</li>
            <li>For urgent changes, please call us at +1 (555) 123-4567</li>
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
    to: reservation.email,
    subject: `Reservation Received - RES-${reservation.id}`,
    html
  })
}

export async function sendReservationStatusUpdateEmail(reservation: {
  id: number
  name: string
  email: string
  numberOfGuests: number
  reservationDate: Date
  reservationTime: string
  status: string
}): Promise<boolean> {
  const formattedDate = new Date(reservation.reservationDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const statusMessages: Record<string, string> = {
    PENDING: 'Your reservation is pending confirmation.',
    CONFIRMED: 'Your reservation has been confirmed! We look forward to seeing you.',
    CANCELLED: 'Your reservation has been cancelled.',
    COMPLETED: 'Thank you for dining with us! Your reservation is marked as completed.'
  }

  const statusMessage = statusMessages[reservation.status] || 'Your reservation status has been updated.'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reservation Status Update - Cherdung Café</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7A4E2D 0%, #B68A52 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Reservation Status Update</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Cherdung Café</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333;">Dear ${reservation.name},</p>
          
          <p style="color: #555;">${statusMessage}</p>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <h3 style="color: #7A4E2D; margin-top: 0; border-bottom: 2px solid #B68A52; padding-bottom: 10px;">Reservation Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555; width: 40%;">Reservation ID:</td>
                <td style="padding: 10px 8px; color: #333; font-weight: bold;">RES-${reservation.id}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">Status:</td>
                <td style="padding: 10px 8px; color: #333; font-weight: bold; color: #7A4E2D;">${reservation.status}</td>
              </tr>
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">Date:</td>
                <td style="padding: 10px 8px; color: #333;">${formattedDate}</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">Time:</td>
                <td style="padding: 10px 8px; color: #333;">${reservation.reservationTime}</td>
              </tr>
              <tr>
                <td style="padding: 10px 8px; font-weight: bold; color: #555;">Guests:</td>
                <td style="padding: 10px 8px; color: #333;">${reservation.numberOfGuests}</td>
              </tr>
            </table>
          </div>
          
          ${reservation.status === 'CONFIRMED' ? `
          <div style="margin-top: 24px; padding: 16px; background: #d4edda; border-radius: 4px; border-left: 4px solid #28a745;">
            <p style="margin: 0; color: #155724; font-size: 14px;">
              <strong>Confirmed!</strong> Please arrive 10 minutes before your reservation time. If you need to cancel or modify, please call us at +1 (555) 123-4567.
            </p>
          </div>
          ` : ''}
          
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
    to: reservation.email,
    subject: `Reservation Status Update - RES-${reservation.id} - ${reservation.status}`,
    html
  })
}