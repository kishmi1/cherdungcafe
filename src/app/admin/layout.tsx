"use client"

import { useState, useEffect } from "react"
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Coffee,
  Utensils,
  Tag,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  Mail,
  Settings,
  Bell,
  User,
} from "lucide-react"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

import {
  subscribeToNotifications,
  resetNewEnquiryCount,
  initializeNotificationCount,
} from "@/lib/notifications"


const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    icon: Coffee,
    label: "Services",
    href: "/admin/services",
  },
  {
    icon: Utensils,
    label: "Menu",
    href: "/admin/menu",
  },
  {
    icon: Tag,
    label: "Offers",
    href: "/admin/offers",
  },
  {
    icon: ImageIcon,
    label: "Gallery",
    href: "/admin/gallery",
  },
  {
    icon: FileText,
    label: "Blog",
    href: "/admin/blog",
  },
  {
    icon: MessageSquare,
    label: "Enquiries",
    href: "/admin/enquiries",
  },
  {
    icon: Mail,
    label: "Messages",
    href: "/admin/messages",
  },
  {
    icon: User,
    label: "Staff",
    href: "/admin/staff",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/admin/settings",
  },
]


export default function AdminLayout({
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

  // Don't show sidebar and navbar for login page
  const isLoginPage = pathname === '/admin/login'

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

    if (pathname === "/admin/enquiries") {
      resetNewEnquiryCount()
    }

  }, [pathname])


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    // Clear session cookie
    document.cookie = 'adminSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push("/")
  }


  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#F7F4EF",
      }}
    >
      {!isLoginPage && (
        <>
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

            <Coffee
              className="h-6 w-6"
              style={{
                color: "#B68A52",
              }}
            />

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
                Admin Panel
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

            {sidebarItems.map((item) => {

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
          ${!isLoginPage ? 'lg:ml-64' : ''}
        `}
      >
        {!isLoginPage && (
        <>
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
                  Admin Panel
                </h2>

                <p
                  className="text-sm"
                  style={{
                    color: "#756E68",
                  }}
                >
                  Manage your café
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

              <Link href="/admin/enquiries">

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


              {/* Admin Profile */}

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
                    Admin
                  </p>

                  <p
                    className="text-xs"
                    style={{
                      color: "#756E68",
                    }}
                  >
                    Manager
                  </p>

                </div>

              </div>

            </div>

          </div>

        </header>
        </>
        )}


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main
          className={`
            min-h-[calc(100vh-73px)]
            ${isLoginPage ? 'min-h-screen' : ''}
          `}
        >
          {children}
        </main>

      </div>

      </>
      )}

    </div>
  )
}
