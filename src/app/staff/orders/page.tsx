"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#292522' }}>Orders</h1>
        <p className="text-sm" style={{ color: '#756E68' }}>Manage customer orders</p>
      </div>

      <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardHeader>
          <CardTitle style={{ color: '#292522' }}>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12" style={{ color: '#756E68' }}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#756E68' }}>
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders yet</p>
              <p className="text-sm mt-2">Orders module not yet implemented</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-4 rounded-lg border" style={{ backgroundColor: '#F7F4EF', borderColor: '#E7DED4' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold" style={{ color: '#292522' }}>Order #{order.id}</h3>
                      <p className="text-sm" style={{ color: '#756E68' }}>{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium" style={{ color: '#7A4E2D' }}>{order.total}</p>
                      <p className="text-xs flex items-center gap-1" style={{ color: '#756E68' }}>
                        <Clock className="h-3 w-3" />
                        {order.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}