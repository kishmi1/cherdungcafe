import { prisma } from "./prisma"

type MenuItem = {
  id: number
  title: string
  description: string | null
  image: string | null
  price: string
  category: string | null
  isPopular: boolean
  isAvailable: boolean
  sortOrder: number
}

// Rule-based recommendation mappings
// These can be extended later with ML-based recommendations
const RECOMMENDATION_RULES: Record<string, string[]> = {
  // Main courses
  "Pizza": ["Coke", "French Fries", "Garlic Bread", "Coffee"],
  "Burger": ["French Fries", "Coke", "Coffee", "Onion Rings"],
  "Momo": ["Coke", "Chowmein", "French Fries", "Spring Roll"],
  "Biryani": ["Coke", "Curry", "Momo", "Raita"],
  "Chowmein": ["Momo", "Coke", "Spring Roll", "Manchurian"],
  
  // Beverages
  "Coffee": ["Cake", "Brownie", "Sandwich", "Cookie"],
  "Tea": ["Sandwich", "Cookie", "Cake", "Biscuit"],
  "Coke": ["Pizza", "Burger", "French Fries", "Momo"],
  "Juice": ["Sandwich", "Cake", "Cookie", "Salad"],
  
  // Snacks
  "French Fries": ["Burger", "Pizza", "Coke", "Coffee"],
  "Garlic Bread": ["Pizza", "Pasta", "Soup", "Salad"],
  "Sandwich": ["Coffee", "Tea", "Juice", "Soup"],
  "Cake": ["Coffee", "Tea", "Ice Cream", "Coke"],
  "Brownie": ["Coffee", "Ice Cream", "Coke", "Milkshake"],
  "Cookie": ["Coffee", "Tea", "Milkshake", "Ice Cream"],
  
  // Categories (fallback if exact item name not found)
  "Main Course": ["Coke", "Coffee", "French Fries", "Garlic Bread"],
  "Beverages": ["Sandwich", "Cake", "Cookie", "French Fries"],
  "Soft Drinks": ["Pizza", "Burger", "French Fries", "Momo"],
  "Snacks": ["Coffee", "Tea", "Coke", "Juice"],
  "Desserts": ["Coffee", "Tea", "Ice Cream", "Milkshake"],
}

/**
 * Get recommendations for a specific menu item
 * @param currentItem - The item the customer is viewing/ordered
 * @param allMenuItems - All available menu items to filter from
 * @param limit - Maximum number of recommendations to return (default: 4)
 * @returns Array of recommended menu items
 */
export async function getRecommendationsForItem(
  currentItem: MenuItem,
  allMenuItems: MenuItem[],
  limit: number = 4
): Promise<MenuItem[]> {
  // Filter out unavailable items and the current item
  const availableItems = allMenuItems.filter(
    item => item.isAvailable && item.id !== currentItem.id
  )

  // Try to find recommendations by exact item title
  const recommendationsByTitle = RECOMMENDATION_RULES[currentItem.title]
  
  if (recommendationsByTitle && recommendationsByTitle.length > 0) {
    const matchedItems = availableItems.filter(item =>
      recommendationsByTitle.some(rec => 
        item.title.toLowerCase().includes(rec.toLowerCase()) ||
        rec.toLowerCase().includes(item.title.toLowerCase())
      )
    )
    
    if (matchedItems.length >= limit) {
      return matchedItems.slice(0, limit)
    }
    
    // If we have some matches but not enough, fall back to category
    if (matchedItems.length > 0) {
      const remaining = limit - matchedItems.length
      const categoryRecs = getRecommendationsByCategory(
        currentItem.category,
        availableItems,
        remaining,
        matchedItems.map(i => i.id)
      )
      return [...matchedItems, ...categoryRecs]
    }
  }

  // Fall back to category-based recommendations
  return getRecommendationsByCategory(
    currentItem.category,
    availableItems,
    limit
  )
}

/**
 * Get recommendations based on cart contents
 * @param cartItems - Items currently in the cart
 * @param allMenuItems - All available menu items
 * @param limit - Maximum number of recommendations (default: 4)
 * @returns Array of recommended menu items
 */
export async function getRecommendationsForCart(
  cartItems: MenuItem[],
  allMenuItems: MenuItem[],
  limit: number = 4
): Promise<MenuItem[]> {
  if (cartItems.length === 0) {
    return getPopularItems(allMenuItems, limit)
  }

  // Get recommendations for each cart item
  const allRecommendations = new Set<number>()
  
  for (const item of cartItems) {
    const recs = await getRecommendationsForItem(item, allMenuItems, limit * 2)
    recs.forEach(rec => allRecommendations.add(rec.id))
  }

  // Filter out items already in cart
  const cartItemIds = new Set(cartItems.map(item => item.id))
  const recommendedItems = allMenuItems.filter(item =>
    allRecommendations.has(item.id) && !cartItemIds.has(item.id)
  )

  // Sort by popularity and return limited results
  return recommendedItems
    .sort((a, b) => {
      // Prioritize popular items
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      return 0
    })
    .slice(0, limit)
}

/**
 * Get category-based recommendations
 */
function getRecommendationsByCategory(
  category: string | null,
  availableItems: MenuItem[],
  limit: number,
  excludeIds: number[] = []
): MenuItem[] {
  if (!category) {
    return getPopularItems(availableItems, limit, excludeIds)
  }

  const categoryRules = RECOMMENDATION_RULES[category]
  
  if (categoryRules) {
    const matchedItems = availableItems.filter(item =>
      !excludeIds.includes(item.id) &&
      categoryRules.some(rec => 
        item.title.toLowerCase().includes(rec.toLowerCase()) ||
        item.category?.toLowerCase().includes(rec.toLowerCase())
      )
    )
    
    if (matchedItems.length >= limit) {
      return matchedItems.slice(0, limit)
    }
    
    if (matchedItems.length > 0) {
      const remaining = limit - matchedItems.length
      const popularRecs = getPopularItems(
        availableItems,
        remaining,
        [...excludeIds, ...matchedItems.map(i => i.id)]
      )
      return [...matchedItems, ...popularRecs]
    }
  }

  // Fall back to popular items from different categories
  return getPopularItems(availableItems, limit, excludeIds)
}

/**
 * Get popular items as fallback recommendations
 */
function getPopularItems(
  availableItems: MenuItem[],
  limit: number,
  excludeIds: number[] = []
): MenuItem[] {
  return availableItems
    .filter(item => !excludeIds.includes(item.id))
    .sort((a, b) => {
      // Prioritize popular items
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      // Then by sort order
      return a.sortOrder - b.sortOrder
    })
    .slice(0, limit)
}

/**
 * Fetch all available menu items from database
 */
export async function getAllAvailableMenuItems(): Promise<MenuItem[]> {
  return await prisma.menuItem.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        title: "asc",
      },
    ],
  })
}
