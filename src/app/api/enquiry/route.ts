import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit"
import { sendEnquiryNotificationToCafe, sendAcknowledgementToEnquirer } from "@/lib/email"
import { incrementNewEnquiryCount } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, type, subject, message, consent, website } = body

    // Honeypot spam protection - if hidden field is filled, it's a bot
    if (website && website.trim() !== "") {
      console.log("Spam detected via honeypot field")
      // Return success to fool bots, but don't actually process
      return NextResponse.json(
        { success: true, message: "Enquiry submitted successfully" },
        { status: 201 }
      )
    }

    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitResult = rateLimit(identifier, 5, 60 * 60 * 1000) // 5 requests per hour
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many enquiries. Please try again later.",
          resetTime: rateLimitResult.resetTime
        },
        { status: 429 }
      )
    }

    // Basic validation
    if (!name || !email || !type || !subject || !message || !consent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Create enquiry in database
    const enquiry = await prisma.enquiry.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        type: type.trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: "NEW"
      }
    })

    // Increment notification count for admin
    incrementNewEnquiryCount()

    // Send email notification to café staff (non-blocking)
    sendEnquiryNotificationToCafe({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone || undefined,
      type: enquiry.type,
      subject: enquiry.subject,
      message: enquiry.message
    }).catch(error => {
      console.error("Failed to send café notification:", error)
    })

    // Send auto-acknowledgement email to enquirer (non-blocking)
    sendAcknowledgementToEnquirer({
      name: enquiry.name,
      email: enquiry.email,
      type: enquiry.type,
      subject: enquiry.subject
    }).catch(error => {
      console.error("Failed to send acknowledgement email:", error)
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Enquiry submitted successfully",
        enquiryId: enquiry.id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Error creating enquiry:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}