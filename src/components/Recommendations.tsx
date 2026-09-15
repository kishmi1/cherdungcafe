"use client"

import { useMemo, useState } from "react"
import { Coffee, Star, ShoppingCart, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"

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

type Props = {
  recommendations: MenuItem[]
  title?: string
  subtitle?: string
  showComboText?: boolean
}

export default function Recommendations({ 
  recommendations, 
  title = "You May Also Like",
  subtitle = "Complete your meal with these favorites",
  showComboText = false
}: Props) {
  const [showSuccess, setShowSuccess] = useState<{ itemId: number; message: string } | null>(null)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = (menuItem: MenuItem) => {
    const quantity = quantities[menuItem.id] || 1
    for (let i = 0; i < quantity; i++) {
      addToCart(menuItem)
    }
    setShowSuccess({ itemId: menuItem.id, message: 'Added to cart' })
    setTimeout(() => setShowSuccess(null), 2000)
  }

  const handleOrderNow = (menuItem: MenuItem) => {
    const quantity = quantities[menuItem.id] || 1
    for (let i = 0; i < quantity; i++) {
      addToCart(menuItem)
    }
    router.push('/checkout')
  }

  const handleQuantityChange = (menuItemId: number, delta: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[menuItemId] || 1
      const newQuantity = Math.max(1, currentQuantity + delta)
      return { ...prev, [menuItemId]: newQuantity }
    })
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="mt-8 sm:mt-10 md:mt-12">
      {/* ================= HEADER ================= */}
      <div className="mb-6 sm:mb-8 text-center">
        <p
          className="mb-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#8096A3] font-sans"
        >
          Recommended For You
        </p>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[0.03em] text-[#29343A] font-serif leading-tight"
        >
          {title}
        </h2>
        <p
          className="mx-auto mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-[#737D83] font-sans tracking-wide"
        >
          {subtitle}
        </p>
      </div>

      {/* ================= RECOMMENDATIONS GRID ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {recommendations.map((menuItem) => (
          <article
            key={menuItem.id}
            className="group relative overflow-hidden rounded-2xl border border-[#DDE5E9] bg-white shadow-[0_4px_18px_rgba(55,72,82,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#C4D2DA] hover:shadow-[0_15px_35px_rgba(55,72,82,0.13)]"
          >
            {/* ================= POPULAR BADGE ================= */}
            {menuItem.isPopular && (
              <div
                className="absolute left-2 sm:left-3 top-2 sm:top-3 z-10 flex items-center gap-1 sm:gap-1.5 rounded-full bg-[#C28A4A] px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-white shadow-md font-sans tracking-wide"
              >
                <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
                Popular
              </div>
            )}

            {/* ================= RECOMMENDED BADGE ================= */}
            {!menuItem.isPopular && showComboText && (
              <div
                className="absolute right-2 sm:right-3 top-2 sm:top-3 z-10 flex items-center gap-1 sm:gap-1.5 rounded-full bg-[#6F8494] px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-white shadow-md font-sans tracking-wide"
              >
                Great Match
              </div>
            )}

            {/* ================= IMAGE ================= */}
            <div className="relative h-40 sm:h-52 w-full overflow-hidden bg-[#EAF0F4]">
              {menuItem.image ? (
                <img
                  src={menuItem.image}
                  alt={menuItem.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#EAF0F4] to-[#D8E2E8]"
                >
                  <Coffee className="h-10 w-10 sm:h-14 sm:w-14 text-[#6F8494]" />
                </div>
              )}

              {/* Image Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            {/* ================= CONTENT ================= */}
            <div className="flex flex-col p-4 sm:p-5">
              {/* CATEGORY */}
              {menuItem.category && (
                <p className="mb-1.5 sm:mb-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8096A3] font-sans">
                  {menuItem.category}
                </p>
              )}

              {/* TITLE + PRICE */}
              <div className="mb-2 sm:mb-3 flex items-start justify-between gap-2 sm:gap-3">
                <h3 className="line-clamp-2 text-sm sm:text-base md:text-lg font-semibold leading-snug text-[#292F33] font-serif tracking-wide">
                  {menuItem.title}
                </h3>
                <span className="shrink-0 whitespace-nowrap rounded-full bg-[#F3E9DE] px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-bold text-[#7A4E2D] font-sans tracking-wide">
                  {menuItem.price}
                </span>
              </div>

              {/* DIVIDER */}
              <div className="mb-2 sm:mb-3 h-px bg-[#E8EEF1]" />

              {/* DESCRIPTION */}
              {menuItem.description && (
                <p className="mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm leading-5 sm:leading-6 text-[#737D83] font-sans tracking-wide">
                  {menuItem.description}
                </p>
              )}

              {/* QUANTITY CONTROLS */}
              <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2">
                <button
                  onClick={() => handleQuantityChange(menuItem.id, -1)}
                  className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-[#D7E0E5] bg-white text-[#53616A] transition-colors hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <span className="w-7 sm:w-8 text-center font-semibold text-xs sm:text-sm text-[#292F33] font-sans tracking-wide">
                  {quantities[menuItem.id] || 1}
                </span>
                <button
                  onClick={() => handleQuantityChange(menuItem.id, 1)}
                  className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-[#D7E0E5] bg-white text-[#53616A] transition-colors hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>

              {/* BUTTONS */}
              <div className="space-y-1.5 sm:space-y-2">
                {/* ADD TO CART BUTTON */}
                <button
                  onClick={() => handleAddToCart(menuItem)}
                  className="w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-[#6F8494] bg-[#6F8494] px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#5C7282] hover:shadow-md font-sans tracking-wide"
                >
                  <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Add to Cart
                </button>

                {/* ORDER NOW BUTTON */}
                <button
                  onClick={() => handleOrderNow(menuItem)}
                  className="w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-[#7A4E2D] bg-[#7A4E2D] px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#6A4225] hover:shadow-md font-sans tracking-wide"
                >
                  Order Now
                </button>

                {/* SUCCESS FEEDBACK */}
                {showSuccess?.itemId === menuItem.id && (
                  <div className="text-center text-[10px] sm:text-xs font-semibold text-[#6F8494] font-sans tracking-wide">
                    {showSuccess.message}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
