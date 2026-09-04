"use client"

import { useSearchParams } from "next/navigation"
import { XCircle, RefreshCw, Home, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function OrderFailedPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const reason = searchParams.get("reason")

  const getErrorMessage = (reason: string | null) => {
    switch (reason) {
      case "payment_cancelled":
        return "Your payment was cancelled. You can try again or choose a different payment method."
      case "payment_failed":
        return "Your payment failed. Please try again or contact support if the issue persists."
      case "verification_failed":
        return "Payment verification failed. Please contact our support team with your order details."
      case "invalid_parameters":
        return "Invalid payment parameters. Please try placing your order again."
      case "gateway_error":
        return "Payment gateway error. Please try again later or contact support."
      case "server_error":
        return "A server error occurred. Please try again later."
      case "signature_mismatch":
        return "Payment security verification failed. Please contact support."
      case "amount_mismatch":
        return "Payment amount mismatch. Please contact support."
      case "invalid_response":
        return "Invalid payment response. Please try again or contact support."
      case "invalid_response_data":
        return "Invalid payment data received. Please try again or contact support."
      case "invalid_transaction_format":
        return "Invalid transaction format. Please contact support."
      case "invalid_product_code":
        return "Invalid payment configuration. Please contact support."
      case "transaction_mismatch":
        return "Transaction mismatch. Please contact support."
      case "order_not_found":
        return "Order not found. Please contact support with your order details."
      default:
        return "An error occurred while processing your payment. Please try again."
    }
  }

  const errorMessage = getErrorMessage(reason)

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#EAF0F4] py-16 md:py-20">
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="mb-4 text-4xl font-light tracking-tight text-[#29343A] md:text-5xl lg:text-6xl">
            Payment Failed
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#68767D] md:text-lg">
            {errorMessage}
          </p>
        </div>
      </section>

      {/* ================= ACTIONS ================= */}
      <section className="bg-[#F8FAFB] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[#DDE5E9] bg-white p-8 shadow-sm">
              <div className="space-y-6">
                {orderId && (
                  <div className="text-center">
                    <p className="text-sm text-[#737D83]">Order ID</p>
                    <p className="text-lg font-semibold text-[#292F33]">#{orderId}</p>
                  </div>
                )}

                <div className="border-t border-[#E8EEF1] pt-6">
                  <h3 className="mb-4 text-lg font-semibold text-[#292F33]">
                    What would you like to do?
                  </h3>
                  
                  <div className="space-y-3">
                    {orderId && (
                      <Link
                        href={`/checkout?retry=${orderId}`}
                        className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#6F8494] bg-[#6F8494] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#5C7282] hover:shadow-md"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Retry Payment
                      </Link>
                    )}
                    
                    <Link
                      href="/cart"
                      className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#D7E0E5] bg-white px-6 py-3 text-sm font-semibold text-[#53616A] transition-all duration-300 hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      View Cart
                    </Link>
                    
                    <Link
                      href="/menu"
                      className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#D7E0E5] bg-white px-6 py-3 text-sm font-semibold text-[#53616A] transition-all duration-300 hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                    >
                      Browse Menu
                    </Link>
                    
                    <Link
                      href="/"
                      className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#D7E0E5] bg-white px-6 py-3 text-sm font-semibold text-[#53616A] transition-all duration-300 hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                    >
                      <Home className="h-4 w-4" />
                      Go to Home
                    </Link>
                  </div>
                </div>

                <div className="border-t border-[#E8EEF1] pt-6 text-center">
                  <p className="text-sm text-[#737D83]">
                    Need help? Contact us at{" "}
                    <a href="mailto:support@cherdungcafe.com" className="text-[#6F8494] hover:underline">
                      support@cherdungcafe.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}