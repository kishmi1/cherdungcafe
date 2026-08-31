import { prisma } from "@/lib/prisma"
import { CheckCircle, Clock, Coffee, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED"

const statusSteps: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED"]

const getStatusIndex = (status: OrderStatus): number => {
  return statusSteps.indexOf(status)
}

const isStatusCompleted = (currentStatus: OrderStatus, checkStatus: OrderStatus): boolean => {
  return getStatusIndex(currentStatus) >= getStatusIndex(checkStatus)
}

const isStatusCurrent = (currentStatus: OrderStatus, checkStatus: OrderStatus): boolean => {
  return currentStatus === checkStatus
}

const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Order Placed",
    CONFIRMED: "Confirmed",
    PREPARING: "Preparing",
    READY: "Ready",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled"
  }
  return labels[status]
}

export default async function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const orderId = parseInt(id)

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
    notFound()
  }

  const currentStatus = order.status as OrderStatus

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#EAF0F4] py-16 md:py-20">
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#6F8494]">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-light tracking-tight text-[#29343A] md:text-5xl lg:text-6xl">
            Order Placed Successfully!
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#68767D] md:text-lg">
            Thank you for your order. We're preparing it with care.
          </p>
        </div>
      </section>

      {/* ================= ORDER DETAILS ================= */}
      <section className="bg-[#F8FAFB] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* ================= ORDER INFO ================= */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Order Number */}
              <div className="rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#292F33]">
                  Order #{order.id}
                </h2>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-[#737D83]">Customer Name</p>
                    <p className="font-semibold text-[#292F33]">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#737D83]">Phone</p>
                    <p className="font-semibold text-[#292F33]">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#737D83]">Order Type</p>
                    <p className="font-semibold text-[#292F33]">{order.orderType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#737D83]">Payment Method</p>
                    <p className="font-semibold text-[#292F33]">{order.paymentMethod}</p>
                  </div>
                  {order.email && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-[#737D83]">Email</p>
                      <p className="font-semibold text-[#292F33]">{order.email}</p>
                    </div>
                  )}
                  {order.address && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-[#737D83]">Delivery Address</p>
                      <p className="font-semibold text-[#292F33]">{order.address}</p>
                    </div>
                  )}
                  {order.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-[#737D83]">Order Notes</p>
                      <p className="font-semibold text-[#292F33]">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#292F33]">
                  Order Items
                </h2>
                
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFB]">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#EAF0F4]">
                        {item.menuItem.image ? (
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Coffee className="h-6 w-6 text-[#6F8494]" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#292F33]">{item.menuItem.title}</h3>
                        <p className="text-sm text-[#737D83]">
                          {item.menuItem.price} × {item.quantity}
                        </p>
                      </div>
                      
                      <p className="font-semibold text-[#7A4E2D]">
                        Rs. {(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ================= ORDER STATUS & SUMMARY ================= */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Order Status */}
              <div className="rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#292F33]">
                  Order Status
                </h2>
                
                <div className="space-y-4">
                  {statusSteps.map((status) => {
                    const isCompleted = isStatusCompleted(currentStatus, status)
                    const isCurrent = isStatusCurrent(currentStatus, status)
                    const isCancelled = currentStatus === "CANCELLED"
                    
                    if (isCancelled && status !== "CANCELLED") return null
                    
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <div className={`
                          flex h-8 w-8 items-center justify-center rounded-full
                          ${isCompleted ? 'bg-[#6F8494]' : 'bg-[#EAF0F4]'}
                          ${isCurrent ? 'ring-2 ring-[#6F8494] ring-offset-2' : ''}
                        `}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-white" />
                          ) : (
                            <Clock className="h-4 w-4 text-[#6F8494]" />
                          )}
                        </div>
                        <span className={`font-medium ${isCompleted ? 'text-[#292F33]' : 'text-[#737D83]'}`}>
                          {getStatusLabel(status)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-2xl border border-[#DDE5E9] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#292F33]">
                  Order Summary
                </h2>
                
                <div className="space-y-3 border-b border-[#E8EEF1] pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737D83]">Subtotal</span>
                    <span className="font-semibold text-[#292F33]">
                      Rs. {order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737D83]">Delivery Fee</span>
                    <span className="font-semibold text-[#292F33]">
                      {order.deliveryFee > 0 ? `Rs. ${order.deliveryFee.toFixed(2)}` : "Free"}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6 flex justify-between pt-4">
                  <span className="text-lg font-semibold text-[#292F33]">Total</span>
                  <span className="text-lg font-bold text-[#7A4E2D]">
                    Rs. {order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/menu"
                    className="block w-full rounded-xl border border-[#6F8494] bg-[#6F8494] px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#5C7282] hover:shadow-md"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Back to Menu
                    </span>
                  </Link>
                  <Link
                    href="/"
                    className="block w-full rounded-xl border border-[#D7E0E5] bg-white px-6 py-3 text-center text-sm font-semibold text-[#53616A] transition-all duration-300 hover:border-[#9BAFBB] hover:bg-[#EAF0F4]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Home className="h-4 w-4" />
                      Go to Home
                    </span>
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