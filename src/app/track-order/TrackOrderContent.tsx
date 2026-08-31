"use client"

import { useState, useEffect } from "react"
import { Search, Clock, CheckCircle, XCircle, ChefHat, Package, Calendar, Phone, MapPin } from "lucide-react"
import { useSearchParams } from "next/navigation"

type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED"

type Order = {
  id: number
  customerName: string
  phone: string
  email: string | null
  orderType: string
  address: string | null
  subtotal: number
  deliveryFee: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  status: OrderStatus
  notes: string | null
  createdAt: string
  items: {
    id: number
    quantity: number
    price: string
    menuItem: {
      id: number
      title: string
      image: string | null
    }
  }[]
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: "#B68A52",
  CONFIRMED: "#4A90A4",
  PREPARING: "#6F8494",
  READY: "#7A4E2D",
  COMPLETED: "#6B8E23",
  CANCELLED: "#B94A48"
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
}

const statusIcons: Record<OrderStatus, any> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PREPARING: ChefHat,
  READY: Package,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle
}

export default function TrackOrderContent() {
  const searchParams = useSearchParams()
  const orderIdParam = searchParams.get('orderId')
  
  const [orderId, setOrderId] = useState(orderIdParam || '')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (orderIdParam) {
      handleSearch()
    }
  }, [orderIdParam])

  const handleSearch = async () => {
    if (!orderId.trim()) {
      setError('Please enter an Order ID')
      return
    }

    setLoading(true)
    setError('')
    setSearched(true)

    try {
      // Extract numeric ID from ORD-XXXX format if provided
      const numericId = orderId.replace(/^ORD-/i, '')
      const response = await fetch(`/api/orders/${numericId}`)
      const data = await response.json()

      if (response.ok) {
        setOrder(data.order)
      } else {
        setError(data.error || 'Order not found')
        setOrder(null)
      }
    } catch (err) {
      setError('Failed to fetch order. Please try again.')
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const getStatusProgress = (status: OrderStatus): number => {
    const statusOrder: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED"]
    if (status === "CANCELLED") return 0
    return statusOrder.indexOf(status) + 1
  }

  const getStatusStep = (status: OrderStatus, currentStatus: OrderStatus): 'completed' | 'current' | 'pending' => {
    if (currentStatus === "CANCELLED") return 'pending'
    
    const statusOrder: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED"]
    const currentIndex = statusOrder.indexOf(currentStatus)
    const stepIndex = statusOrder.indexOf(status)
    
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'pending'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white" style={{ backgroundColor: '#F7F4EF' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#292522' }}>Track Your Order</h1>
          <p className="text-lg" style={{ color: '#756E68' }}>Enter your Order ID to check the status</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8" style={{ border: '1px solid #E7DED4' }}>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#756E68' }} />
              <input
                type="text"
                placeholder="Order ID (e.g., ORD-123 or 123)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#E7DED4', backgroundColor: '#FFFFFF', color: '#292522' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#7A4E2D' }}
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8" role="alert">
            {error}
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Status Card */}
            <div className="bg-white rounded-lg shadow-lg p-6" style={{ border: '1px solid #E7DED4' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#292522' }}>
                    Order #{order.id}
                  </h2>
                  <p className="text-sm" style={{ color: '#756E68' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold" style={{ backgroundColor: statusColors[order.status] }}>
                    {(() => {
                      const StatusIcon = statusIcons[order.status]
                      return <StatusIcon className="h-5 w-5" />
                    })()}
                    {statusLabels[order.status]}
                  </div>
                </div>
              </div>

              {/* Status Progress Tracker */}
              {order.status !== 'CANCELLED' ? (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#292522' }}>Order Progress</h3>
                  <div className="space-y-4">
                    {(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'] as OrderStatus[]).map((status) => {
                      const step = getStatusStep(status, order.status)
                      const StatusIcon = statusIcons[status]
                      
                      return (
                        <div key={status} className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step === 'completed' ? 'bg-green-500 text-white' :
                            step === 'current' ? 'text-white' : 'bg-gray-200 text-gray-400'
                          }`} style={step === 'current' ? { backgroundColor: statusColors[order.status] } : {}}>
                            {step === 'completed' ? (
                              <CheckCircle className="h-6 w-6" />
                            ) : (
                              <StatusIcon className="h-6 w-6" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold ${step === 'current' ? '' : 'text-gray-400'}`} style={{ color: step === 'current' ? '#292522' : '' }}>
                              {statusLabels[status]}
                            </div>
                          </div>
                          {step !== 'pending' && (
                            <div className="text-sm" style={{ color: '#756E68' }}>
                              {step === 'completed' ? '✓' : '●'}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-8 w-8 text-red-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-700">Order Cancelled</h3>
                      <p className="text-sm text-red-600">This order has been cancelled. Please contact us if you have any questions.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#292522' }}>Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#756E68' }}>Name:</span>
                      <span className="font-medium" style={{ color: '#292522' }}>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" style={{ color: '#756E68' }} />
                      <span className="font-medium" style={{ color: '#292522' }}>{order.phone}</span>
                    </div>
                    {order.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: '#756E68' }} />
                        <span className="font-medium" style={{ color: '#292522' }}>{order.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#292522' }}>Order Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#756E68' }}>Type:</span>
                      <span className="font-medium" style={{ color: '#292522' }}>{order.orderType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#756E68' }}>Payment:</span>
                      <span className="font-medium" style={{ color: '#292522' }}>{order.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#756E68' }}>Payment Status:</span>
                      <span className="font-medium" style={{ color: '#292522' }}>{order.paymentStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#292522' }}>Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.menuItem.image && (
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium" style={{ color: '#292522' }}>{item.menuItem.title}</div>
                          <div className="text-sm" style={{ color: '#756E68' }}>Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-semibold" style={{ color: '#292522' }}>Rs. {item.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E7DED4' }}>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold" style={{ color: '#292522' }}>Total Amount</span>
                  <span className="text-2xl font-bold" style={{ color: '#7A4E2D' }}>Rs. {order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg" style={{ border: '1px solid #B68A52' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#7A4E2D' }}>Order Notes</h4>
                  <p className="text-sm" style={{ color: '#292522' }}>{order.notes}</p>
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-lg shadow-lg p-6" style={{ border: '1px solid #E7DED4' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#292522' }}>Need Help?</h3>
              <p className="mb-4" style={{ color: '#756E68' }}>
                If you have any questions about your order, please contact us:
              </p>
              <div className="flex items-center gap-4">
                <a href="/contact" className="px-4 py-2 rounded-lg font-semibold text-white transition-colors" style={{ backgroundColor: '#7A4E2D' }}>
                  Contact Us
                </a>
                <a href="/enquiry" className="px-4 py-2 rounded-lg font-semibold transition-colors" style={{ backgroundColor: '#F7F4EF', color: '#292522' }}>
                  Send Enquiry
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!order && !searched && !error && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-30" style={{ color: '#7A4E2D' }} />
            <p className="text-lg" style={{ color: '#756E68' }}>
              Enter your Order ID above to track your order status
            </p>
          </div>
        )}
      </div>
    </div>
  )
}