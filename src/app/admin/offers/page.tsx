"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Star,
  Calendar,
  Percent,
  Ticket,
  Image as ImageIcon,
  X,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Offer {
  id: number
  title: string
  description: string
  image?: string
  discount?: string
  promoCode?: string
  startsAt: string
  endsAt: string
  isFeatured: boolean
  terms?: string
  createdAt: string
  updatedAt: string
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    discount: '',
    promoCode: '',
    startsAt: '',
    endsAt: '',
    isFeatured: false,
    terms: ''
  })

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers?includeAll=true')
      const data = await response.json()
      setOffers(data)
    } catch (error) {
      console.error('Error fetching offers:', error)
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
      uploadFormData.append('folder', 'offers')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, image: data.url })
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
      const url = editingOffer 
        ? `/api/offers/${editingOffer.id}`
        : '/api/offers'
      
      const method = editingOffer ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchOffers()
        setShowAddModal(false)
        setEditingOffer(null)
        setFormData({
          title: '',
          description: '',
          image: '',
          discount: '',
          promoCode: '',
          startsAt: '',
          endsAt: '',
          isFeatured: false,
          terms: ''
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save offer')
      }
    } catch (error) {
      console.error('Error saving offer:', error)
      alert('Failed to save offer')
    }
  }

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description,
      image: offer.image || '',
      discount: offer.discount || '',
      promoCode: offer.promoCode || '',
      startsAt: new Date(offer.startsAt).toISOString().slice(0, 16),
      endsAt: new Date(offer.endsAt).toISOString().slice(0, 16),
      isFeatured: offer.isFeatured,
      terms: offer.terms || ''
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this offer?')) return

    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchOffers()
      }
    } catch (error) {
      console.error('Error deleting offer:', error)
    }
  }

  const handleToggleFeatured = async (offer: Offer) => {
    try {
      const response = await fetch(`/api/offers/${offer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...offer, isFeatured: !offer.isFeatured })
      })

      if (response.ok) {
        fetchOffers()
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
    }
  }

  const isOfferActive = (offer: Offer) => {
    const now = new Date()
    const startsAt = new Date(offer.startsAt)
    const endsAt = new Date(offer.endsAt)
    return now >= startsAt && now <= endsAt
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p style={{ color: '#756E68' }}>Loading offers...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#292522' }}>Offers & Promotions</h1>
          <p className="text-sm" style={{ color: '#756E68' }}>Manage special offers and promotions</p>
        </div>
        <Button
          onClick={() => {
            setEditingOffer(null)
            setFormData({
              title: '',
              description: '',
              image: '',
              discount: '',
              promoCode: '',
              startsAt: '',
              endsAt: '',
              isFeatured: false,
              terms: ''
            })
            setShowAddModal(true)
          }}
          style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Offer
        </Button>
      </div>

      <div className="grid gap-4">
        {offers.map((offer) => (
          <Card key={offer.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {offer.image && (
                  <div className="h-20 w-20 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: '#F7F4EF', border: '1px solid #E7DED4' }}>
                    <img 
                      src={offer.image} 
                      alt={offer.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold" style={{ color: '#292522' }}>{offer.title}</h3>
                    {offer.isFeatured && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isOfferActive(offer) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isOfferActive(offer) ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#756E68' }}>{offer.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs" style={{ color: '#756E68' }}>
                    {offer.discount && (
                      <span className="flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        {offer.discount}
                      </span>
                    )}
                    {offer.promoCode && (
                      <span className="flex items-center gap-1 font-mono bg-amber-50 px-2 py-0.5 rounded" style={{ color: '#7A4E2D' }}>
                        <Ticket className="h-3 w-3" />
                        {offer.promoCode}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(offer.startsAt)} - {formatDate(offer.endsAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFeatured(offer)}
                    className="p-1"
                    style={{ color: offer.isFeatured ? '#F59E0B' : '#756E68' }}
                    title={offer.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <Star className={`h-4 w-4 ${offer.isFeatured ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(offer)}
                    className="p-1"
                    style={{ color: '#756E68' }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(offer.id)}
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

        {offers.length === 0 && (
          <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardContent className="p-8 text-center">
              <Tag className="h-12 w-12 mx-auto mb-4" style={{ color: '#E7DED4' }} />
              <p style={{ color: '#756E68' }}>No offers yet. Click "Add Offer" to create your first promotion.</p>
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
                {editingOffer ? 'Edit Offer' : 'Add New Offer'}
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
                    placeholder="e.g., Weekend Coffee Deal"
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
                    placeholder="Describe this offer..."
                    required
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border resize-none"
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                    Image
                  </label>
                  <div className="space-y-2">
                    {formData.image && (
                      <div className="relative h-32 w-full rounded-lg overflow-hidden" style={{ border: '1px solid #E7DED4' }}>
                        <img 
                          src={formData.image} 
                          alt="Offer preview"
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({ ...formData, image: '' })}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                      Discount
                    </label>
                    <Input
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      placeholder="e.g., 20% OFF"
                      style={{ borderColor: '#E7DED4' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                      Promo Code (optional)
                    </label>
                    <Input
                      value={formData.promoCode}
                      onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                      placeholder="e.g., COFFEE20"
                      style={{ borderColor: '#E7DED4' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                      Start Date
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.startsAt}
                      onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                      required
                      style={{ borderColor: '#E7DED4' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                      End Date
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.endsAt}
                      onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                      required
                      style={{ borderColor: '#E7DED4' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                    Terms & Conditions (optional)
                  </label>
                  <textarea
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    placeholder="Any terms and conditions..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border resize-none"
                    style={{ borderColor: '#E7DED4' }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isFeatured" className="text-sm flex items-center gap-1" style={{ color: '#292522' }}>
                    <Star className="h-4 w-4" />
                    Featured offer (displayed prominently)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingOffer(null)
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
                    {editingOffer ? 'Update' : 'Create'}
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
