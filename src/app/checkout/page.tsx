"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { Coffee, ArrowLeft, MapPin, CreditCard, Truck, Store } from "lucide-react"
import Link from "next/link"

type FormData = {
  fullName: string
  phone: string
  email: string
  orderType: "PICKUP" | "DELIVERY"
  address: string
  paymentMethod: "CASH" | "KHALTI" | "ESEWA"
  notes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getCartTotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    orderType: "PICKUP",
    address: "",
    paymentMethod: "CASH",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError("Full name is required")
      return false
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required")
      return false
    }
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        return false
      }
    }
    if (formData.orderType === "DELIVERY" && !formData.address.trim()) {
      setError("Address is required for delivery orders")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    if (cart.length === 0) {
      setError("Your cart is empty")
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        orderType: formData.orderType,
        address: formData.orderType === "DELIVERY" ? formData.address : null,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || null,
        items: cart.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          price: item.menuItem.price,
        })),
        subtotal: getCartTotal(),
        deliveryFee: formData.orderType === "DELIVERY" ? 50 : 0, // Example delivery fee
        totalAmount: getCartTotal() + (formData.orderType === "DELIVERY" ? 50 : 0),
      }

      // For online payments, we need to initiate payment first
      if (formData.paymentMethod === "ESEWA" || formData.paymentMethod === "KHALTI") {
        // First create the order
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        let orderDataResponse
        try {
          orderDataResponse = await orderResponse.json()
        } catch (jsonError) {
          // Response is not JSON, might be HTML error page
          const textResponse = await orderResponse.text()
          console.error('Order API returned non-JSON response:', textResponse.substring(0, 200))
          throw new Error(`Server error: ${orderResponse.status} ${orderResponse.statusText}`)
        }

        if (!orderResponse.ok) {
          throw new Error(orderDataResponse.error || "Failed to place order")
        }

        const orderId = orderDataResponse.orderId

        // Then initiate payment
        const paymentEndpoint = formData.paymentMethod === "ESEWA" 
          ? "/api/payments/esewa/initiate" 
          : "/api/payments/khalti/initiate"

        const paymentResponse = await fetch(paymentEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            amount: orderData.totalAmount
          }),
        })

        let paymentData
        try {
          paymentData = await paymentResponse.json()
        } catch (jsonError) {
          // Response is not JSON, might be HTML error page
          const textResponse = await paymentResponse.text()
          console.error('Payment API returned non-JSON response:', textResponse.substring(0, 200))
          throw new Error(`Payment gateway error: ${paymentResponse.status} ${paymentResponse.statusText}`)
        }

        if (!paymentResponse.ok) {
          throw new Error(paymentData.error || "Failed to initiate payment")
        }

        // Clear cart and redirect to payment gateway
        clearCart()
        
        // For eSewa, we need to submit a form
        if (formData.paymentMethod === "ESEWA") {
          const form = document.createElement("form")
          form.method = "POST"
          form.action = paymentData.paymentUrl
          
          Object.entries(paymentData.paymentParams).forEach(([key, value]) => {
            const input = document.createElement("input")
            input.type = "hidden"
            input.name = key
            input.value = String(value)
            form.appendChild(input)
          })
          
          document.body.appendChild(form)
          form.submit()
        } else {
          // For Khalti, redirect to payment URL
          window.location.href = paymentData.paymentUrl
        }
      } else {
        // For Cash payment, create order directly
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })

        let data
        try {
          data = await response.json()
        } catch (jsonError) {
          // Response is not JSON, might be HTML error page
          const textResponse = await response.text()
          console.error('Order API returned non-JSON response:', textResponse.substring(0, 200))
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to place order")
        }

        // Clear cart and redirect to success page
        clearCart()
        router.push(`/order-success/${data.orderId}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while placing your order")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getItemPrice = (price: string) => {
    return parseFloat(price.replace(/[^0-9.]/g, '')) || 0
  }

  const getItemSubtotal = (price: string, quantity: number) => {
    return getItemPrice(price) * quantity
  }

  const deliveryFee = formData.orderType === "DELIVERY" ? 50 : 0
  const totalAmount = getCartTotal() + deliveryFee

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFB]">
        <section className="relative overflow-hidden bg-[#EAF0F4] py-16 md:py-20">
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-light tracking-tight text-[#29343A] md:text-5xl lg:text-6xl">
              Checkout
            </h1>
          </div>
        </section>

        <section className="bg-[#F8FAFB] py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-[#DDE5E9] bg-white px-6 py-20 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF0F4]">
                <Coffee className="h-8 w-8 text-[#6F8494]" />
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
            Checkout
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#68767D] md:text-lg">
            Complete your order details
          </p>
        </div>
      </section>

      {/* ================= CHECKOUT FORM ================= */}
      <section className="bg-[#F8FAFB] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* ================= FORM FIELDS ================= */}
            <div className="lg:col-span-2 space-y-6">
              {/* BACK BUTTON */}
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6F8494] transition-colors hover:text-[#5C7282]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Cart
              </Link>

              {/* CUSTOMER INFORMATION */}
              <div className="rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#292F33]">
                  Customer Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-[#53616A]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-[#D7E0E5] bg-white px-4 py-2.5 text-sm text-[#292F33] transition-colors focus:border-[#6F8494] focus:outline-none focus:ring-1 focus:ring-[#6F8494]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium text-[#53616A]">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-[#D7E0E5] bg-white px-4 py-2.5 text-sm text-[#292F33] transition-colors focus:border-[#6F8494] focus:outline-none focus:ring-1 focus:ring-[#6F8494]"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#53616A]">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-[#D7E0E5] bg-white px-4 py-2.5 text-sm text-[#292F33] transition-colors focus:border-[#6F8494] focus:outline-none focus:ring-1 focus:ring-[#6F8494]"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              {/* ORDER TYPE */}
              <div className="rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#292F33]">
                  Order Type
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, orderType: "PICKUP" }))}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      formData.orderType === "PICKUP"
                        ? "border-[#6F8494] bg-[#EAF0F4]"
                        : "border-[#D7E0E5] bg-white hover:border-[#9BAFBB]"
                    }`}
                  >
                    <Store className="h-6 w-6 text-[#6F8494]" />
                    <span className="text-sm font-semibold text-[#292F33]">Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, orderType: "DELIVERY" }))}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      formData.orderType === "DELIVERY"
                        ? "border-[#6F8494] bg-[#EAF0F4]"
                        : "border-[#D7E0E5] bg-white hover:border-[#9BAFBB]"
                    }`}
                  >
                    <Truck className="h-6 w-6 text-[#6F8494]" />
                    <span className="text-sm font-semibold text-[#292F33]">Delivery</span>
                  </button>
                </div>

                {formData.orderType === "DELIVERY" && (
                  <div className="mt-4">
                    <label htmlFor="address" className="mb-1 block text-sm font-medium text-[#53616A]">
                      Delivery Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full rounded-lg border border-[#D7E0E5] bg-white px-4 py-2.5 text-sm text-[#292F33] transition-colors focus:border-[#6F8494] focus:outline-none focus:ring-1 focus:ring-[#6F8494]"
                      placeholder="Enter your delivery address"
                    />
                  </div>
                )}
              </div>

              {/* PAYMENT METHOD */}
              <div className="rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#292F33]">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 rounded-lg border border-[#D7E0E5] bg-white p-4 transition-colors hover:border-[#9BAFBB]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH"
                      checked={formData.paymentMethod === "CASH"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#6F8494] focus:ring-[#6F8494]"
                    />
                    <CreditCard className="h-5 w-5 text-[#6F8494]" />
                    <div>
                      <span className="text-sm font-semibold text-[#292F33]">Pay at Counter / Cash</span>
                      <p className="text-xs text-[#737D83]">Pay when you pick up or receive your order</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border border-[#D7E0E5] bg-white p-4 transition-colors hover:border-[#9BAFBB]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="KHALTI"
                      checked={formData.paymentMethod === "KHALTI"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#6F8494] focus:ring-[#6F8494]"
                    />
                    <CreditCard className="h-5 w-5 text-[#6F8494]" />
                    <div>
                      <span className="text-sm font-semibold text-[#292F33]">Khalti</span>
                      <p className="text-xs text-[#737D83]">Pay securely with Khalti</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border border-[#D7E0E5] bg-white p-4 transition-colors hover:border-[#9BAFBB]">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ESEWA"
                      checked={formData.paymentMethod === "ESEWA"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#6F8494] focus:ring-[#6F8494]"
                    />
                    <CreditCard className="h-5 w-5 text-[#6F8494]" />
                    <div>
                      <span className="text-sm font-semibold text-[#292F33]">eSewa</span>
                      <p className="text-xs text-[#737D83]">Pay securely with eSewa</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* ORDER NOTES */}
              <div className="rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#292F33]">
                  Order Notes (optional)
                </h2>

                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-lg border border-[#D7E0E5] bg-white px-4 py-2.5 text-sm text-[#292F33] transition-colors focus:border-[#6F8494] focus:outline-none focus:ring-1 focus:ring-[#6F8494]"
                  placeholder="Any special instructions for your order?"
                />
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#6F8494] bg-[#6F8494] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#5C7282] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-[#292F33]">
                  Order Summary
                </h2>

                {/* ORDER ITEMS */}
                <div className="mb-4 space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((cartItem) => (
                    <div key={cartItem.menuItem.id} className="flex items-start gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#EAF0F4]">
                        {cartItem.menuItem.image ? (
                          <img
                            src={cartItem.menuItem.image}
                            alt={cartItem.menuItem.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Coffee className="h-5 w-5 text-[#6F8494]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#292F33] truncate">
                          {cartItem.menuItem.title}
                        </p>
                        <p className="text-xs text-[#737D83]">
                          {cartItem.menuItem.price} × {cartItem.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#7A4E2D]">
                        Rs. {getItemSubtotal(cartItem.menuItem.price, cartItem.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* PRICING */}
                <div className="space-y-3 border-t border-[#E8EEF1] pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737D83]">Subtotal</span>
                    <span className="font-semibold text-[#292F33]">
                      Rs. {getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737D83]">Delivery Fee</span>
                    <span className="font-semibold text-[#292F33]">
                      {formData.orderType === "DELIVERY" ? `Rs. ${deliveryFee.toFixed(2)}` : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-lg font-semibold text-[#292F33]">Total</span>
                    <span className="text-lg font-bold text-[#7A4E2D]">
                      Rs. {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
