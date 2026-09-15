import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

// Helper function to get recommendations based on order items (for GET endpoint)
async function getRecommendations(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          menuItem: true
        }
      }
    }
  })

  if (!order) {
    throw new Error('Order not found')
  }

  // Get IDs of items already in the order
  const orderedItemIds = order.items.map(item => item.menuItemId)
  const orderedItems = order.items.map(item => item.menuItem)

  // Get all available menu items
  const allAvailableItems = await prisma.menuItem.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: [
      { isPopular: 'desc' },
      { sortOrder: 'asc' }
    ]
  })

  // Define common food pairings/combos
  const commonPairings = [
    // Drink + Food combos
    { keywords: ['coke', 'pepsi', 'cola', 'coca-cola', 'soda', 'sprite', 'mountain dew'], pairWith: ['momo', 'chicken', 'burger', 'pizza', 'fries', 'noodles'] },
    { keywords: ['coffee', 'cappuccino', 'latte', 'espresso', 'americano'], pairWith: ['momo', 'noodles', 'thukpa', 'fries', 'chicken'] },
    { keywords: ['tea', 'masala', 'lemon', 'green'], pairWith: ['momo', 'samosa', 'snack', 'noodles', 'fries'] },
    { keywords: ['milkshake', 'shake', 'chocolate', 'strawberry', 'oreo'], pairWith: ['burger', 'fries', 'chicken', 'noodles', 'momo'] },
    // Food + Drink combos  
    { keywords: ['momo'], pairWith: ['coke', 'pepsi', 'cola', 'coca-cola', 'soda', 'tea', 'masala', 'lemon', 'coffee', 'sprite', 'mountain dew'] },
    { keywords: ['chicken'], pairWith: ['coke', 'pepsi', 'cola', 'coca-cola', 'soda', 'milkshake', 'coffee', 'sprite', 'mountain dew'] },
    { keywords: ['burger'], pairWith: ['coke', 'pepsi', 'fries', 'milkshake', 'cola', 'coca-cola'] },
    { keywords: ['pizza'], pairWith: ['coke', 'pepsi', 'cola', 'coca-cola'] },
    { keywords: ['fries'], pairWith: ['coke', 'pepsi', 'burger', 'chicken', 'cola', 'coca-cola', 'sprite', 'mountain dew'] },
    { keywords: ['noodles'], pairWith: ['coke', 'pepsi', 'chicken', 'cola', 'coca-cola', 'tea', 'coffee'] },
    { keywords: ['thukpa'], pairWith: ['coke', 'pepsi', 'tea', 'coffee', 'cola', 'coca-cola'] },
    { keywords: ['biryani', 'curry', 'thali', 'sizzler'], pairWith: ['coke', 'pepsi', 'cola', 'coca-cola', 'sprite', 'mountain dew', 'tea'] },
  ]

  // Find relevant pairings based on ordered items
  const suggestedPairings: Array<{ mainItem: any, suggestedItem: any, comboName: string }> = []

  for (const orderedItem of orderedItems) {
    const itemTitle = orderedItem.title.toLowerCase()
    
    for (const pairing of commonPairings) {
      // Check if ordered item matches keywords (it's the main item in the combo)
      const matchesKeyword = pairing.keywords.some(keyword => itemTitle.includes(keyword))
      
      if (matchesKeyword) {
        // Find items to pair with (not already ordered)
        const pairItems = allAvailableItems.filter(item => {
          const itemTitleLower = item.title.toLowerCase()
          return pairing.pairWith.some(pairKeyword => itemTitleLower.includes(pairKeyword)) &&
                 !orderedItemIds.includes(item.id)
        })

        // Create combos: suggest adding the pair item (ordered item already in cart)
        for (const pairItem of pairItems.slice(0, 2)) {
          const comboName = `${orderedItem.title} + ${pairItem.title}`
          suggestedPairings.push({
            mainItem: pairItem, // Suggest adding this
            suggestedItem: null,
            comboName
          })
        }
      }
      
      // Check if ordered item matches pairWith (it's the suggested item in the combo)
      const matchesPairWith = pairing.pairWith.some(keyword => itemTitle.includes(keyword))
      
      if (matchesPairWith) {
        // Find items that would pair with this ordered item (not already ordered)
        const keywordItems = allAvailableItems.filter(item => {
          const itemTitleLower = item.title.toLowerCase()
          return pairing.keywords.some(keyword => itemTitleLower.includes(keyword)) &&
                   !orderedItemIds.includes(item.id)
        })

        // Create combos: suggest adding the keyword item (ordered item already in cart)
        for (const keywordItem of keywordItems.slice(0, 2)) {
          const comboName = `${keywordItem.title} + ${orderedItem.title}`
          suggestedPairings.push({
            mainItem: keywordItem, // Suggest adding this
            suggestedItem: null,
            comboName
          })
        }
      }
    }
  }

  // Remove duplicates (same mainItem) and limit to 4
  const uniquePairings = suggestedPairings.filter((pairing, index, self) =>
    index === self.findIndex((p) => p.mainItem.id === pairing.mainItem.id)
  )

  // If we have enough combo suggestions, return them
  if (uniquePairings.length >= 4) {
    return uniquePairings.slice(0, 4)
  }

  // Fallback: Return popular items that aren't in the order
  const popularItems = allAvailableItems.filter(item => 
    item.isPopular && !orderedItemIds.includes(item.id)
  ).slice(0, 4)

  // Convert popular items to combo format for consistency
  return popularItems.map(item => ({
    mainItem: item,
    suggestedItem: null,
    comboName: item.title
  }))
}

