"use client"

import { usePathname } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useSettings } from "@/lib/use-settings"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isStaffRoute = pathname?.startsWith('/staff')
  const isLoginRoute = pathname?.startsWith('/login')
  const { settings } = useSettings()

  if (isAdminRoute || isStaffRoute || isLoginRoute) {
    return <main className="flex-1">{children}</main>
  }

  return (
    <>
      <Navigation settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  )
}
