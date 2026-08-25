import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { decrementNewEnquiryCount } from "@/lib/notifications"

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

export async function GET(
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

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        replies: {
          orderBy: {
            sentAt: 'asc'
          }
        }
      }
    })

    if (!enquiry) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(enquiry)
  } catch (error) {
    console.error("Error fetching enquiry:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    const { status } = body

    if (!status || !["NEW", "IN_PROGRESS", "RESOLVED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    // Get the current enquiry to check if we're moving from NEW
    const currentEnquiry = await prisma.enquiry.findUnique({
      where: { id }
    })

    if (!currentEnquiry) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      )
    }

    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: { status },
      include: {
        replies: {
          orderBy: {
            sentAt: 'asc'
          }
        }
      }
    })

    // If we're changing from NEW to something else, decrement notification count
    if (currentEnquiry.status === "NEW" && status !== "NEW") {
      decrementNewEnquiryCount()
    }

    return NextResponse.json(enquiry)
  } catch (error) {
    console.error("Error updating enquiry:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}