import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireStaffSession } from '@/lib/auth'

export async function PATCH(
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

    const { status } = await request.json()
    const { id } = await params
    const enquiryId = parseInt(id)

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Update enquiry status
    const updatedEnquiry = await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { status }
    })

    return NextResponse.json(updatedEnquiry)
  } catch (error) {
    console.error('Error updating enquiry:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating enquiry' },
      { status: 500 }
    )
  }
}
