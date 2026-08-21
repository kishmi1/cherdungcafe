import { prisma } from "@/lib/prisma"
import GalleryContent from "./gallery-content"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Gallery - Cherdung Café",
  description: "Browse our photo gallery showcasing our cozy interior, delicious food, and memorable events at Cherdung Café.",
  openGraph: {
    title: "Our Gallery - Cherdung Café",
    description: "Take a visual tour of our cozy ambiance, delicious creations, and memorable moments.",
  },
}

interface Image {
  id: number
  url: string
  caption?: string | null
  category?: string | null
}

async function getGalleryImages() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    return images
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }
}

export default async function GalleryPage() {
  const serverImages = await getGalleryImages()

  // Fallback images if database is empty
  const fallbackImages: Image[] = [
    { id: 1, url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80", caption: "Cozy interior seating area", category: "Interior" },
    { id: 2, url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", caption: "Barista crafting specialty coffee", category: "Interior" },
    { id: 3, url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80", caption: "Fresh pastries display", category: "Food & Coffee" },
    { id: 4, url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", caption: "Private event setup", category: "Events" },
    { id: 5, url: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&q=80", caption: "Espresso machine close-up", category: "Behind the Scenes" },
    { id: 6, url: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&q=80", caption: "Artisan latte art", category: "Food & Coffee" },
    { id: 7, url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80", caption: "Outdoor seating area", category: "Exterior" },
    { id: 8, url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80", caption: "Signature specialty drinks", category: "Food & Coffee" },
  ]

  const images = serverImages.length > 0 ? serverImages : fallbackImages

  return <GalleryContent images={images} />
}