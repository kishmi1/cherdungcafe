"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Mail, Clock, CheckCircle, AlertCircle, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DashboardStats = {
  newEnquiries: number
  unreadMessages: number
  pendingEnquiries: number
  confirmedEnquiries: number
  recentEnquiries: {
    id: number
    name: string
    subject: string
    status: string
    createdAt: string
  }[]
  recentMessages: {
    id: number
    name: string
    subject: string
    isRead: boolean
    createdAt: string
  }[]
}

export default function StaffDashboard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsError, setStatsError] = useState(false)

  useEffect(() => {
    setMounted(true)

    const loadStats = async () => {
      try {
        const response = await fetch("/api/staff/dashboard/stats", { cache: "no-store" })
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
    { title: "New Enquiries", value: stats?.newEnquiries, icon: AlertCircle, detail: "Awaiting response", color: "#f59e0b" },
    { title: "Unread Messages", value: stats?.unreadMessages, icon: Mail, detail: "New contact messages", color: "#3b82f6" },
    { title: "Pending Enquiries", value: stats?.pendingEnquiries, icon: Clock, detail: "In progress", color: "#7A4E2D" },
    { title: "Confirmed Enquiries", value: stats?.confirmedEnquiries, icon: CheckCircle, detail: "Completed bookings", color: "#10b981" },
  ]

  const formatRelativeTime = (dateString: string) => {
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 1000))
    if (seconds < 60) return "Just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getEnquiryStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEnquiryStatusLabel = (status: string) => {
    switch (status) {
      case "NEW":
        return "New"
      case "IN_PROGRESS":
        return "In Progress"
      case "RESOLVED":
        return "Resolved"
      default:
        return status
    }
  }

  return (
    <div className="p-6" style={{ backgroundColor: '#F7F4EF' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#292522' }}>Staff Dashboard</h1>
        <p className="text-sm" style={{ color: '#756E68' }}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold" style={{ color: '#756E68' }}>
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
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
            <Link href="/staff/enquiries">
              <Button variant="outline" className="flex items-center gap-2 h-auto py-4 font-medium w-full" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#7A4E2D' }}>
                <MessageSquare className="h-4 w-4" />
                <span>View Enquiries</span>
              </Button>
            </Link>
            <Link href="/staff/messages">
              <Button variant="outline" className="flex items-center gap-2 h-auto py-4 font-medium w-full" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#7A4E2D' }}>
                <Mail className="h-4 w-4" />
                <span>View Messages</span>
              </Button>
            </Link>
            <Link href="/staff/profile">
              <Button variant="outline" className="flex items-center gap-2 h-auto py-4 font-medium w-full" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#7A4E2D' }}>
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <Card className="shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-semibold" style={{ color: '#292522' }}>Recent Enquiries</CardTitle>
            <Link href="/staff/enquiries">
              <Button variant="ghost" size="sm" style={{ color: '#7A4E2D' }}>
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!stats && !statsError ? (
              <p className="text-sm" style={{ color: '#756E68' }}>Loading recent enquiries…</p>
            ) : statsError ? (
              <p className="text-sm" style={{ color: '#756E68' }}>Recent enquiries could not be loaded.</p>
            ) : stats?.recentEnquiries.length === 0 ? (
              <p className="text-sm" style={{ color: '#756E68' }}>No recent enquiries.</p>
            ) : (
              <div className="space-y-3">
                {stats?.recentEnquiries.slice(0, 5).map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: '#F7F4EF', border: '1px solid #E7DED4' }}
                  >
                    <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border" style={{ backgroundColor: '#F7F4EF', borderColor: '#B68A52' }}>
                      <MessageSquare className="h-4 w-4" style={{ color: '#7A4E2D' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold truncate" style={{ color: '#292522' }}>{enquiry.subject}</p>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getEnquiryStatusColor(enquiry.status)}`}
                        >
                          {getEnquiryStatusLabel(enquiry.status)}
                        </span>
                      </div>
                      <p className="text-sm truncate" style={{ color: '#756E68' }}>{enquiry.name}</p>
                      <p className="text-xs mt-1" style={{ color: '#999' }}>{formatRelativeTime(enquiry.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-semibold" style={{ color: '#292522' }}>Recent Messages</CardTitle>
            <Link href="/staff/messages">
              <Button variant="ghost" size="sm" style={{ color: '#7A4E2D' }}>
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!stats && !statsError ? (
              <p className="text-sm" style={{ color: '#756E68' }}>Loading recent messages…</p>
            ) : statsError ? (
              <p className="text-sm" style={{ color: '#756E68' }}>Recent messages could not be loaded.</p>
            ) : stats?.recentMessages.length === 0 ? (
              <p className="text-sm" style={{ color: '#756E68' }}>No recent messages.</p>
            ) : (
              <div className="space-y-3">
                {stats?.recentMessages.slice(0, 5).map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: '#F7F4EF', border: '1px solid #E7DED4' }}
                  >
                    <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border" style={{ backgroundColor: '#F7F4EF', borderColor: '#B68A52' }}>
                      <Mail className="h-4 w-4" style={{ color: '#7A4E2D' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold truncate" style={{ color: '#292522' }}>{message.subject}</p>
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm truncate" style={{ color: '#756E68' }}>{message.name}</p>
                      <p className="text-xs mt-1" style={{ color: '#999' }}>{formatRelativeTime(message.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