// GET recommendations based on order items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const recommendations = await getRecommendations(parseInt(orderId))
    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}

// Helper function to get recommendations based on cart items
async function getRecommendationsFromCart(cartItems: any[], limit: number = 4) {
  const orderedItemIds = cartItems.map(item => item.id)
  const orderedItems = cartItems

  // Get all available menu items
  const allAvailableItems = await prisma.menuItem.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: [
      { isPopular: 'desc' },
      { sortOrder: 'asc' }
    ]
  })

  // Define common food pairings/combos
  const commonPairings = [
    // Drink + Food combos
    { keywords: ['coke', 'pepsi', 'cola', 'coca-cola', 'soda', 'sprite', 'mountain dew'], pairWith: ['momo', 'chicken', 'burger', 'pizza', 'fries', 'noodles'] },
    { keywords: ['coffee', 'cappuccino', 'latte', 'espresso', 'americano'], pairWith: ['momo', 'noodles', 'thukpa', 'fries', 'chicken'] },
    { keywords: ['tea', 'masala', 'lemon', 'green'], pairWith: ['momo', 'samosa', 'snack', 'noodles', 'fries'] },
    { keywords: ['milkshake', 'shake', 'chocolate', 'strawberry', 'oreo'], pairWith: ['burger', 'fries', 'chicken', 'noodles', 'momo'] },
    // Food + Drink combos  
    { keywords: ['momo'], pairWith: ['coke', 'pepsi', 'cola', 'coca-cola', 'soda', 'tea', 'masala', 'lemon', 'coffee', 'sprite', 'mountain dew'] },
    { keywords: ['chicken'], pairWith: ['coke', 'pepsi', 'cola', 'coca-cola', 'soda', 'milkshake', 'coffee', 'sprite', 'mountain dew'] },
    { keywords: ['burger'], pairWith: ['coke', 'pepsi', 'fries', 'milkshake', 'cola', 'coca-cola'] },
    { keywords: ['pizza'], pairWith: ['coke', 'pepsi', 'cola', 'coca-cola'] },
    { keywords: ['fries'], pairWith: ['coke', 'pepsi', 'burger', 'chicken', 'cola', 'coca-cola', 'sprite', 'mountain dew'] },
    { keywords: ['noodles'], pairWith: ['coke', 'pepsi', 'chicken', 'cola', 'coca-cola', 'tea', 'coffee'] },
    { keywords: ['thukpa'], pairWith: ['coke', 'pepsi', 'tea', 'coffee', 'cola', 'coca-cola'] },
    { keywords: ['biryani', 'curry', 'thali', 'sizzler'], pairWith: ['coke', 'pepsi', 'cola', 'coca-cola', 'sprite', 'mountain dew', 'tea'] },
  ]

  // Find relevant pairings based on ordered items
  const suggestedItems: any[] = []

  for (const orderedItem of orderedItems) {
    const itemTitle = orderedItem.title.toLowerCase()
    
    for (const pairing of commonPairings) {
      // Check if ordered item matches keywords (it's the main item in the combo)
      const matchesKeyword = pairing.keywords.some(keyword => itemTitle.includes(keyword))
      
      if (matchesKeyword) {
        // Find items to pair with (not already ordered)
        const pairItems = allAvailableItems.filter(item => {
          const itemTitleLower = item.title.toLowerCase()
          return pairing.pairWith.some(pairKeyword => itemTitleLower.includes(pairKeyword)) &&
                 !orderedItemIds.includes(item.id)
        })

        // Add suggested items
        for (const pairItem of pairItems.slice(0, 2)) {
          if (!suggestedItems.find(item => item.id === pairItem.id)) {
            suggestedItems.push(pairItem)
          }
        }
      }
      
      // Check if ordered item matches pairWith (it's the suggested item in the combo)
      const matchesPairWith = pairing.pairWith.some(keyword => itemTitle.includes(keyword))
      
      if (matchesPairWith) {
        // Find items that would pair with this ordered item (not already ordered)
        const keywordItems = allAvailableItems.filter(item => {
          const itemTitleLower = item.title.toLowerCase()
          return pairing.keywords.some(keyword => itemTitleLower.includes(keyword)) &&
                   !orderedItemIds.includes(item.id)
        })

        // Add suggested items
        for (const keywordItem of keywordItems.slice(0, 2)) {
          if (!suggestedItems.find(item => item.id === keywordItem.id)) {
            suggestedItems.push(keywordItem)
          }
        }
      }
    }
  }

  // Remove duplicates and limit to requested limit
  const uniqueItems = suggestedItems.filter((item, index, self) =>
    index === self.findIndex((i) => i.id === item.id)
  )

  // If we have enough suggestions, return them
  if (uniqueItems.length >= limit) {
    return uniqueItems.slice(0, limit)
  }

  // Fallback: Return popular items that aren't in the cart
  const popularItems = allAvailableItems.filter(item => 
    item.isPopular && 
    !orderedItemIds.includes(item.id) &&
    !uniqueItems.find(i => i.id === item.id)
  ).slice(0, limit - uniqueItems.length)

  return [...uniqueItems, ...popularItems]
}

// POST recommendations based on cart items or order ID
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cartItems = body.cartItems
    const orderId = body.orderId
    const limit = body.limit || 4

    // Support both cart items and order ID formats
    if (cartItems && Array.isArray(cartItems)) {
      const recommendations = await getRecommendationsFromCart(cartItems, limit)
      return NextResponse.json(recommendations)
    } else if (orderId) {
      const recommendations = await getRecommendations(parseInt(orderId))
      return NextResponse.json(recommendations)
    } else {
      return NextResponse.json({ error: 'Cart items or Order ID is required' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}