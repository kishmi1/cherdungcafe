"use client"

import { useState, useEffect } from "react"
import { 
  Tag, 
  Star, 
  Calendar, 
  Percent, 
  Ticket,
  Clock,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OfferStructuredData } from "@/components/StructuredData"

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
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'featured'>('all')

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers')
      const data = await response.json()
      setOffers(data)
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOffers = offers.filter(offer => 
    filter === 'all' ? true : offer.isFeatured
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`
    return 'Ending soon'
  }

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#F7F4EF' }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ color: '#756E68' }}>Loading offers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F4EF' }}>
      {/* Hero Section */}
      <div className="py-16 px-6" style={{ backgroundColor: '#292522' }}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Special Offers & Promotions
          </h1>
          <p className="text-lg mb-8" style={{ color: '#E7DED4' }}>
            Discover amazing deals and exclusive promotions at Cherdung Cafe
          </p>
          
          {/* Filter Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
              style={{
                backgroundColor: filter === 'all' ? '#7A4E2D' : 'transparent',
                color: filter === 'all' ? '#FFFFFF' : '#E7DED4',
                borderColor: '#E7DED4'
              }}
            >
              All Offers
            </Button>
            <Button
              onClick={() => setFilter('featured')}
              variant={filter === 'featured' ? 'default' : 'outline'}
              style={{
                backgroundColor: filter === 'featured' ? '#7A4E2D' : 'transparent',
                color: filter === 'featured' ? '#FFFFFF' : '#E7DED4',
                borderColor: '#E7DED4'
              }}
            >
              <Star className="h-4 w-4 mr-2" />
              Featured Only
            </Button>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <Card 
                key={offer.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}
              >
                {offer.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={offer.image} 
                      alt={offer.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold" style={{ color: '#292522' }}>
                      {offer.title}
                    </h3>
                    {offer.isFeatured && (
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className="mb-4" style={{ color: '#756E68' }}>
                    {offer.description}
                  </p>
                  
                  {offer.discount && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: '#F7F4EF' }}>
                      <Percent className="h-4 w-4" style={{ color: '#7A4E2D' }} />
                      <span className="font-semibold" style={{ color: '#7A4E2D' }}>
                        {offer.discount}
                      </span>
                    </div>
                  )}
                  
                  {offer.promoCode && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 p-2 rounded border-2 border-dashed" style={{ borderColor: '#7A4E2D', backgroundColor: '#FFFBF0' }}>
                        <Ticket className="h-4 w-4" style={{ color: '#7A4E2D' }} />
                        <code className="flex-1 font-mono font-bold" style={{ color: '#7A4E2D' }}>
                          {offer.promoCode}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyPromoCode(offer.promoCode!)}
                          className="h-8 px-2"
                          style={{ color: '#7A4E2D' }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2 mb-4 text-sm" style={{ color: '#756E68' }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(offer.startsAt)} - {formatDate(offer.endsAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium" style={{ color: '#7A4E2D' }}>
                        {getTimeRemaining(offer.endsAt)}
                      </span>
                    </div>
                  </div>
                  
                  {offer.terms && (
                    <div className="pt-4 border-t text-xs" style={{ borderColor: '#E7DED4', color: '#756E68' }}>
                      <strong>Terms:</strong> {offer.terms}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardContent>
              <Tag className="h-16 w-16 mx-auto mb-4" style={{ color: '#E7DED4' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#292522' }}>
                No Active Offers
              </h3>
              <p style={{ color: '#756E68' }}>
                {filter === 'featured' 
                  ? 'No featured offers at the moment. Check back later!' 
                  : 'Check back soon for amazing deals and promotions!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Structured Data for SEO */}
      <OfferStructuredData offers={filteredOffers} />
    </div>
  )
}
