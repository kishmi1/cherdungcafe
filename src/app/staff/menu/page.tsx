"use client"

import { useState, useEffect, useRef } from "react"
import { Utensils, Plus, Edit, Trash2, X, Image as ImageIcon, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MenuItem {
  id: number
  title: string
  description?: string
  image?: string
  price: string
  category?: string
  isPopular: boolean
  isAvailable: boolean
  sortOrder: number
}

const MENU_CATEGORIES = [
  "Coffee",
  "Cold Coffee",
  "Tea",
  "Milkshakes",
  "Smoothies",
  "Fresh Juices",
  "Mocktails",
  "Breakfast",
  "Snacks",
  "Momo",
  "Sandwiches",
  "Burgers",
  "Pizza",
  "Pasta",
  "Main Course",
  "Salads",
  "Desserts",
  "Cakes",
  "Bakery",
]

const emptyForm = (sortOrder = 0) => ({
  title: "",
  description: "",
  image: "",
  price: "",
  category: "",
  isPopular: false,
  isAvailable: true,
  sortOrder,
})

export default function StaffMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState(emptyForm())
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/staff/menu')
      const data = await response.json()
      setMenuItems(data.menuItems || [])
    } catch (error) {
      console.error('Failed to fetch menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.")
      event.target.value = ""
      return
    }

    setIsUploading(true)

    try {
      const uploadData = new FormData()
      uploadData.append("file", file)
      uploadData.append("folder", "menu")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image")
      }

      setFormData((current) => ({
        ...current,
        image: data.url,
      }))
    } catch (error) {
      console.error("Error uploading menu image:", error)
      alert(error instanceof Error ? error.message : "Failed to upload menu image")
    } finally {
      setIsUploading(false)
      if (event.target) {
        event.target.value = ""
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData(emptyForm(menuItems.length))
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch(
        editingItem ? `/api/staff/menu/${editingItem.id}` : "/api/staff/menu",
        {
          method: editingItem ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to save menu item")
        return
      }

      await fetchMenu()
      closeForm()
    } catch (error) {
      console.error("Error saving menu item:", error)
      alert("Failed to save menu item")
    }
  }

  const handleEdit = (menuItem: MenuItem) => {
    setEditingItem(menuItem)
    setFormData({
      title: menuItem.title,
      description: menuItem.description || "",
      image: menuItem.image || "",
      price: menuItem.price,
      category: menuItem.category || "",
      isPopular: menuItem.isPopular,
      isAvailable: menuItem.isAvailable,
      sortOrder: menuItem.sortOrder,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this menu item?")) {
      return
    }

    try {
      const response = await fetch(`/api/staff/menu/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete menu item")
      }

      await fetchMenu()
    } catch (error) {
      console.error("Error deleting menu item:", error)
      alert("Failed to delete menu item")
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#292522' }}>Menu Management</h1>
          <p className="text-sm" style={{ color: '#756E68' }}>Add, edit, delete, and view menu items</p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null)
            setFormData(emptyForm(menuItems.length))
            setShowForm(true)
          }}
          style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle style={{ color: '#292522' }}>
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeForm}
                style={{ color: '#756E68' }}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#292522' }}>
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Enter menu item title"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#292522' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#292522' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description"
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#292522' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#292522' }}>
                    Price *
                  </label>
                  <Input
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="Enter price"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#292522' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#292522' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#292522' }}
                  >
                    <option value="">Select category</option>
                    {MENU_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#292522' }}>
                    Image
                  </label>
                  
                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: '#E7DED4', backgroundColor: '#F7F4EF' }}>
                    {formData.image ? (
                      <div className="space-y-3">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="mx-auto h-48 w-48 object-cover rounded-md"
                        />
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isUploading}
                            onClick={triggerFileInput}
                            style={{ borderColor: '#E7DED4', color: '#7A4E2D' }}
                          >
                            {isUploading ? (
                              "Uploading..."
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Change Image
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData({ ...formData, image: '' })}
                            style={{ borderColor: '#E7DED4', color: '#dc2626' }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E7DED4' }}>
                          <ImageIcon className="h-8 w-8" style={{ color: '#B68A52' }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#292522' }}>
                            Upload menu item image
                          </p>
                          <p className="text-xs" style={{ color: '#756E68' }}>
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          disabled={isUploading}
                          onClick={triggerFileInput}
                          style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
                        >
                          {isUploading ? (
                            "Uploading..."
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </>
                          )}
                        </Button>
                        <div className="text-xs" style={{ color: '#756E68' }}>
                          Or enter URL below
                        </div>
                        <Input
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#292522' }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Hidden file input */}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm" style={{ color: '#292522' }}>Popular Item</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm" style={{ color: '#292522' }}>Available</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#292522' }}>
                    Sort Order
                  </label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4', color: '#292522' }}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeForm}
                    style={{ borderColor: '#E7DED4', color: '#7A4E2D' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
                  >
                    {editingItem ? 'Update' : 'Add'} Menu Item
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Menu Items */}
      <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardHeader>
          <CardTitle style={{ color: '#292522' }}>Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12" style={{ color: '#756E68' }}>
              Loading menu...
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#756E68' }}>
              <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No menu items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="rounded-lg border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7DED4' }}>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center" style={{ backgroundColor: '#F7F4EF' }}>
                      <ImageIcon className="h-12 w-12" style={{ color: '#B68A52' }} />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold truncate" style={{ color: '#292522' }}>{item.title}</h3>
                      {item.isPopular && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#B68A52', color: '#FFFFFF' }}>
                          Popular
                        </span>
                      )}
                    </div>
                    {item.category && (
                      <p className="text-xs mb-2" style={{ color: '#756E68' }}>{item.category}</p>
                    )}
                    {item.description && (
                      <p className="text-sm mb-3 line-clamp-2" style={{ color: '#756E68' }}>{item.description}</p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold whitespace-nowrap" style={{ color: '#7A4E2D' }}>
                        {item.price}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        style={{ borderColor: '#E7DED4', color: '#7A4E2D' }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        style={{ borderColor: '#E7DED4', color: '#dc2626' }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}