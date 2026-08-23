"use client"

import { useState, useEffect } from "react"
import { Coffee, Tag, Image as ImageIcon, FileText, MessageSquare, Plus, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsError, setStatsError] = useState(false)

  useEffect(() => {
    setMounted(true)

    const loadStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats", { cache: "no-store" })
        if (!response.ok) throw new Error("Failed to fetch dashboard statistics")
        setStats(await response.json())
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error)
        setStatsError(true)
      }
    }

    loadStats()
  }, [])

  if (!mounted) return null

  const statCards = [
    { title: "Total Services", value: stats?.totalServices, icon: Coffee, detail: "All services" },
    { title: "Active Offers", value: stats?.activeOffers, icon: Tag, detail: "Active right now" },
    { title: "Gallery Images", value: stats?.galleryImages, icon: ImageIcon, detail: "All gallery images" },
    { title: "Blog Posts", value: stats?.blogPosts, icon: FileText, detail: "All blog posts" },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
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

      {/* Quick Actions */}
      <Card className="mb-8 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardHeader>
          <CardTitle className="font-semibold" style={{ color: '#292522' }}>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                 <Link href="/admin/blog">

            <Button variant="outline" className="flex items-center gap-2 h-auto py-4 font-medium w-full" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#7A4E2D' }}>
              <Plus className="h-4 w-4" />
              <span>Add Blog</span>
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
