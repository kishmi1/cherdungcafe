"use client"

import { useState } from "react"
import GalleryLightbox from "@/components/gallery-lightbox"
import { Camera } from "lucide-react"

interface Image {
  id: number
  url: string
  caption?: string | null
  category?: string | null
}

interface GalleryContentProps {
  images: Image[]
}

const CATEGORIES = [
  "All",
  "Interior",
  "Food & Coffee",
  "Behind the Scenes",
  "Events",
  "Exterior"
]

export default function GalleryContent({ images }: GalleryContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Always show all predefined categories
  const availableCategories = CATEGORIES

  const filteredImages = selectedCategory === "All"
    ? images
    : images.filter(img => img.category === selectedCategory)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Gallery</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Take a visual tour of our cozy ambiance, delicious creations, and memorable moments
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={image.url}
                    alt={image.caption || 'Gallery image'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {image.category && (
                    <div className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                      {image.category}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      Click to view
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}