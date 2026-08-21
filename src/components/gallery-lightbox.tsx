"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface Image {
  id: number
  url: string
  caption?: string | null
  category?: string | null
}

interface GalleryLightboxProps {
  images: Image[]
  currentIndex: number
  onClose: () => void
}

export default function GalleryLightbox({ images, currentIndex, onClose }: GalleryLightboxProps) {
  const [currentIndexState, setCurrentIndex] = useState(currentIndex)

  const currentImage = images[currentIndexState]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
      >
        <X className="h-8 w-8" />
      </button>

      <button
        onClick={goToPrevious}
        className="absolute left-4 text-white hover:text-gray-300 transition-colors"
      >
        <ChevronLeft className="h-12 w-12" />
      </button>

      <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
        <img
          src={currentImage.url}
          alt={currentImage.caption || 'Gallery image'}
          className="max-w-full max-h-[80vh] object-contain"
        />
        {currentImage.caption && (
          <p className="text-white mt-4 text-center">{currentImage.caption}</p>
        )}
        {currentImage.category && (
          <span className="text-amber-400 text-sm mt-2">{currentImage.category}</span>
        )}
      </div>

      <button
        onClick={goToNext}
        className="absolute right-4 text-white hover:text-gray-300 transition-colors"
      >
        <ChevronRight className="h-12 w-12" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
        {currentIndexState + 1} / {images.length}
      </div>
    </div>
  )
}