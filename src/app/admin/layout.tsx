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
  User
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  getNewEnquiryCount, 
  subscribeToNotifications, 
  resetNewEnquiryCount,
  initializeNotificationCount
} from "@/lib/notifications"

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    // Initialize notification count from server
    initializeNotificationCount()
    
    // Subscribe to notification updates
    const unsubscribe = subscribeToNotifications((count) => {
      setNotificationCount(count)
    })

    return unsubscribe
  }, [])

  // Reset count when navigating to enquiries page
  useEffect(() => {
    if (pathname === "/admin/enquiries") {
      resetNewEnquiryCount()
    }
  }, [pathname])

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F4EF' }}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#2B211B' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: '#3D3229' }}>
            <Coffee className="h-6 w-6" style={{ color: '#B68A52' }} />
            <div>
              <h1 className="font-bold text-white text-lg">CHERDUNG</h1>
              <p className="text-xs" style={{ color: '#E7DED4' }}>Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                style={{ 
                  color: '#E7DED4',
                  backgroundColor: pathname === item.href ? '#7A4E2D' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (pathname !== item.href) {
                    e.currentTarget.style.backgroundColor = '#3D3229'
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.href) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t" style={{ borderColor: '#3D3229' }}>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center gap-2"
              style={{ 
                backgroundColor: '#3D3229',
                color: '#E7DED4',
                borderColor: '#4D4239'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4D4239'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3D3229'
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="px-6 py-4 shadow-sm" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E7DED4' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2"
                style={{ color: '#292522' }}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: '#292522' }}>Admin Panel</h2>
                <p className="text-sm" style={{ color: '#756E68' }}>Manage your café</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/admin/enquiries">
                <Button variant="ghost" size="sm" className="relative p-2" style={{ color: '#756E68' }}>
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-bold flex items-center justify-center"
                      style={{ 
                        backgroundColor: '#B94A48',
                        color: 'white',
                        minWidth: '20px'
                      }}
                    >
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full flex items-center justify-center border-2" style={{ backgroundColor: '#F7F4EF', borderColor: '#B68A52' }}>
                  <User className="h-4 w-4" style={{ color: '#7A4E2D' }} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold" style={{ color: '#292522' }}>Admin</p>
                  <p className="text-xs" style={{ color: '#756E68' }}>Manager</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
