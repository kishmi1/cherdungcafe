"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  ChevronUp,
  ChevronDown,
  X,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface GalleryImage {
  id: number
  url: string
  caption?: string
  category?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const CATEGORIES = [
  "All",
  "Interior",
  "Food & Coffee",
  "Behind the Scenes",
  "Events",
  "Exterior"
]

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    url: '',
    caption: '',
    category: 'Interior',
    sortOrder: 0
  })

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery')
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'gallery')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, url: data.url })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingImage 
        ? `/api/gallery/${editingImage.id}`
        : '/api/gallery'
      
      const method = editingImage ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchImages()
        setShowAddModal(false)
        setEditingImage(null)
        setFormData({
          url: '',
          caption: '',
          category: 'Interior',
          sortOrder: images.length
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save image')
      }
    } catch (error) {
      console.error('Error saving image:', error)
      alert('Failed to save image')
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image)
    setFormData({
      url: image.url,
      caption: image.caption || '',
      category: image.category || 'Interior',
      sortOrder: image.sortOrder
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchImages()
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const handleReorder = async (imageId: number, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex < 0 || newIndex >= images.length) return

    const updatedImages = [...images]
    const temp = updatedImages[currentIndex].sortOrder
    updatedImages[currentIndex].sortOrder = updatedImages[newIndex].sortOrder
    updatedImages[newIndex].sortOrder = temp

    try {
      await fetch(`/api/gallery/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: updatedImages[currentIndex].sortOrder })
      })

      await fetch(`/api/gallery/${updatedImages[newIndex].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: updatedImages[newIndex].sortOrder })
      })

      fetchImages()
    } catch (error) {
      console.error('Error reordering images:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p style={{ color: '#756E68' }}>Loading gallery...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#292522' }}>Gallery Management</h1>
          <p className="text-sm" style={{ color: '#756E68' }}>Manage gallery images with categories</p>
        </div>
        <Button
          onClick={() => {
            setEditingImage(null)
            setFormData({
              url: '',
              caption: '',
              category: 'Interior',
              sortOrder: images.length
            })
            setShowAddModal(true)
          }}
          style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <Card key={image.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardContent className="p-4">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-3" style={{ backgroundColor: '#F7F4EF', border: '1px solid #E7DED4' }}>
                <img 
                  src={image.url} 
                  alt={image.caption || 'Gallery image'}
                  className="h-full w-full object-cover"
                />
                {image.category && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs text-white" style={{ backgroundColor: '#7A4E2D' }}>
                    {image.category}
                  </div>
                )}
              </div>
              
              {image.caption && (
                <p className="text-sm mb-2 line-clamp-2" style={{ color: '#756E68' }}>
                  {image.caption}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReorder(image.id, 'up')}
                    disabled={index === 0}
                    className="p-1"
                    style={{ color: '#756E68' }}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReorder(image.id, 'down')}
                    disabled={index === images.length - 1}
                    className="p-1"
                    style={{ color: '#756E68' }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(image)}
                    className="p-1"
                    style={{ color: '#756E68' }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    className="p-1"
                    style={{ color: '#B94A48' }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {images.length === 0 && (
          <Card className="col-span-full" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardContent className="p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-4" style={{ color: '#E7DED4' }} />
              <p style={{ color: '#756E68' }}>No images yet. Click "Add Image" to upload your first image.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-lg my-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#292522' }}>
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                    Image
                  </label>
                  <div className="space-y-2">
                    {formData.url && (
                      <div className="relative h-48 w-full rounded-lg overflow-hidden" style={{ border: '1px solid #E7DED4' }}>
                        <img 
                          src={formData.url} 
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({ ...formData, url: '' })}
                          className="absolute top-2 right-2 p-1 bg-white/90 rounded"
                          style={{ color: '#B94A48' }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="flex-1"
                        style={{ borderColor: '#E7DED4' }}
                      />
                      {isUploading && (
                        <span className="text-sm" style={{ color: '#756E68' }}>Uploading...</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                    Caption (optional)
                  </label>
                  <textarea
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    placeholder="Describe this image..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border resize-none"
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{ borderColor: '#E7DED4' }}
                  >
                    {CATEGORIES.filter(cat => cat !== 'All').map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                    Sort Order
                  </label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingImage(null)
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
                    {editingImage ? 'Update' : 'Create'}
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
