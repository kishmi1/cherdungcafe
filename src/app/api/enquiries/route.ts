import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

export async function GET(request: NextRequest) {
  try {
    const sessionData = await checkAuth(request)
    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const enquiries = await prisma.enquiry.findMany({
      include: {
        replies: {
          orderBy: {
            sentAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(enquiries)
  } catch (error) {
    console.error("Error fetching enquiries:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}