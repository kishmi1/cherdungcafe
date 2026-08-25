"use client"

import { useState, useEffect } from "react"
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  MessageSquare,
  Mail,
  User,
  Bell,
  Utensils,
} from "lucide-react"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

import {
  subscribeToNotifications,
  resetNewEnquiryCount,
  initializeNotificationCount,
} from "@/lib/notifications"


const allSidebarItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/staff/dashboard",
  },
  {
    icon: Utensils,
    label: "Menu",
    href: "/staff/menu",
  },
  {
    icon: MessageSquare,
    label: "Enquiries",
    href: "/staff/enquiries",
  },
  {
    icon: Mail,
    label: "Messages",
    href: "/staff/messages",
  },
  {
    icon: User,
    label: "My Profile",
    href: "/staff/profile",
  },
]


export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const pathname = usePathname()

  const [sidebarOpen, setSidebarOpen] =
    useState(false)

  const [notificationCount, setNotificationCount] =
    useState(0)

  const [userData, setUserData] = useState<{ name: string; email: string; role: string; position?: string } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Get user data from staff session API
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/staff/session')
        if (response.ok) {
          const sessionData = await response.json()
          setUserData({
            name: sessionData.name,
            email: sessionData.email,
            role: sessionData.role,
            position: sessionData.position,
          })
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push('/login')
        }
      } catch (error) {
        console.error('Failed to fetch session data:', error)
        setIsAuthenticated(false)
        router.push('/login')
      }
    }

    fetchSession()
  }, [router])

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  useEffect(() => {

    initializeNotificationCount()

    const unsubscribe =
      subscribeToNotifications((count) => {
        setNotificationCount(count)
      })

    return unsubscribe

  }, [])


  /* =====================================================
     RESET ENQUIRY NOTIFICATION
  ===================================================== */

  useEffect(() => {

    if (pathname === "/staff/enquiries") {
      resetNewEnquiryCount()
    }

  }, [pathname])


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    // Clear staff session cookie
    document.cookie = 'staffSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push("/login")
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#F7F4EF",
      }}
    >
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            lg:hidden
          "
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}


      {/* =================================================
          FIXED SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-64
          transform
          transition-transform
          duration-300
          ease-in-out

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        style={{
          backgroundColor: "#2B211B",
        }}
      >

        <div
          className="
            flex
            h-full
            flex-col
          "
        >

          {/* =================================================
              LOGO
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-3
              border-b
              px-6
              py-5
            "
            style={{
              borderColor: "#3D3229",
            }}
          >

            <div
              className="h-6 w-6 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#B68A52",
              }}
            >
              <span className="text-white text-xs font-bold">C</span>
            </div>

            <div>

              <h1
                className="
                  text-lg
                  font-bold
                  text-white
                "
              >
                CHERDUNG CAFE
              </h1>

              <p
                className="text-xs"
                style={{
                  color: "#E7DED4",
                }}
              >
                Staff Panel
              </p>

            </div>

          </div>


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav
            className="
              flex-1
              space-y-1
              overflow-y-auto
              px-3
              py-6
            "
          >

            {allSidebarItems.map((item) => {

              const isActive =
                pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-4
                    py-3
                    font-medium
                    transition-all
                    duration-200
                  "
                  style={{
                    color: "#E7DED4",

                    backgroundColor:
                      isActive
                        ? "#7A4E2D"
                        : "transparent",
                  }}
                  onMouseEnter={(e) => {

                    if (!isActive) {
                      e.currentTarget.style.backgroundColor =
                        "#3D3229"
                    }

                  }}
                  onMouseLeave={(e) => {

                    if (!isActive) {
                      e.currentTarget.style.backgroundColor =
                        "transparent"
                    }

                  }}
                >

                  <item.icon className="h-5 w-5" />

                  <span>
                    {item.label}
                  </span>

                </Link>
              )
            })}

          </nav>


          {/* =================================================
              LOGOUT
          ================================================= */}

          <div
            className="
              border-t
              p-4
            "
            style={{
              borderColor: "#3D3229",
            }}
          >

            <Button
              onClick={handleLogout}
              variant="outline"
              className="
                flex
                w-full
                items-center
                gap-2
              "
              style={{
                backgroundColor: "#3D3229",
                color: "#E7DED4",
                borderColor: "#4D4239",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#4D4239"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#3D3229"
              }}
            >

              <LogOut className="h-4 w-4" />

              Logout

            </Button>

          </div>

        </div>

      </aside>


      {/* =================================================
          MAIN AREA
          ml-64 = sidebar width
      ================================================= */}

      <div
        className={`
          min-h-screen
          lg:ml-64
        `}
      >
        {/* =================================================
            TOP NAVBAR
        ================================================= */}

        <header
          className="
            sticky
            top-0
            z-30
            border-b
            px-6
            py-4
            shadow-sm
          "
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E7DED4",
          }}
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            {/* LEFT */}

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              {/* Mobile Menu */}

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSidebarOpen(
                    !sidebarOpen
                  )
                }
                className="
                  p-2
                  lg:hidden
                "
                style={{
                  color: "#292522",
                }}
              >

                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}

              </Button>


              <div>

                <h2
                  className="
                    text-lg
                    font-semibold
                  "
                  style={{
                    color: "#292522",
                  }}
                >
                  Staff Panel
                </h2>

                <p
                  className="text-sm"
                  style={{
                    color: "#756E68",
                  }}
                >
                  Manage enquiries and messages
                </p>

              </div>

            </div>


            {/* RIGHT */}

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              {/* Notification */}

              <Link href="/staff/enquiries">

                <Button
                  variant="ghost"
                  size="sm"
                  className="
                    relative
                    p-2
                  "
                  style={{
                    color: "#756E68",
                  }}
                >

                  <Bell className="h-5 w-5" />

                  {notificationCount > 0 && (

                    <span
                      className="
                        absolute
                        -right-1
                        -top-1
                        flex
                        h-5
                        min-w-[20px]
                        items-center
                        justify-center
                        rounded-full
                        text-xs
                        font-bold
                      "
                      style={{
                        backgroundColor:
                          "#B94A48",
                        color: "#FFFFFF",
                      }}
                    >
                      {notificationCount > 9
                        ? "9+"
                        : notificationCount}
                    </span>

                  )}

                </Button>

              </Link>


              {/* Staff Profile */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border-2
                  "
                  style={{
                    backgroundColor:
                      "#F7F4EF",
                    borderColor: "#B68A52",
                  }}
                >

                  <User
                    className="h-4 w-4"
                    style={{
                      color: "#7A4E2D",
                    }}
                  />

                </div>


                <div className="hidden sm:block">

                  <p
                    className="
                      text-sm
                      font-semibold
                    "
                    style={{
                      color: "#292522",
                    }}
                  >
                    {userData?.name || 'Staff'}
                  </p>

                  <p
                    className="text-xs"
                    style={{
                      color: "#756E68",
                    }}
                  >
                    {userData?.position || userData?.role || 'STAFF'}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main
          className="
            min-h-[calc(100vh-73px)]
          "
        >
          {children}
        </main>

      </div>

    </div>
  )
}
