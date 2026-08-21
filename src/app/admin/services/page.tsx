"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Coffee, 
  Utensils, 
  Package, 
  Calendar, 
  Star,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Service {
  id: number
  title: string
  description: string
  icon: string
  image?: string
  priceNote?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const iconOptions = [
  { value: 'coffee', icon: Coffee, label: 'Coffee' },
  { value: 'utensils', icon: Utensils, label: 'Dining' },
  { value: 'package', icon: Package, label: 'Takeaway' },
  { value: 'calendar', icon: Calendar, label: 'Events' },
  { value: 'star', icon: Star, label: 'Premium' },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'coffee',
    image: '',
    priceNote: '',
    sortOrder: 0,
    isActive: true
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingService 
        ? `/api/services/${editingService.id}`
        : '/api/services'
      
      const method = editingService ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchServices()
        setShowAddModal(false)
        setEditingService(null)
        setFormData({
          title: '',
          description: '',
          icon: 'coffee',
          image: '',
          priceNote: '',
          sortOrder: 0,
          isActive: true
        })
      }
    } catch (error) {
      console.error('Error saving service:', error)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      image: service.image || '',
      priceNote: service.priceNote || '',
      sortOrder: service.sortOrder,
      isActive: service.isActive
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchServices()
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleToggleActive = async (service: Service) => {
    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, isActive: !service.isActive })
      })

      if (response.ok) {
        fetchServices()
      }
    } catch (error) {
      console.error('Error toggling service:', error)
    }
  }

  const handleReorder = async (serviceId: number, direction: 'up' | 'down') => {
    const currentIndex = services.findIndex(s => s.id === serviceId)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex < 0 || newIndex >= services.length) return

    const updatedServices = [...services]
    const temp = updatedServices[currentIndex].sortOrder
    updatedServices[currentIndex].sortOrder = updatedServices[newIndex].sortOrder
    updatedServices[newIndex].sortOrder = temp

    try {
      await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: updatedServices[currentIndex].sortOrder })
      })

      await fetch(`/api/services/${updatedServices[newIndex].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: updatedServices[newIndex].sortOrder })
      })

      fetchServices()
    } catch (error) {
      console.error('Error reordering services:', error)
    }
  }

  const getIconComponent = (iconName: string) => {
    const icon = iconOptions.find(opt => opt.value === iconName)
    return icon ? icon.icon : Coffee
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p style={{ color: '#756E68' }}>Loading services...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#292522' }}>Services Management</h1>
          <p className="text-sm" style={{ color: '#756E68' }}>Manage café services displayed on the website</p>
        </div>
        <Button
          onClick={() => {
            setEditingService(null)
            setFormData({
              title: '',
              description: '',
              icon: 'coffee',
              image: '',
              priceNote: '',
              sortOrder: services.length,
              isActive: true
            })
            setShowAddModal(true)
          }}
          style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-4">
        {services.map((service, index) => {
          const IconComponent = getIconComponent(service.icon)
          return (
            <Card key={service.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F7F4EF', border: '1px solid #E7DED4' }}>
                    <IconComponent className="h-6 w-6" style={{ color: '#7A4E2D' }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold" style={{ color: '#292522' }}>{service.title}</h3>
                      {!service.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E7DED4', color: '#756E68' }}>
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-2" style={{ color: '#756E68' }}>{service.description}</p>
                    {service.priceNote && (
                      <p className="text-xs font-medium" style={{ color: '#7A4E2D' }}>{service.priceNote}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReorder(service.id, 'up')}
                      disabled={index === 0}
                      className="p-1"
                      style={{ color: '#756E68' }}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReorder(service.id, 'down')}
                      disabled={index === services.length - 1}
                      className="p-1"
                      style={{ color: '#756E68' }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(service)}
                      className="p-1"
                      style={{ color: service.isActive ? '#756E68' : '#7A4E2D' }}
                    >
                      {service.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      className="p-1"
                      style={{ color: '#756E68' }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      className="p-1"
                      style={{ color: '#B94A48' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {services.length === 0 && (
          <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardContent className="p-8 text-center">
              <Coffee className="h-12 w-12 mx-auto mb-4" style={{ color: '#E7DED4' }} />
              <p style={{ color: '#756E68' }}>No services yet. Click "Add Service" to create your first service.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#292522' }}>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                    Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Dine-in Service"
                    required
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this service..."
                    required
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border resize-none"
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((option) => {
                      const IconComponent = option.icon
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: option.value })}
                          className="p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all"
                          style={{
                            borderColor: formData.icon === option.value ? '#7A4E2D' : '#E7DED4',
                            backgroundColor: formData.icon === option.value ? '#F7F4EF' : '#FFFFFF'
                          }}
                        >
                          <IconComponent className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                          <span className="text-xs" style={{ color: '#756E68' }}>{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                    Image URL (optional)
                  </label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                    Price Note (optional)
                  </label>
                  <Input
                    value={formData.priceNote}
                    onChange={(e) => setFormData({ ...formData, priceNote: e.target.value })}
                    placeholder="e.g., Starting from $5"
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm" style={{ color: '#292522' }}>
                    Visible on website
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingService(null)
                    }}
                    className="flex-1"
                    style={{ borderColor: '#E7DED4', color: '#756E68' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
                  >
                    {editingService ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}