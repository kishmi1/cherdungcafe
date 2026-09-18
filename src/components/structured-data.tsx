interface StructuredDataProps {
  data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// LocalBusiness / Restaurant schema
export function LocalBusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Cherdung Café",
    "image": "https://cherdungcafe.vercel.app/logo.png",
    "description": "Cherdung Café in Sankhamul, Kathmandu — enjoy coffee, delicious food, fresh meals, offers, and a warm place to dine, relax and connect.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sankhamul",
      "addressRegion": "Kathmandu",
      "addressCountry": "NP"
    },
    "url": "https://cherdungcafe.vercel.app",
    "servesCuisine": "Coffee, Bakery, Cafe Food, Nepali Food",
    "priceRange": "$$"
  }

  return <StructuredData data={data} />
}

// BlogPosting schema
export function BlogPostingSchema({
  title,
  description,
  author,
  datePublished,
  dateModified,
  url,
  imageUrl
}: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  url: string
  imageUrl?: string
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "url": url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    ...(imageUrl && { "image": imageUrl })
  }

  return <StructuredData data={data} />
}

// Offer schema
export function OfferSchema({
  name,
  description,
  price,
  priceCurrency,
  availability,
  validFrom,
  validThrough,
  url
}: {
  name: string
  description: string
  price?: string
  priceCurrency?: string
  availability?: string
  validFrom: string
  validThrough: string
  url: string
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": name,
    "description": description,
    ...(price && { "price": price }),
    ...(priceCurrency && { "priceCurrency": priceCurrency }),
    ...(availability && { "availability": availability }),
    "validFrom": validFrom,
    "validThrough": validThrough,
    "url": url
  }

  return <StructuredData data={data} />
}

// FAQPage schema
export function FAQPageSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return <StructuredData data={data} />
}

// BreadcrumbList schema
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; item: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  }

  return <StructuredData data={data} />
}

// Organization schema
export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cherdung Café",
    "url": "https://cherdungcafe.vercel.app",
    "logo": "https://cherdungcafe.vercel.app/logo.png",
    "description": "Cherdung Café in Sankhamul, Kathmandu — enjoy coffee, delicious food, fresh meals, offers, and a warm place to dine, relax and connect."
  }

  return <StructuredData data={data} />
}

// WebSite schema
export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cherdung Café",
    "url": "https://cherdungcafe.vercel.app",
    "description": "Cherdung Café in Sankhamul, Kathmandu — enjoy coffee, delicious food, fresh meals, offers, and a warm place to dine, relax and connect."
  }

  return <StructuredData data={data} />
}