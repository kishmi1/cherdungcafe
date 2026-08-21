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

interface StructuredDataProps {
  offers: Offer[]
  cafeName?: string
  cafeUrl?: string
}

export function OfferStructuredData({ offers, cafeName = "Cherdung Cafe", cafeUrl = "https://cherdungcafe.com" }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": offers.map((offer, index) => ({
      "@type": "Offer",
      "position": index + 1,
      "name": offer.title,
      "description": offer.description,
      "image": offer.image,
      "url": `${cafeUrl}/offers`,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date(offer.startsAt).toISOString(),
      "validThrough": new Date(offer.endsAt).toISOString(),
      ...(offer.promoCode && { "coupon": offer.promoCode }),
      ...(offer.discount && { 
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": offer.discount,
          "priceCurrency": "USD"
        }
      }),
      "seller": {
        "@type": "Organization",
        "name": cafeName,
        "url": cafeUrl
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
