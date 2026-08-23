import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    })
    return NextResponse.json(menuItems)
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, image, price, category, isPopular, isAvailable, sortOrder } = body

    if (!title?.trim() || !price?.trim()) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 })
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        image: image || null,
        price: price.trim(),
        category: category?.trim() || null,
        isPopular: Boolean(isPopular),
        isAvailable: isAvailable !== false,
        sortOrder: Number.isInteger(sortOrder) ? sortOrder : 0,
      },
    })

    return NextResponse.json(menuItem, { status: 201 })
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
  }
}
