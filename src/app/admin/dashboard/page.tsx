"use client"

import { useState, useEffect } from "react"
import { Coffee, Tag, Image as ImageIcon, FileText, MessageSquare, Plus, ChevronRight, ShoppingCart, Users, TrendingUp, IndianRupee, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesChart } from "@/components/admin/SalesChart"
import { OrderStatusChart } from "@/components/admin/OrderStatusChart"

type DashboardStats = {
  totalServices: number
  activeOffers: number
  galleryImages: number
  blogPosts: number
  newEnquiries: number
  recentActivities: {
    action: string
    item: string
    createdAt: string
  }[]
  dailySales: Array<{
    name: string
    sales: number
  }>
  orderStatusData: Array<{
    name: string
    value: number
    color: string
  }>
  totalOrders: number
  recentOrders: Array<{
    id: number
    customerName: string
    customerEmail: string
    totalAmount: number
    status: string
    createdAt: string
  }>
  totalRevenue: number
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsError, setStatsError] = useState(false)
  const [dateRange, setDateRange] = useState("7")

  useEffect(() => {
    setMounted(true)

    const loadStats = async () => {
      try {
        const response = await fetch(`/api/dashboard/stats?dateRange=${dateRange}`, { cache: "no-store" })
        if (!response.ok) throw new Error("Failed to fetch dashboard statistics")
        setStats(await response.json())
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error)
        setStatsError(true)
      }
    }

    loadStats()
  }, [dateRange])

  if (!mounted) return null

  const statCards = [
    { title: "Total Revenue", value: stats?.totalRevenue ? `Rs.${stats.totalRevenue.toLocaleString()}` : "Rs.0", icon: IndianRupee, detail: "Total earnings" },
    { title: "Total Orders", value: stats?.totalOrders, icon: ShoppingCart, detail: "All orders" },
    { title: "Active Offers", value: stats?.activeOffers, icon: Tag, detail: "Active right now" },
    { title: "New Enquiries", value: stats?.newEnquiries, icon: MessageSquare, detail: "Awaiting response" },
  ]

  const formatRelativeTime = (dateString: string) => {
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 1000))
    if (seconds < 60) return "Just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="p-6" style={{ backgroundColor: '#F7F4EF' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#292522' }}>Dashboard</h1>
        <p className="text-sm" style={{ color: '#756E68' }}>Welcome back, Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold" style={{ color: '#756E68' }}>
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5" style={{ color: '#7A4E2D' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#292522' }}>
                {statsError ? "—" : stat.value ?? "…"}
              </div>
              <p className="text-sm mt-1 font-medium" style={{ color: '#756E68' }}>{stat.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Sales Overview Chart */}
        <Card className="shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-semibold flex items-center gap-2" style={{ color: '#292522' }}>
                <TrendingUp className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                Sales Overview
              </CardTitle>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-1.5 rounded border text-sm"
                style={{ borderColor: '#E7DED4', color: '#292522', backgroundColor: '#FFFFFF' }}
              >
                <option value="7">Last 7 Days</option>
                <option value="14">Last 14 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.dailySales ? (
              <SalesChart data={stats.dailySales} />
            ) : (
              <p className="text-sm" style={{ color: '#756E68' }}>Loading sales data...</p>
            )}
          </CardContent>
        </Card>

        {/* Order Status Chart */}
        <Card className="shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
          <CardHeader>
            <CardTitle className="font-semibold flex items-center gap-2" style={{ color: '#292522' }}>
              <ShoppingCart className="h-5 w-5" style={{ color: '#7A4E2D' }} />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.orderStatusData ? (
              <OrderStatusChart data={stats.orderStatusData} />
            ) : (
              <p className="text-sm" style={{ color: '#756E68' }}>Loading order data...</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="mb-8 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-semibold flex items-center gap-2" style={{ color: '#292522' }}>
              <ShoppingCart className="h-5 w-5" style={{ color: '#7A4E2D' }} />
              Recent Orders
            </CardTitle>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#7A4E2D' }}>
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!stats && !statsError ? (
            <p className="text-sm" style={{ color: '#756E68' }}>Loading recent orders...</p>
          ) : statsError ? (
            <p className="text-sm" style={{ color: '#756E68' }}>Recent orders could not be loaded.</p>
          ) : stats?.recentOrders.length === 0 ? (
            <p className="text-sm" style={{ color: '#756E68' }}>No recent orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #E7DED4' }}>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#756E68' }}>Order ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#756E68' }}>Customer</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#756E68' }}>Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#756E68' }}>Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#756E68' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #E7DED4' }}>
                      <td className="py-3 px-4 text-sm" style={{ color: '#292522' }}>#{order.id}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#292522' }}>{order.customerName}</td>
                      <td className="py-3 px-4 text-sm font-medium" style={{ color: '#7A4E2D' }}>Rs.{order.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium" 
                          style={{
                            backgroundColor: 
                              order.status === 'Delivered' ? '#7A4E2D' :
                              order.status === 'Processing' ? '#B68A52' :
                              order.status === 'Pending' ? '#D4C4A8' : '#E7DED4',
                            color: order.status === 'Cancelled' ? '#756E68' : '#FFFFFF'
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#756E68' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="mb-8 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardHeader>
          <CardTitle className="font-semibold" style={{ color: '#292522' }}>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/orders">
              <Button variant="outline" className="flex items-center gap-2 h-auto py-4 font-medium w-full" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#7A4E2D' }}>
                <ShoppingCart className="h-4 w-4" />
                <span>View Orders</span>
              </Button>
            </Link>
            <Link href="/admin/services">
              <Button variant="outline" className="flex items-center gap-2 h-auto py-4 font-medium w-full" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#7A4E2D' }}>
                <Plus className="h-4 w-4" />
                <span>Add Service</span>
              </Button>
            </Link>
            <Link href="/admin/offers">
              <Button variant="outline" className="flex items-center gap-2 h-auto py-4 font-medium w-full" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#7A4E2D' }}>
                <Plus className="h-4 w-4" />
                <span>Add Offer</span>
            </Button>
            </Link>
            <Link href="/admin/enquiries">
              <Button variant="outline" className="flex items-center gap-2 h-auto py-4 font-medium w-full" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#7A4E2D' }}>
                <MessageSquare className="h-4 w-4" />
                <span>View Enquiries</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardHeader>
          <CardTitle className="font-semibold" style={{ color: '#292522' }}>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats && !statsError ? (
            <p className="text-sm" style={{ color: '#756E68' }}>Loading recent activity…</p>
          ) : statsError ? (
            <p className="text-sm" style={{ color: '#756E68' }}>Recent activity could not be loaded.</p>
          ) : stats?.recentActivities.length === 0 ? (
            <p className="text-sm" style={{ color: '#756E68' }}>No recent activity yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentActivities.map((activity, index) => (
                <div
                  key={`${activity.action}-${activity.item}-${activity.createdAt}-${index}`}
                  className="flex items-start gap-4 p-4 rounded-lg"
                  style={{ backgroundColor: '#F7F4EF', border: '1px solid #E7DED4' }}
                >
                  <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 border" style={{ backgroundColor: '#F7F4EF', borderColor: '#B68A52' }}>
                    <ChevronRight className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: '#292522' }}>{activity.action}</p>
                    <p className="text-sm truncate" style={{ color: '#756E68' }}>{activity.item}</p>
                  </div>
                  <p className="text-xs flex-shrink-0 font-medium" style={{ color: '#756E68' }}>
                    {formatRelativeTime(activity.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
