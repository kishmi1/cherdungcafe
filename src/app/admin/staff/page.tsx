"use client"

import { useState, useEffect } from "react"
import { User, Mail, Plus, Edit, Trash2, Lock, Unlock, X, Eye, EyeOff, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface StaffUser {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  position: string | null
  profileImage: string | null
  joiningDate: string | null
  status: string
  permissions: string[]
  createdAt: string
}

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null)
  
  // Add form state
  const [addName, setAddName] = useState("")
  const [addEmail, setAddEmail] = useState("")
  const [addPhone, setAddPhone] = useState("")
  const [addPassword, setAddPassword] = useState("")
  const [addConfirmPassword, setAddConfirmPassword] = useState("")
  const [addPosition, setAddPosition] = useState("")
  const [addJoiningDate, setAddJoiningDate] = useState("")
  const [addStatus, setAddStatus] = useState("ACTIVE")
  const [addPermissions, setAddPermissions] = useState<string[]>([])
  const [addProfileImage, setAddProfileImage] = useState<File | null>(null)
  const [addProfileImagePreview, setAddProfileImagePreview] = useState<string | null>(null)
  const [showAddPassword, setShowAddPassword] = useState(false)
  const [addError, setAddError] = useState("")
  const [addLoading, setAddLoading] = useState(false)

  // Edit form state
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editPosition, setEditPosition] = useState("")
  const [editJoiningDate, setEditJoiningDate] = useState("")
  const [editStatus, setEditStatus] = useState("")
  const [editPermissions, setEditPermissions] = useState<string[]>([])
  const [editProfileImage, setEditProfileImage] = useState<File | null>(null)
  const [editProfileImagePreview, setEditProfileImagePreview] = useState<string | null>(null)
  const [editError, setEditError] = useState("")
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleAddImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAddProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAddProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const togglePermission = (permission: string, isAdd: boolean) => {
    if (isAdd) {
      setAddPermissions([...addPermissions, permission])
    } else {
      setAddPermissions(addPermissions.filter(p => p !== permission))
    }
  }

  const toggleEditPermission = (permission: string) => {
    if (editPermissions.includes(permission)) {
      setEditPermissions(editPermissions.filter(p => p !== permission))
    } else {
      setEditPermissions([...editPermissions, permission])
    }
  }

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/admin/staff')
      if (response.ok) {
        const data = await response.json()
        setStaff(data)
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError("")
    setAddLoading(true)

    // Validation
    if (!addName || !addEmail || !addPassword || !addPosition) {
      setAddError("Name, email, password, and position are required")
      setAddLoading(false)
      return
    }

    if (addPassword !== addConfirmPassword) {
      setAddError("Passwords do not match")
      setAddLoading(false)
      return
    }

    if (addPassword.length < 6) {
      setAddError("Password must be at least 6 characters")
      setAddLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(addEmail)) {
      setAddError("Invalid email format")
      setAddLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', addName)
      formData.append('email', addEmail)
      formData.append('password', addPassword)
      formData.append('phone', addPhone)
      formData.append('position', addPosition)
      formData.append('joiningDate', addJoiningDate)
      formData.append('status', addStatus)
      formData.append('permissions', JSON.stringify(addPermissions))
      
      if (addProfileImage) {
        formData.append('profileImage', addProfileImage)
      }

      const response = await fetch('/api/admin/staff', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setStaff([...staff, data])
        setShowAddForm(false)
        setAddName("")
        setAddEmail("")
        setAddPhone("")
        setAddPassword("")
        setAddConfirmPassword("")
        setAddPosition("")
        setAddJoiningDate("")
        setAddStatus("ACTIVE")
        setAddPermissions([])
        setAddProfileImage(null)
        setAddProfileImagePreview(null)
      } else {
        const errorMessage = data.details ? `${data.error}: ${data.details}` : data.error || 'Failed to add staff'
        setAddError(errorMessage)
      }
    } catch (error) {
      setAddError('An error occurred while adding staff')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError("")
    setEditLoading(true)

    if (!editName || !editEmail) {
      setEditError("Name and email are required")
      setEditLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editEmail)) {
      setEditError("Invalid email format")
      setEditLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', editName)
      formData.append('email', editEmail)
      formData.append('phone', editPhone)
      formData.append('position', editPosition)
      formData.append('joiningDate', editJoiningDate)
      formData.append('status', editStatus)
      formData.append('permissions', JSON.stringify(editPermissions))
      
      if (editProfileImage) {
        formData.append('profileImage', editProfileImage)
      }

      const response = await fetch(`/api/admin/staff/${selectedStaff?.id}`, {
        method: 'PATCH',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setStaff(staff.map(s => s.id === selectedStaff?.id ? data : s))
        setShowEditForm(false)
        setSelectedStaff(null)
        setEditProfileImage(null)
        setEditProfileImagePreview(null)
      } else {
        setEditError(data.error || 'Failed to update staff')
      }
    } catch (error) {
      setEditError('An error occurred while updating staff')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteStaff = async (id: number) => {
    if (!confirm('Are you sure you want to delete this staff member?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/staff/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setStaff(staff.filter(s => s.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete staff:', error)
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    
    try {
      const response = await fetch(`/api/admin/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setStaff(staff.map(s => s.id === id ? { ...s, status: newStatus } : s))
      }
    } catch (error) {
      console.error('Failed to toggle staff status:', error)
    }
  }

  const openEditForm = (staffMember: StaffUser) => {
    setSelectedStaff(staffMember)
    setEditName(staffMember.name)
    setEditEmail(staffMember.email)
    setEditPhone(staffMember.phone || "")
    setEditPosition(staffMember.position || "")
    setEditJoiningDate(staffMember.joiningDate ? new Date(staffMember.joiningDate).toISOString().split('T')[0] : "")
    setEditStatus(staffMember.status)
    setEditPermissions(staffMember.permissions || [])
    setEditProfileImagePreview(staffMember.profileImage)
    setShowEditForm(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6" style={{ backgroundColor: '#F7F4EF' }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#292522' }}>Staff Management</h1>
          <p className="text-sm" style={{ color: '#756E68' }}>Manage staff accounts and permissions</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Staff List */}
      <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardHeader>
          <CardTitle style={{ color: '#292522' }}>
            Staff Members ({staff.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#756E68' }}>
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No staff members yet</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowAddForm(true)}
                style={{ borderColor: '#E7DED4', color: '#7A4E2D' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Staff Member
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {staff.map((staffMember) => (
                <div
                  key={staffMember.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ backgroundColor: '#F7F4EF', borderColor: '#E7DED4' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center border-2 overflow-hidden" style={{ backgroundColor: '#F7F4EF', borderColor: '#B68A52' }}>
                      {staffMember.profileImage ? (
                        <img 
                          src={staffMember.profileImage} 
                          alt={staffMember.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: '#292522' }}>{staffMember.name}</h3>
                      <p className="text-sm" style={{ color: '#756E68' }}>{staffMember.email}</p>
                      {staffMember.phone && (
                        <p className="text-xs flex items-center gap-1" style={{ color: '#756E68' }}>
                          <Phone className="h-3 w-3" />
                          {staffMember.phone}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E7DED4', color: '#7A4E2D' }}>
                          {staffMember.position || 'Not assigned'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                          backgroundColor: staffMember.status === 'ACTIVE' ? '#D1FAE5' : '#FEE2E2',
                          color: staffMember.status === 'ACTIVE' ? '#065F46' : '#991B1B'
                        }}>
                          {staffMember.status}
                        </span>
                        <span className="text-xs" style={{ color: '#999' }}>
                          Joined {staffMember.joiningDate ? formatDate(staffMember.joiningDate) : formatDate(staffMember.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert(`Staff Details:\nName: ${staffMember.name}\nEmail: ${staffMember.email}\nPhone: ${staffMember.phone || 'N/A'}\nPosition: ${staffMember.position || 'N/A'}\nStatus: ${staffMember.status}\nPermissions: ${staffMember.permissions.join(', ') || 'None'}`)
                      }}
                      style={{ borderColor: '#E7DED4', color: '#7A4E2D' }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditForm(staffMember)}
                      style={{ borderColor: '#E7DED4', color: '#7A4E2D' }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(staffMember.id, staffMember.status)}
                      style={{ borderColor: '#E7DED4', color: '#7A4E2D' }}
                    >
                      {staffMember.status === 'ACTIVE' ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteStaff(staffMember.id)}
                      style={{ borderColor: '#E7DED4', color: '#dc2626' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Staff Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: '#292522' }}>Add New Staff</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false)
                    setAddError("")
                    setAddName("")
                    setAddEmail("")
                    setAddPhone("")
                    setAddPassword("")
                    setAddConfirmPassword("")
                    setAddPosition("")
                    setAddJoiningDate("")
                    setAddStatus("ACTIVE")
                    setAddPermissions([])
                    setAddProfileImage(null)
                    setAddProfileImagePreview(null)
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {addError && (
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', border: '1px solid #B94A48' }}>
                  <p className="text-sm" style={{ color: '#B94A48' }}>{addError}</p>
                </div>
              )}

              <form onSubmit={handleAddStaff} className="space-y-4">
                {/* Personal Information */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Full Name *
                  </label>
                  <Input
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="John Doe"
                    style={{ borderColor: '#E7DED4' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="john@cherdungcafe.com"
                    style={{ borderColor: '#E7DED4' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Profile Image
                  </label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAddImageChange}
                      style={{ borderColor: '#E7DED4' }}
                    />
                    {addProfileImagePreview && (
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden border" style={{ borderColor: '#E7DED4' }}>
                        <img 
                          src={addProfileImagePreview} 
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAddProfileImage(null)
                            setAddProfileImagePreview(null)
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Information */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Position *
                  </label>
                  <select
                    value={addPosition}
                    onChange={(e) => setAddPosition(e.target.value)}
                    className="w-full px-3 py-2 rounded border"
                    style={{ borderColor: '#E7DED4', backgroundColor: '#FFFFFF' }}
                    required
                  >
                    <option value="">Select Position</option>
                    <option value="BARISTA">Barista</option>
                    <option value="WAITER">Waiter</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="KITCHEN_STAFF">Kitchen Staff</option>
                    <option value="SUPERVISOR">Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Joining Date
                  </label>
                  <Input
                    type="date"
                    value={addJoiningDate}
                    onChange={(e) => setAddJoiningDate(e.target.value)}
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Status
                  </label>
                  <select
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded border"
                    style={{ borderColor: '#E7DED4', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                {/* Login Information */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showAddPassword ? "text" : "password"}
                      value={addPassword}
                      onChange={(e) => setAddPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ borderColor: '#E7DED4' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddPassword(!showAddPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#756E68' }}
                    >
                      {showAddPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Confirm Password *
                  </label>
                  <Input
                    type="password"
                    value={addConfirmPassword}
                    onChange={(e) => setAddConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ borderColor: '#E7DED4' }}
                    required
                  />
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {['Enquiries', 'Orders', 'Menu', 'Reservations'].map((permission) => (
                      <label key={permission} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={addPermissions.includes(permission)}
                          onChange={(e) => togglePermission(permission, e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm" style={{ color: '#292522' }}>{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs mb-4" style={{ color: '#999' }}>
                    Role will be automatically set to STAFF
                  </p>
                  <Button
                    type="submit"
                    disabled={addLoading}
                    className="w-full"
                    style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
                  >
                    {addLoading ? 'Adding...' : 'Add Staff'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditForm && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: '#292522' }}>Edit Staff</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditForm(false)
                    setSelectedStaff(null)
                    setEditError("")
                    setEditProfileImage(null)
                    setEditProfileImagePreview(null)
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {editError && (
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', border: '1px solid #B94A48' }}>
                  <p className="text-sm" style={{ color: '#B94A48' }}>{editError}</p>
                </div>
              )}

              <form onSubmit={handleEditStaff} className="space-y-4">
                {/* Personal Information */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Full Name *
                  </label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ borderColor: '#E7DED4' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    style={{ borderColor: '#E7DED4' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Profile Image
                  </label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      style={{ borderColor: '#E7DED4' }}
                    />
                    {editProfileImagePreview && (
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden border" style={{ borderColor: '#E7DED4' }}>
                        <img 
                          src={editProfileImagePreview} 
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditProfileImage(null)
                            setEditProfileImagePreview(selectedStaff?.profileImage || null)
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Information */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Position *
                  </label>
                  <select
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    className="w-full px-3 py-2 rounded border"
                    style={{ borderColor: '#E7DED4', backgroundColor: '#FFFFFF' }}
                    required
                  >
                    <option value="">Select Position</option>
                    <option value="BARISTA">Barista</option>
                    <option value="WAITER">Waiter</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="KITCHEN_STAFF">Kitchen Staff</option>
                    <option value="SUPERVISOR">Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Joining Date
                  </label>
                  <Input
                    type="date"
                    value={editJoiningDate}
                    onChange={(e) => setEditJoiningDate(e.target.value)}
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded border"
                    style={{ borderColor: '#E7DED4', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#756E68' }}>
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {['Enquiries', 'Orders', 'Menu', 'Reservations'].map((permission) => (
                      <label key={permission} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editPermissions.includes(permission)}
                          onChange={() => toggleEditPermission(permission)}
                          className="rounded"
                        />
                        <span className="text-sm" style={{ color: '#292522' }}>{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs mb-4" style={{ color: '#999' }}>
                    Role: {selectedStaff.role} (cannot be changed)
                  </p>
                  <Button
                    type="submit"
                    disabled={editLoading}
                    className="w-full"
                    style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
                  >
                    {editLoading ? 'Updating...' : 'Update Staff'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
