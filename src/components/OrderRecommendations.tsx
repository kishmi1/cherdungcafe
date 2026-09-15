"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { Coffee, Plus, ShoppingCart } from "lucide-react"
import Link from "next/link"

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

type RecommendationCombo = {
  mainItem: MenuItem
  suggestedItem: MenuItem | null
  comboName: string
}

interface OrderRecommendationsProps {
  orderId?: number
  orderItems?: MenuItem[]
}

export default function OrderRecommendations({ orderId, orderItems }: OrderRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<MenuItem[]>([])
  const [additionalItems, setAdditionalItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set())
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        let response
        
        // Use cart-based API if orderItems are provided, otherwise use order-based API
        if (orderItems && orderItems.length > 0) {
          response = await fetch('/api/recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              cartItems: orderItems,
              limit: 8
            }),
          })
        } else if (orderId) {
          response = await fetch('/api/recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId }),
          })
        }
        
        if (response && response.ok) {
          const data = await response.json()
          // Handle both old combo format and new item format
          if (Array.isArray(data) && data.length > 0) {
            // Check if it's the old combo format or new item format
            if (data[0].mainItem) {
              // Old format - extract mainItems
              setRecommendations(data.map((combo: RecommendationCombo) => combo.mainItem))
            } else {
              // New format - use items directly
              setRecommendations(data)
            }
          }
        }

        // Load additional menu items for more variety
        if (orderItems && orderItems.length > 0) {
          const menuResponse = await fetch('/api/menu')
          if (menuResponse.ok) {
            const allMenuItems = await menuResponse.json()
            const orderItemIds = new Set(orderItems.map(item => item.id))
            const recItemIds = new Set(recommendations.map(item => item.id))
            
            // Get categories from order items
            const orderCategories = new Set(orderItems.map(item => item.category).filter(Boolean))
            
            const extraItems = allMenuItems
              .filter((item: MenuItem) => 
                item.isAvailable && 
                !orderItemIds.has(item.id) && 
                !recItemIds.has(item.id)
              )
              .sort((a: MenuItem, b: MenuItem) => {
                // Prioritize items in same category as order items
                const aInOrderCategory = a.category && orderCategories.has(a.category)
                const bInOrderCategory = b.category && orderCategories.has(b.category)
                
                if (aInOrderCategory && !bInOrderCategory) return -1
                if (!aInOrderCategory && bInOrderCategory) return 1
                
                // Then prioritize popular items
                if (a.isPopular && !b.isPopular) return -1
                if (!a.isPopular && b.isPopular) return 1
                
                return a.sortOrder - b.sortOrder
              })
              .slice(0, 8)
            
            setAdditionalItems(extraItems)
          }
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [orderId, orderItems])

  const handleAddToOrder = (item: MenuItem) => {
    // Add the item to cart
    addToCart(item)
    setAddedItems(prev => new Set(prev).add(item.id))
    
    // Reset the "added" state after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-[#292F33]">
          Complete Your Order
        </h2>
        <p className="mb-6 text-sm text-[#737D83]">
          Perfect combos to complete your meal.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-[#EAF0F4] rounded-lg mb-3"></div>
              <div className="h-4 bg-[#EAF0F4] rounded mb-2"></div>
              <div className="h-3 bg-[#EAF0F4] rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-[#292F33]">
        Perfect Pairs With Your Order
      </h2>
      <p className="mb-6 text-sm text-[#737D83]">
        These items complement what you just ordered.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-xl border border-[#DDE5E9] bg-[#F8FAFB] transition-all duration-300 hover:border-[#6F8494] hover:shadow-md"
          >
            <div className="relative h-32 overflow-hidden bg-[#EAF0F4]">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Coffee className="h-8 w-8 text-[#6F8494]" />
                </div>
              )}
              {item.isPopular && (
                <div className="absolute top-2 right-2 bg-[#C28A4A] text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Popular
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="mb-1 text-sm font-semibold text-[#292F33] line-clamp-1">
                {item.title}
              </h3>
              {item.category && (
                <p className="mb-2 text-xs text-[#8096A3] uppercase tracking-wide">
                  {item.category}
                </p>
              )}
              {item.description && (
                <p className="mb-3 text-xs text-[#737D83] line-clamp-2">
                  {item.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#7A4E2D]">
                  {item.price}
                </span>
                
                <button
                  onClick={() => handleAddToOrder(item)}
                  disabled={addedItems.has(item.id)}
                  className={`
                    flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300
                    ${addedItems.has(item.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-[#6F8494] text-white hover:bg-[#5C7282]'
                    }
                  `}
                >
                  {addedItems.has(item.id) ? (
                    <>
                      <ShoppingCart className="h-3 w-3" />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3" />
                      Add
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-[#E8EEF1]">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 rounded-xl border border-[#6F8494] bg-[#6F8494] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#5C7282] hover:shadow-md"
        >
          <ShoppingCart className="h-4 w-4" />
          View Cart & Checkout
        </Link>
      </div>

      {/* Additional Items Section */}
      {additionalItems.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#E8EEF1]">
          <h3 className="mb-4 text-base font-semibold text-[#292F33]">
            More From Our Menu
          </h3>
          <p className="mb-6 text-sm text-[#737D83]">
            Explore other delicious items that might interest you.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {additionalItems.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-xl border border-[#DDE5E9] bg-[#F8FAFB] transition-all duration-300 hover:border-[#6F8494] hover:shadow-md"
              >
                <div className="relative h-32 overflow-hidden bg-[#EAF0F4]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Coffee className="h-8 w-8 text-[#6F8494]" />
                    </div>
                  )}
                  {item.isPopular && (
                    <div className="absolute top-2 right-2 bg-[#C28A4A] text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Popular
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="mb-1 text-sm font-semibold text-[#292F33] line-clamp-1">
                    {item.title}
                  </h3>
                  {item.category && (
                    <p className="mb-2 text-xs text-[#8096A3] uppercase tracking-wide">
                      {item.category}
                    </p>
                  )}
                  {item.description && (
                    <p className="mb-3 text-xs text-[#737D83] line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#7A4E2D]">
                      {item.price}
                    </span>
                    
                    <button
                      onClick={() => handleAddToOrder(item)}
                      disabled={addedItems.has(item.id)}
                      className={`
                        flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300
                        ${addedItems.has(item.id)
                          ? 'bg-green-600 text-white'
                          : 'bg-[#6F8494] text-white hover:bg-[#5C7282]'
                        }
                      `}
                    >
                      {addedItems.has(item.id) ? (
                        <>
                          <ShoppingCart className="h-3 w-3" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3" />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}