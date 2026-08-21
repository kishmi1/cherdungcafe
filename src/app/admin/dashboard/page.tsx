"use client"

import { useState, useEffect } from "react"
import { 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Coffee, 
  Tag, 
  Image as ImageIcon, 
  FileText, 
  MessageSquare, 
  Mail, 
  Settings, 
  Bell, 
  User,
  Plus,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Coffee, label: "Services", href: "/admin/services" },
  { icon: Tag, label: "Offers", href: "/admin/offers" },
  { icon: ImageIcon, label: "Gallery", href: "/admin/gallery" },
  { icon: FileText, label: "Blog", href: "/admin/blog" },
  { icon: MessageSquare, label: "Enquiries", href: "/admin/enquiries" },
  { icon: Mail, label: "Messages", href: "/admin/messages" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleLogout = () => {
    router.push("/login")
  }

  const stats = [
    { title: "Total Services", value: "12", icon: Coffee, color: "amber", change: "+2 this month" },
    { title: "Active Offers", value: "5", icon: Tag, color: "green", change: "+1 this week" },
    { title: "Gallery Images", value: "48", icon: ImageIcon, color: "blue", change: "+8 this month" },
    { title: "Blog Posts", value: "24", icon: FileText, color: "purple", change: "+3 this month" },
    { title: "New Enquiries", value: "18", icon: MessageSquare, color: "orange", change: "+5 today" },
  ]

  const recentActivities = [
    { action: "New enquiry received", item: "Catering request for wedding", time: "2 hours ago" },
    { action: "Blog post published", item: "Summer Menu Specials", time: "5 hours ago" },
    { action: "Offer updated", item: "Weekend Coffee Deal", time: "1 day ago" },
    { action: "New gallery image added", item: "Interior renovation photos", time: "2 days ago" },
    { action: "Service modified", item: "Breakfast menu updated", time: "3 days ago" },
  ]

  return (
    <div className="p-6" style={{ backgroundColor: '#F7F4EF' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#292522' }}>Dashboard</h1>
        <p className="text-sm" style={{ color: '#756E68' }}>Welcome back, Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold" style={{ color: '#756E68' }}>
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5" style={{ color: '#7A4E2D' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#292522' }}>{stat.value}</div>
              <p className="text-sm mt-1 font-medium" style={{ color: '#756E68' }}>{stat.change}</p>
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
            <Button variant="outline" className="flex items-center gap-2 h-auto py-4 font-medium" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#7A4E2D' }}>
              <Plus className="h-4 w-4" />
              <span>Add Offer</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto py-4 font-medium" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#7A4E2D' }}>
              <Plus className="h-4 w-4" />
              <span>Add Blog</span>
            </Button>
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
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg transition-all duration-200"
                style={{ backgroundColor: '#F7F4EF', border: '1px solid #E7DED4' }}
              >
                <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 border" style={{ backgroundColor: '#F7F4EF', borderColor: '#B68A52' }}>
                  <ChevronRight className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#292522' }}>
                    {activity.action}
                  </p>
                  <p className="text-sm truncate" style={{ color: '#756E68' }}>
                    {activity.item}
                  </p>
                </div>
                <p className="text-xs flex-shrink-0 font-medium" style={{ color: '#756E68' }}>
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}