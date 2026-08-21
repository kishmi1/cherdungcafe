import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const count = await prisma.enquiry.count({
      where: {
        status: "NEW"
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching new enquiry count:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}