"use client"

import { useState } from "react"
import { Lock, Eye, EyeOff, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Mock login for now - will be replaced with real authentication later
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Basic validation
      if (!email || !password) {
        setError('Please enter both email and password')
        setIsLoading(false)
        return
      }

      // Mock successful login
      if (email && password) {
        router.push('/admin/dashboard')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F7F4EF' }}>
      <div className="w-full max-w-md">
        {/* Back to Website */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 mb-8 font-medium transition-colors"
          style={{ color: '#756E68' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#7A4E2D'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#756E68'}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Website</span>
        </Link>

        {/* Login Card */}
        <div className="rounded-2xl shadow-lg p-8 md:p-10" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border-2" style={{ backgroundColor: '#F7F4EF', borderColor: '#B68A52' }}>
              <Lock className="h-8 w-8" style={{ color: '#7A4E2D' }} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#292522' }}>
              Admin Login
            </h1>
            <p className="text-sm" style={{ color: '#756E68' }}>
              Sign in to access the cafe management dashboard.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F7F4EF', border: '1px solid #B94A48' }}>
              <p className="text-sm font-medium" style={{ color: '#B94A48' }}>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: '#756E68' }} />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  style={{ borderColor: '#E7DED4' }}
                  placeholder="admin@cherdungcafe.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: '#756E68' }} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12"
                  style={{ borderColor: '#E7DED4' }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                  style={{ color: '#756E68' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#292522'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#756E68'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 block text-sm" style={{ color: '#292522' }}>
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm font-medium transition-colors" style={{ color: '#7A4E2D' }} onMouseEnter={(e) => e.currentTarget.style.color = '#613B22'} onMouseLeave={(e) => e.currentTarget.style.color = '#7A4E2D'}>
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border-0"
              style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
              size="lg"
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#613B22'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#7A4E2D'
              }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Brand Footer */}
          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: '#E7DED4' }}>
            <p className="text-sm font-semibold" style={{ color: '#292522' }}>
              CHERDUNG CAFE
            </p>
            <p className="text-xs mt-1" style={{ color: '#756E68' }}>
              Admin Management Portal
            </p>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: '#756E68' }}>
            Need help?{" "}
            <Link href="/contact" className="font-medium transition-colors" style={{ color: '#7A4E2D' }} onMouseEnter={(e) => e.currentTarget.style.color = '#613B22'} onMouseLeave={(e) => e.currentTarget.style.color = '#7A4E2D'}>
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}