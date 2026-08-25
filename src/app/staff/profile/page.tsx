"use client"

import { useState, useEffect } from "react"
import { User, Mail, Calendar, Shield, Lock, LogOut, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

export default function StaffProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/staff/profile')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
        setEditName(data.name)
        setEditEmail(data.email)
      } else {
        setError('Failed to load profile data')
      }
    } catch (error) {
      setError('An error occurred while loading profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaveLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/staff/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail
        })
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data)
        setSuccess("Profile updated successfully!")
        setIsEditing(false)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update profile')
      }
    } catch (error) {
      setError('An error occurred while updating profile')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleLogout = () => {
    document.cookie = 'adminSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push("/admin/login")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="max-w-md">
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6" style={{ backgroundColor: '#F7F4EF' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#292522' }}>My Profile</h1>
        <p className="text-sm" style={{ color: '#756E68' }}>View and manage your account information</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', border: '1px solid #B94A48' }}>
          <p className="text-sm font-medium" style={{ color: '#B94A48' }}>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#D1FAE5', border: '1px solid #10B981' }}>
          <p className="text-sm font-medium" style={{ color: '#10B981' }}>{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <Card className="mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle style={{ color: '#292522' }}>Profile Information</CardTitle>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  style={{ borderColor: '#E7DED4', color: '#7A4E2D' }}
                >
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                      Name
                    </label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ borderColor: '#E7DED4' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                      Email
                    </label>
                    <Input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      style={{ borderColor: '#E7DED4' }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={saveLoading}
                      style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
                    >
                      {saveLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setEditName(userData?.name || '')
                        setEditEmail(userData?.email || '')
                      }}
                      style={{ borderColor: '#E7DED4', color: '#7A4E2D' }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full flex items-center justify-center border-2" style={{ backgroundColor: '#F7F4EF', borderColor: '#B68A52' }}>
                      <User className="h-8 w-8" style={{ color: '#7A4E2D' }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold" style={{ color: '#292522' }}>{userData?.name}</h3>
                      <p className="text-sm" style={{ color: '#756E68' }}>{userData?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid #E7DED4' }}>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#756E68' }}>Email</p>
                        <p className="font-medium" style={{ color: '#292522' }}>{userData?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#756E68' }}>Role</p>
                        <p className="font-medium" style={{ color: '#292522' }}>{userData?.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#756E68' }}>Member Since</p>
                        <p className="font-medium" style={{ color: '#292522' }}>{userData ? formatDate(userData.createdAt) : ''}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#292522' }}>Account Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F7F4EF' }}>
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#292522' }}>Password</p>
                      <p className="text-sm" style={{ color: '#756E68' }}>Last changed recently</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    style={{ borderColor: '#E7DED4', color: '#999' }}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#292522' }}>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/staff/dashboard')}
                style={{ borderColor: '#E7DED4', color: '#7A4E2D' }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
                style={{ borderColor: '#E7DED4', color: '#B94A48' }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#292522' }}>Role Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" style={{ color: '#7A4E2D' }} />
                  <span className="text-sm" style={{ color: '#756E68' }}>Current Role:</span>
                  <span className="font-medium" style={{ color: '#292522' }}>{userData?.role}</span>
                </div>
                <p className="text-xs mt-2" style={{ color: '#999' }}>
                  Role changes can only be made by administrators.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
