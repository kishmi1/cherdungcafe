"use client"

import { useCart } from "@/lib/cart-context"
import { Coffee, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartItemCount } = useCart()

  const handleQuantityChange = (menuItemId: number, newQuantity: number) => {
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFB]">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#EAF0F4] py-16 md:py-20">
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-light tracking-tight text-[#29343A] md:text-5xl lg:text-6xl">
              Your Cart
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#68767D] md:text-lg">
              Review your items before checkout
            </p>
          </div>
        </section>

        {/* ================= EMPTY STATE ================= */}
        <section className="bg-[#F8FAFB] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-[#DDE5E9] bg-white px-6 py-20 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF0F4]">
                <ShoppingBag className="h-8 w-8 text-[#6F8494]" />
              </div>
              <h3 className="text-lg font-semibold text-[#292F33]">
                Your cart is empty
              </h3>
              <p className="mt-2 text-sm text-[#737D83]">
                Add some delicious items from our menu
              </p>
              <Link
                href="/menu"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#6F8494] bg-[#6F8494] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#5C7282] hover:shadow-md"
              >
                Browse Menu
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#EAF0F4] py-16 md:py-20">
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-light tracking-tight text-[#29343A] md:text-5xl lg:text-6xl">
            Your Cart
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#68767D] md:text-lg">
            Review your items before checkout
          </p>
        </div>
      </section>

      {/* ================= CART CONTENT ================= */}
      <section className="bg-[#F8FAFB] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* ================= CART ITEMS ================= */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((cartItem) => (
                <div
                  key={cartItem.menuItem.id}
                  className="rounded-2xl border border-[#DDE5E9] bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-4">
                    {/* IMAGE */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#EAF0F4]">
                      {cartItem.menuItem.image ? (
                        <img
                          src={cartItem.menuItem.image}
                          alt={cartItem.menuItem.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Coffee className="h-8 w-8 text-[#6F8494]" />
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-1 flex-col">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          {cartItem.menuItem.category && (
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8096A3]">
                              {cartItem.menuItem.category}
                            </p>
                          )}
                          <h3 className="text-lg font-semibold text-[#292F33]">
                            {cartItem.menuItem.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(cartItem.menuItem.id)}
                          className="text-[#737D83] transition-colors hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        {/* QUANTITY CONTROLS */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(cartItem.menuItem.id, cartItem.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7E0E5] bg-white text-[#53616A] transition-colors hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-semibold text-[#292F33]">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(cartItem.menuItem.id, cartItem.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7E0E5] bg-white text-[#53616A] transition-colors hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* PRICE */}
                        <div className="text-right">
                          <p className="text-sm text-[#737D83]">
                            {cartItem.menuItem.price} × {cartItem.quantity}
                          </p>
                          <p className="text-lg font-bold text-[#7A4E2D]">
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
              <div className="sticky top-24 rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-[#292F33]">
                  Order Summary
                </h2>

                <div className="space-y-3 border-b border-[#E8EEF1] pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737D83]">Subtotal ({getCartItemCount()} items)</span>
                    <span className="font-semibold text-[#292F33]">
                      Rs. {getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737D83]">Delivery Fee</span>
                    <span className="font-semibold text-[#292F33]">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="mb-6 flex justify-between pt-4">
                  <span className="text-lg font-semibold text-[#292F33]">Total</span>
                  <span className="text-lg font-bold text-[#7A4E2D]">
                    Rs. {getCartTotal().toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/menu"
                    className="block w-full rounded-xl border border-[#D7E0E5] bg-white px-6 py-3 text-center text-sm font-semibold text-[#53616A] transition-all duration-300 hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/checkout"
                    className="block w-full rounded-xl border border-[#6F8494] bg-[#6F8494] px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#5C7282] hover:shadow-md"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
