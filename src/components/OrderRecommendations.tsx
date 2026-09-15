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
  orderId: number
}

export default function OrderRecommendations({ orderId }: OrderRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationCombo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set())
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        })
        if (response.ok) {
          const data = await response.json()
          setRecommendations(data)
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [orderId])

  const handleAddToOrder = (combo: RecommendationCombo) => {
    // Add the main item (the item to be added to complete the combo)
    addToCart(combo.mainItem)
    setAddedItems(prev => new Set(prev).add(combo.mainItem.id))
    
    // Reset the "added" state after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(combo.mainItem.id)
        return newSet
      })
    }, 2000)
  }

  const getItemPrice = (price: string) => {
    return parseFloat(price.replace(/[^0-9.]/g, '')) || 0
  }

  const getComboPrice = (combo: RecommendationCombo) => {
    // Only return the price of the item to be added (mainItem)
    return getItemPrice(combo.mainItem.price)
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        Complete Your Order
      </h2>
      <p className="mb-6 text-sm text-[#737D83]">
        Perfect combos to complete your meal.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((combo, index) => (
          <div
            key={`${combo.mainItem.id}-${combo.suggestedItem?.id || index}`}
            className="group overflow-hidden rounded-xl border border-[#DDE5E9] bg-[#F8FAFB] transition-all duration-300 hover:border-[#6F8494] hover:shadow-md"
          >
            <div className="relative h-32 overflow-hidden bg-[#EAF0F4]">
              {combo.mainItem.image ? (
                <img
                  src={combo.mainItem.image}
                  alt={combo.mainItem.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Coffee className="h-8 w-8 text-[#6F8494]" />
                </div>
              )}
              {combo.suggestedItem && (
                <div className="absolute top-2 right-2 bg-[#6F8494] text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Combo
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="mb-1 text-sm font-semibold text-[#292F33] line-clamp-1">
                {combo.mainItem.title}
              </h3>
              <p className="mb-3 text-xs text-[#737D83] line-clamp-2">
                {combo.comboName !== combo.mainItem.title ? combo.comboName : combo.mainItem.description || 'Delicious item'}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#7A4E2D]">
                  {combo.mainItem.price}
                </span>
                
                <button
                  onClick={() => handleAddToOrder(combo)}
                  disabled={addedItems.has(combo.mainItem.id)}
                  className={`
                    flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300
                    ${addedItems.has(combo.mainItem.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-[#6F8494] text-white hover:bg-[#5C7282]'
                    }
                  `}
                >
                  {addedItems.has(combo.mainItem.id) ? (
                    <>
                      <ShoppingCart className="h-3 w-3" />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3" />
                      Add to Order
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
    </div>
  )
}