import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireStaffSession } from '@/lib/auth'
import { sendReplyToCustomer } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check staff session
    const authResult = requireStaffSession(request)
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const { message } = await request.json()
    const { id } = await params
    const enquiryId = parseInt(id)

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get the enquiry details
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: enquiryId },
      include: {
        replies: true
      }
    })

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      )
    }

    // Create reply
    const reply = await prisma.enquiryReply.create({
      data: {
        enquiryId,
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
      console.error('Failed to send reply email:', error)
    })

    // Update enquiry status to IN_PROGRESS if it was NEW
    if (enquiry.status === 'NEW') {
      await prisma.enquiry.update({
        where: { id: enquiryId },
        data: { status: 'IN_PROGRESS' }
      })
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating reply' },
      { status: 500 }
    )
  }
}
