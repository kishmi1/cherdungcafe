"use client"

import { useCart } from "@/lib/cart-context"
import { Coffee, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Star, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Recommendations from "@/components/Recommendations"

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

function EmptyCartPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState<{ itemId: number; message: string } | null>(null)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const { addToCart } = useCart()

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const response = await fetch('/api/menu')
        if (response.ok) {
          const allMenuItems = await response.json()
          const availableItems = allMenuItems
            .filter((item: MenuItem) => item.isAvailable)
            .sort((a: MenuItem, b: MenuItem) => {
              // Prioritize popular items
              if (a.isPopular && !b.isPopular) return -1
              if (!a.isPopular && b.isPopular) return 1
              return a.sortOrder - b.sortOrder
            })
            .slice(0, 8) // Show 8 items in empty cart
          setMenuItems(availableItems)
        }
      } catch (error) {
        console.error('Failed to load menu items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMenuItems()
  }, [])

  const handleAddToCart = (menuItem: MenuItem) => {
    const quantity = quantities[menuItem.id] || 1
    for (let i = 0; i < quantity; i++) {
      addToCart(menuItem)
    }
    setShowSuccess({ itemId: menuItem.id, message: 'Added to cart' })
    setTimeout(() => setShowSuccess(null), 2000)
  }

  const handleMenuQuantityChange = (menuItemId: number, delta: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[menuItemId] || 1
      const newQuantity = Math.max(1, currentQuantity + delta)
      return { ...prev, [menuItemId]: newQuantity }
    })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#EAF0F4] py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-2 sm:mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-[#29343A]">
            Your Cart
          </h1>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-[#68767D]">
            Review your items before checkout
          </p>
        </div>
      </section>

      {/* ================= EMPTY STATE WITH MENU ITEMS ================= */}
      <section className="bg-[#F8FAFB] py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* EMPTY CART MESSAGE */}
          <div className="mb-6 sm:mb-8 md:mb-10 text-center">
            <div className="mx-auto mb-3 sm:mb-4 md:mb-5 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#EAF0F4]">
              <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#6F8494]" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#292F33]">
              Your cart is empty
            </h3>
            <p className="mt-2 text-[10px] sm:text-xs md:text-sm text-[#737D83]">
              Start by adding some delicious items from our menu
            </p>
          </div>

          {/* MENU ITEMS */}
          {!isLoading && menuItems.length > 0 && (
            <>
              <div className="mb-4 sm:mb-6 md:mb-8 text-center">
                <p
                  className="mb-2 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[#8096A3] font-sans"
                >
                  Popular Items
                </p>
                <h2
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-[0.03em] text-[#29343A] font-serif leading-tight"
                >
                  Start Your Order
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {menuItems.map((menuItem) => (
                  <article
                    key={menuItem.id}
                    className="group relative overflow-hidden rounded-2xl border border-[#DDE5E9] bg-white shadow-[0_4px_18px_rgba(55,72,82,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#C4D2DA] hover:shadow-[0_15px_35px_rgba(55,72,82,0.13)]"
                  >
                    {/* POPULAR BADGE */}
                    {menuItem.isPopular && (
                      <div
                        className="absolute left-2 sm:left-3 top-2 sm:top-3 z-10 flex items-center gap-1 sm:gap-1.5 rounded-full bg-[#C28A4A] px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-white shadow-md font-sans tracking-wide"
                      >
                        <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
                        Popular
                      </div>
                    )}

                    {/* IMAGE */}
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

                    {/* CONTENT */}
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
                          onClick={() => handleMenuQuantityChange(menuItem.id, -1)}
                          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-[#D7E0E5] bg-white text-[#53616A] transition-colors hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <span className="w-7 sm:w-8 text-center font-semibold text-xs sm:text-sm text-[#292F33] font-sans tracking-wide">
                          {quantities[menuItem.id] || 1}
                        </span>
                        <button
                          onClick={() => handleMenuQuantityChange(menuItem.id, 1)}
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

              {/* BROWSE FULL MENU BUTTON */}
              <div className="mt-6 sm:mt-8 md:mt-10 text-center">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#6F8494] bg-[#6F8494] px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 text-[10px] sm:text-xs md:text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#5C7282] hover:shadow-md"
                >
                  Browse Full Menu
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </div>
            </>
          )}

          {isLoading && (
            <div className="rounded-3xl border border-[#DDE5E9] bg-white px-4 sm:px-6 py-16 sm:py-20 text-center shadow-sm">
              <div
                className="mx-auto mb-4 sm:mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EAF0F4]"
              >
                <div
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-[#718794] border-t-transparent opacity-70 animate-spin"
                />
              </div>
              <p className="text-xs sm:text-sm md:text-base leading-6 text-[#737D83] font-sans tracking-wide">
                Loading menu items...
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemCount, addToCart } = useCart()
  const [recommendations, setRecommendations] = useState<MenuItem[]>([])
  const [additionalItems, setAdditionalItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState<{ itemId: number; message: string } | null>(null)
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  // Load recommendations and additional items when cart changes
  useEffect(() => {
    const loadRecommendations = async () => {
      if (cart.length === 0) {
        setRecommendations([])
        setAdditionalItems([])
        return
      }

      setIsLoading(true)
      try {
        // Load recommendations
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'cart',
            cartItems: cart.map(item => item.menuItem),
            limit: 4
          })
        })

        let recs: MenuItem[] = []
        if (response.ok) {
          recs = await response.json()
          setRecommendations(recs)
        }

        // Load additional menu items (excluding cart items and recommendations)
        const menuResponse = await fetch('/api/menu')
        if (menuResponse.ok) {
          const allMenuItems = await menuResponse.json()
          const cartItemIds = new Set(cart.map(item => item.menuItem.id))
          const recItemIds = new Set(recs ? recs.map((item: MenuItem) => item.id) : [])
          
          const additional = allMenuItems
            .filter((item: MenuItem) => 
              item.isAvailable && 
              !cartItemIds.has(item.id) && 
              !recItemIds.has(item.id)
            )
            .sort((a: MenuItem, b: MenuItem) => {
              // Prioritize popular items
              if (a.isPopular && !b.isPopular) return -1
              if (!a.isPopular && b.isPopular) return 1
              return a.sortOrder - b.sortOrder
            })
            .slice(0, 4)
          
          setAdditionalItems(additional)
        }
      } catch (error) {
        console.error('Failed to load recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendations()
  }, [cart])

  const handleCartQuantityChange = (menuItemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(menuItemId)
    } else {
      updateQuantity(menuItemId, newQuantity)
    }
  }

  const getItemPrice = (price: string) => {
    return parseFloat(price.replace(/[^0-9.]/g, '')) || 0
  }

  const getItemSubtotal = (price: string, quantity: number) => {
    return getItemPrice(price) * quantity
  }

  const handleAddToCart = (menuItem: MenuItem) => {
    const quantity = quantities[menuItem.id] || 1
    for (let i = 0; i < quantity; i++) {
      addToCart(menuItem)
    }
    setShowSuccess({ itemId: menuItem.id, message: 'Added to cart' })
    setTimeout(() => setShowSuccess(null), 2000)
  }

  const handleRecommendationQuantityChange = (menuItemId: number, delta: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[menuItemId] || 1
      const newQuantity = Math.max(1, currentQuantity + delta)
      return { ...prev, [menuItemId]: newQuantity }
    })
  }

  if (cart.length === 0) {
    return <EmptyCartPage />
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#EAF0F4] py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-2 sm:mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-[#29343A]">
            Your Cart
          </h1>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-[#68767D]">
            Review your items before checkout
          </p>
        </div>
      </section>

      {/* ================= CART CONTENT ================= */}
      <section className="bg-[#F8FAFB] py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3">
            {/* ================= CART ITEMS ================= */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cart.map((cartItem) => (
                <div
                  key={cartItem.menuItem.id}
                  className="rounded-2xl border border-[#DDE5E9] bg-white p-3 sm:p-4 md:p-5 shadow-sm"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* IMAGE */}
                    <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#EAF0F4]">
                      {cartItem.menuItem.image ? (
                        <img
                          src={cartItem.menuItem.image}
                          alt={cartItem.menuItem.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-[#6F8494]" />
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-1 flex-col">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          {cartItem.menuItem.category && (
                            <p className="mb-1 text-[9px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8096A3]">
                              {cartItem.menuItem.category}
                            </p>
                          )}
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-[#292F33]">
                            {cartItem.menuItem.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(cartItem.menuItem.id)}
                          className="text-[#737D83] transition-colors hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        {/* QUANTITY CONTROLS */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <button
                            onClick={() => handleCartQuantityChange(cartItem.menuItem.id, cartItem.quantity - 1)}
                            className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-lg border border-[#D7E0E5] bg-white text-[#53616A] transition-colors hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                          </button>
                          <span className="w-6 sm:w-7 md:w-8 text-center font-semibold text-[10px] sm:text-xs md:text-sm text-[#292F33]">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => handleCartQuantityChange(cartItem.menuItem.id, cartItem.quantity + 1)}
                            className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-lg border border-[#D7E0E5] bg-white text-[#53616A] transition-colors hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                          </button>
                        </div>

                        {/* PRICE */}
                        <div className="text-right">
                          <p className="text-xs sm:text-sm text-[#737D83]">
                            {cartItem.menuItem.price} × {cartItem.quantity}
                          </p>
                          <p className="text-sm sm:text-base md:text-lg font-bold text-[#7A4E2D]">
                            Rs. {getItemSubtotal(cartItem.menuItem.price, cartItem.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div className="lg:col-span-1">
              <div className="sticky top-16 sm:top-20 md:top-24 rounded-2xl border border-[#DDE5E9] bg-white p-3 sm:p-4 md:p-6 shadow-sm">
                <h2 className="mb-2 sm:mb-3 md:mb-4 text-base sm:text-lg md:text-xl font-semibold text-[#292F33]">
                  Order Summary
                </h2>

                <div className="space-y-1.5 sm:space-y-2 md:space-y-3 border-b border-[#E8EEF1] pb-2 sm:pb-3 md:pb-4">
                  <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                    <span className="text-[#737D83]">Subtotal ({getCartItemCount()} items)</span>
                    <span className="font-semibold text-[#292F33]">
                      Rs. {getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                    <span className="text-[#737D83]">Delivery Fee</span>
                    <span className="font-semibold text-[#292F33]">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="mb-3 sm:mb-4 md:mb-6 flex justify-between pt-2 sm:pt-3 md:pt-4">
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-[#292F33]">Total</span>
                  <span className="text-sm sm:text-base md:text-lg font-bold text-[#7A4E2D]">
                    Rs. {getCartTotal().toFixed(2)}
                  </span>
                </div>

                <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                  <Link
                    href="/menu"
                    className="block w-full rounded-xl border border-[#D7E0E5] bg-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 text-center text-[10px] sm:text-xs md:text-sm font-semibold text-[#53616A] transition-all duration-300 hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/checkout"
                    className="block w-full rounded-xl border border-[#6F8494] bg-[#6F8494] px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 text-center text-[10px] sm:text-xs md:text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#5C7282] hover:shadow-md"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RECOMMENDATIONS ================= */}
      {cart.length > 0 && !isLoading && recommendations.length > 0 && (
        <section className="bg-[#F8FAFB] py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Recommendations 
              recommendations={recommendations}
              title="Perfect With Your Order"
              subtitle="Complete your meal with these popular items"
            />
          </div>
        </section>
      )}

      {/* ================= ADDITIONAL MENU ITEMS ================= */}
      {cart.length > 0 && !isLoading && additionalItems.length > 0 && (
        <section className="bg-[#F8FAFB] py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* HEADER */}
            <div className="mb-4 sm:mb-6 md:mb-8 text-center">
              <p
                className="mb-2 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[#8096A3] font-sans"
              >
                More From Our Menu
              </p>
              <h2
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-[0.03em] text-[#29343A] font-serif leading-tight"
              >
                Explore More Favorites
              </h2>
              <p
                className="mx-auto mt-2 sm:mt-3 max-w-2xl text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed text-[#737D83] font-sans tracking-wide"
              >
                Discover other delicious items from our menu
              </p>
            </div>

            {/* MENU GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {additionalItems.map((menuItem) => (
                <article
                  key={menuItem.id}
                  className="group relative overflow-hidden rounded-2xl border border-[#DDE5E9] bg-white shadow-[0_4px_18px_rgba(55,72,82,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#C4D2DA] hover:shadow-[0_15px_35px_rgba(55,72,82,0.13)]"
                >
                  {/* POPULAR BADGE */}
                  {menuItem.isPopular && (
                    <div
                      className="absolute left-2 sm:left-3 top-2 sm:top-3 z-10 flex items-center gap-1 sm:gap-1.5 rounded-full bg-[#C28A4A] px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-white shadow-md font-sans tracking-wide"
                    >
                      <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
                      Popular
                    </div>
                  )}

                  {/* IMAGE */}
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

                  {/* CONTENT */}
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
                        onClick={() => handleRecommendationQuantityChange(menuItem.id, -1)}
                        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-[#D7E0E5] bg-white text-[#53616A] transition-colors hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <span className="w-7 sm:w-8 text-center font-semibold text-xs sm:text-sm text-[#292F33] font-sans tracking-wide">
                        {quantities[menuItem.id] || 1}
                      </span>
                      <button
                        onClick={() => handleRecommendationQuantityChange(menuItem.id, 1)}
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

            {/* BROWSE MENU BUTTON */}
            <div className="mt-6 sm:mt-8 md:mt-10 text-center">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-xl border border-[#6F8494] bg-[#6F8494] px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 text-[10px] sm:text-xs md:text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#5C7282] hover:shadow-md"
              >
                Browse Full Menu
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
