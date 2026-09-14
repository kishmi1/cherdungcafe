import { NextResponse } from "next/server"
import { getRecommendationsForItem, getRecommendationsForCart, getAllAvailableMenuItems } from "@/lib/recommendations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, currentItem, cartItems, limit = 4 } = body

    const allMenuItems = await getAllAvailableMenuItems()

    let recommendations

    if (type === 'item' && currentItem) {
      recommendations = await getRecommendationsForItem(currentItem, allMenuItems, limit)
    } else if (type === 'cart' && cartItems && Array.isArray(cartItems)) {
      recommendations = await getRecommendationsForCart(cartItems, allMenuItems, limit)
    } else {
      return NextResponse.json({ error: "Invalid request type or missing data" }, { status: 400 })
    }

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
