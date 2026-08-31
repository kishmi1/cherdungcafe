"use client"

import Link from "next/link"
import { Menu, X, Lock, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { Settings } from "@/lib/use-settings"
import { useCart } from "@/lib/cart-context"

interface NavigationProps {
  settings?: Settings
}

export default function Navigation({ settings }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const siteName = settings?.siteName || "CHERDUNG CAFE"
  const { getCartItemCount } = useCart()
  const cartItemCount = getCartItemCount()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/menu", label: "Menu" },
    { href: "/offers", label: "Offers" },
    { href: "/gallery", label: "Gallery" },
    { href: "/blog", label: "Blog", hasDropdown: true },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="bg-white dark:bg-black sticky top-0 z-50 transition-colors border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="text-black dark:text-white text-2xl font-bold tracking-wider">
            {siteName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="text-black dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm uppercase tracking-wider"
                >
                  {item.label}
                  {item.hasDropdown && <span className="ml-1">▾</span>}
                </Link>
              </div>
            ))}
            
            {/* Enquiry Button */}
            <Link 
              href="/enquiry"
              className="px-4 py-2 bg-amber-100 text-black text-sm uppercase tracking-wider hover:bg-amber-200 transition-colors"
            >
              Enquiry
            </Link>
            
            {/* Cart Icon */}
            <Link href="/cart" className="text-black dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors relative" aria-label="Shopping Cart">
              <span className="flex items-center">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </span>
            </Link>

            {/* Admin Login */}
            <Link href="/login" className="text-black dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors" aria-label="Admin">
              <span className="flex items-center">
                <Lock className="h-5 w-5" />
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black dark:text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-black dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
                {item.hasDropdown && <span className="ml-1">▾</span>}
              </Link>
            ))}
            <Link 
              href="/enquiry"
              className="block text-center px-4 py-2 bg-amber-100 text-black text-sm uppercase tracking-wider hover:bg-amber-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Enquiry
            </Link>
            <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Link href="/cart" className="text-black dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors relative" aria-label="Shopping Cart">
                <span className="flex items-center">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </span>
              </Link>
              <Link href="/login" className="text-black dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors" aria-label="Admin">
                <span className="flex items-center">
                  <Lock className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
