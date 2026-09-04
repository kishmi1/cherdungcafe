"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Search, Filter, Eye, CheckCircle, XCircle, Truck, ChefHat, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL")
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/staff/orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId)
    try {
      const response = await fetch(`/api/staff/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const updatePaymentStatus = async (orderId: number, newPaymentStatus: string) => {
    setUpdatingOrderId(orderId)
    try {
      const response = await fetch(`/api/staff/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPaymentStatus })
      })

      if (response.ok) {
        await fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, paymentStatus: newPaymentStatus } : null)
        }
      }
    } catch (error) {
      console.error('Failed to update payment status:', error)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.id.toString().includes(searchTerm)
    
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const possibleTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PREPARING", "CANCELLED"],
    PREPARING: ["READY", "CANCELLED"],
    READY: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: []
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#292522' }}>Orders</h1>
        <p className="text-sm" style={{ color: '#756E68' }}>Manage customer orders</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#756E68' }} />
          <input
            type="text"
            placeholder="Search by name, phone, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: '#E7DED4', backgroundColor: '#FFFFFF', color: '#292522' }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#756E68' }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "ALL")}
            className="pl-10 pr-8 py-2 rounded-lg border focus:outline-none focus:ring-2 appearance-none"
            style={{ borderColor: '#E7DED4', backgroundColor: '#FFFFFF', color: '#292522' }}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#292522' }}>
                Recent Orders ({filteredOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12" style={{ color: '#756E68' }}>
                  Loading orders...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12" style={{ color: '#756E68' }}>
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status]
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedOrder?.id === order.id
                            ? 'ring-2 ring-[#B68A52]'
                            : 'hover:shadow-md'
                        }`}
                        style={{
                          backgroundColor: '#F7F4EF',
                          borderColor: selectedOrder?.id === order.id ? '#B68A52' : '#E7DED4'
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold" style={{ color: '#292522' }}>
                                Order #{order.id}
                              </h3>
                              <span
                                className="px-2 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1"
                                style={{ backgroundColor: statusColors[order.status] }}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {statusLabels[order.status]}
                              </span>
                            </div>
                            <p className="text-sm mb-1" style={{ color: '#756E68' }}>
                              {order.customerName} • {order.phone}
                            </p>
                            <p className="text-xs" style={{ color: '#756E68' }}>
                              {order.orderType} • {order.items.length} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium" style={{ color: '#7A4E2D' }}>
                              Rs. {order.totalAmount.toFixed(2)}
                            </p>
                            <p className="text-xs flex items-center gap-1" style={{ color: '#756E68' }}>
                              <Clock className="h-3 w-3" />
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#292522' }}>
                {selectedOrder ? `Order #${selectedOrder.id}` : 'Select an Order'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedOrder ? (
                <div className="text-center py-12" style={{ color: '#756E68' }}>
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an order to view details</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Customer Info */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm" style={{ color: '#292522' }}>Customer Information</h4>
                    <div className="text-sm" style={{ color: '#756E68' }}>
                      <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                      <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                      {selectedOrder.email && <p><strong>Email:</strong> {selectedOrder.email}</p>}
                      <p><strong>Type:</strong> {selectedOrder.orderType}</p>
                      {selectedOrder.address && <p><strong>Address:</strong> {selectedOrder.address}</p>}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm" style={{ color: '#292522' }}>Order Items</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm p-2 rounded" style={{ backgroundColor: '#F7F4EF' }}>
                          <div>
                            <p style={{ color: '#292522' }}>{item.menuItem.title}</p>
                            <p style={{ color: '#756E68' }}>{item.price} × {item.quantity}</p>
                          </div>
                          <p className="font-medium" style={{ color: '#7A4E2D' }}>
                            Rs. {(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#E7DED4' }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#756E68' }}>Subtotal</span>
                      <span style={{ color: '#292522' }}>Rs. {selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#756E68' }}>Delivery Fee</span>
                      <span style={{ color: '#292522' }}>
                        {selectedOrder.deliveryFee > 0 ? `Rs. ${selectedOrder.deliveryFee.toFixed(2)}` : 'Free'}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2">
                      <span style={{ color: '#292522' }}>Total</span>
                      <span style={{ color: '#7A4E2D' }}>Rs. {selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#E7DED4' }}>
                    <h4 className="font-semibold text-sm" style={{ color: '#292522' }}>Payment Information</h4>
                    <div className="text-sm" style={{ color: '#756E68' }}>
                      <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod === 'CASH' ? 'Cash on Delivery' : selectedOrder.paymentMethod}</p>
                      <p>
                        <strong>Payment Status:</strong> {selectedOrder.paymentStatus === 'PAID' ? 'Paid ✅' : selectedOrder.paymentStatus === 'FAILED' ? 'Failed ❌' : 'Pending ⏳'}
                      </p>
                    </div>
                    {selectedOrder.paymentMethod === 'CASH' && selectedOrder.paymentStatus === 'PENDING' && (
                      <Button
                        onClick={() => updatePaymentStatus(selectedOrder.id, 'PAID')}
                        disabled={updatingOrderId === selectedOrder.id}
                        className="w-full mt-2"
                        style={{
                          backgroundColor: '#6B8E23',
                          color: 'white',
                          opacity: updatingOrderId === selectedOrder.id ? 0.5 : 1
                        }}
                      >
                        {updatingOrderId === selectedOrder.id ? 'Updating...' : 'Mark as Paid'}
                      </Button>
                    )}
                    {selectedOrder.paymentMethod !== 'CASH' && selectedOrder.paymentStatus === 'PAID' && (
                      <div className="mt-2 p-2 rounded bg-green-50 border border-green-200">
                        <p className="text-xs text-green-800">✓ Online payment verified</p>
                      </div>
                    )}
                  </div>

                  {/* Status Actions */}
                  <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#E7DED4' }}>
                    <h4 className="font-semibold text-sm" style={{ color: '#292522' }}>Update Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {possibleTransitions[selectedOrder.status].map((newStatus) => (
                        <Button
                          key={newStatus}
                          onClick={() => updateOrderStatus(selectedOrder.id, newStatus)}
                          disabled={updatingOrderId === selectedOrder.id}
                          className="text-xs"
                          style={{
                            backgroundColor: statusColors[newStatus],
                            color: 'white',
                            opacity: updatingOrderId === selectedOrder.id ? 0.5 : 1
                          }}
                        >
                          {statusLabels[newStatus]}
                        </Button>
                      ))}
                    </div>
                    {selectedOrder.notes && (
                      <div className="pt-2">
                        <p className="text-xs font-semibold mb-1" style={{ color: '#292522' }}>Notes:</p>
                        <p className="text-xs italic" style={{ color: '#756E68' }}>{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}