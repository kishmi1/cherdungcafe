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

// LocalBusiness / CafeOrCoffeeShop schema
export function LocalBusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": "Cherdung Café",
    "image": "https://cherdungcafe.com/og-image.jpg",
    "description": "Your neighborhood café serving specialty coffee, delicious food, and memorable experiences.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Coffee Street",
      "addressLocality": "City",
      "addressRegion": "State",
      "postalCode": "12345",
      "addressCountry": "US"
    },
    "telephone": "+1-555-123-4567",
    "email": "hello@cherdungcafe.com",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "21:00"
      }
    ],
    "priceRange": "$$",
    "servesCuisine": "Coffee, Bakery, Cafe Food",
    "url": "https://cherdungcafe.com"
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
    "url": "https://cherdungcafe.com",
    "logo": "https://cherdungcafe.com/logo.png",
    "sameAs": [
      "https://facebook.com/cherdungcafe",
      "https://instagram.com/cherdungcafe",
      "https://twitter.com/cherdungcafe"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "email": "hello@cherdungcafe.com"
    }
  }

  return <StructuredData data={data} />
}