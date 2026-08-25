import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendReplyToCustomer } from "@/lib/email"

async function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get('adminSession')
  
  if (!sessionCookie) {
    return null
  }

  let sessionData
  try {
    sessionData = JSON.parse(sessionCookie.value)
  } catch (error) {
    return null
  }

  if (!sessionData.userId || !sessionData.role) {
    return null
  }

  // Allow both ADMIN and STAFF
  if (sessionData.role !== 'ADMIN' && sessionData.role !== 'STAFF') {
    return null
  }

  return sessionData
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionData = await checkAuth(request)
    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: idParam } = await params
    const id = parseInt(idParam)
    const body = await request.json()
    const { message } = body

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Reply message is required" },
        { status: 400 }
      )
    }

    // Get the enquiry details
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        replies: true
      }
    })

    if (!enquiry) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      )
    }

    // Create the reply in database
    const reply = await prisma.enquiryReply.create({
      data: {
        enquiryId: id,
        message: message.trim()
      }
    })

    // Send email to customer (non-blocking)
    sendReplyToCustomer({
      customerName: enquiry.name,
      customerEmail: enquiry.email,
      enquirySubject: enquiry.subject,
      replyMessage: message.trim()
    }).catch(error => {
      console.error("Failed to send reply email:", error)
    })

    // Update enquiry status to IN_PROGRESS if it was NEW
    if (enquiry.status === "NEW") {
      await prisma.enquiry.update({
        where: { id },
        data: { status: "IN_PROGRESS" }
      })
    }

    return NextResponse.json({
      success: true,
      reply,
      message: "Reply sent successfully"
    })

  } catch (error) {
    console.error("Error sending reply:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}