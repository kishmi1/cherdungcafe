"use client"

import { useState } from "react"
import GalleryLightbox from "@/components/gallery-lightbox"
import { Camera, ArrowDown } from "lucide-react"

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
  "Exterior",
]

export default function GalleryContent({
  images,
}: GalleryContentProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All")

  const [lightboxIndex, setLightboxIndex] =
    useState<number | null>(null)

  const availableCategories = CATEGORIES

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter(
          (img) => img.category === selectedCategory
        )

  return (
    <div className="min-h-screen bg-white">

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-[#F3F1ED] py-16 md:py-20">

        {/* Decorative Circle */}
        <div
          className="
            absolute
            -left-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-[#D19A5A]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-24
            -right-24
            h-72
            w-72
            rounded-full
            bg-[#7A4E2D]/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >

          <div className="text-center">

           

            {/* Heading */}
            <h1
              className="
                mb-4
                text-4xl
                font-light
                tracking-tight
                text-[#292522]
                md:text-5xl
                lg:text-6xl
              "
            >
              Our Gallery
            </h1>

            {/* Description */}
            <p
              className="
                mx-auto
                max-w-2xl
                text-base
                leading-relaxed
                text-[#756E68]
                md:text-lg
              "
            >
              Take a visual tour of our cozy ambiance,
              delicious creations, and memorable moments.
            </p>

            {/* Decorative Line */}
            <div className="mx-auto mt-7 flex items-center justify-center gap-3">

              <span className="h-px w-12 bg-[#D19A5A]" />

              <Camera className="h-4 w-4 text-[#B8784F]" />

              <span className="h-px w-12 bg-[#D19A5A]" />

            </div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* CATEGORY FILTER */}
      {/* ========================================================= */}

      <section
        className="
          border-b
          border-[#E8E1DA]
          bg-white
          py-7
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >

          <div className="flex flex-wrap justify-center gap-2.5">

            {availableCategories.map((category) => {

              const isActive =
                selectedCategory === category

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category)
                    setLightboxIndex(null)
                  }}
                  className={`
                    rounded-full
                    border
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? `
                          border-[#7A4E2D]
                          bg-[#7A4E2D]
                          text-white
                          shadow-md
                        `
                        : `
                          border-[#DDD3C9]
                          bg-[#FAF8F5]
                          text-[#756E68]
                          hover:border-[#B88A68]
                          hover:bg-[#F5EDE5]
                          hover:text-[#7A4E2D]
                        `
                    }
                  `}
                >
                  {category}
                </button>
              )
            })}

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* GALLERY */}
      {/* ========================================================= */}

      <section className="bg-[#FAF8F5] py-14 md:py-16">

        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {/* Gallery Header */}
          <div className="mb-9 flex flex-col items-center text-center">

            <p
              className="
                mb-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#B8784F]
              "
            >
              Moments & Memories
            </p>

            <h2
              className="
                text-3xl
                font-semibold
                tracking-tight
                text-[#292522]
                md:text-4xl
              "
            >
              A Glimpse of Cherdung
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-relaxed
                text-[#756E68]
                md:text-base
              "
            >
              Explore our café, food, coffee, events,
              and the little moments behind the scenes.
            </p>

          </div>


          {filteredImages.length > 0 ? (

            <>
              {/* ================================================= */}
              {/* MASONRY-STYLE GALLERY */}
              {/* ================================================= */}

              <div
                className="
                  columns-1
                  gap-5
                  sm:columns-2
                  lg:columns-3
                  xl:columns-4
                "
              >

                {filteredImages.map((image, index) => (

                  <div
                    key={image.id}
                    className="
                      group
                      relative
                      mb-5
                      break-inside-avoid
                      cursor-pointer
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#E5DDD4]
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                    "
                    onClick={() => setLightboxIndex(index)}
                  >

                    {/* IMAGE */}

                    <img
                      src={image.url}
                      alt={
                        image.caption ||
                        "Cherdung Café gallery image"
                      }
                      className="
                        block
                        h-auto
                        min-h-[220px]
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-105
                      "
                      loading="lazy"
                    />


                    {/* DARK OVERLAY */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-black/0
                        transition-all
                        duration-300
                        group-hover:bg-black/45
                      "
                    />


                    {/* CATEGORY */}

                    {image.category && (
                      <div
                        className="
                          absolute
                          right-3
                          top-3
                          rounded-full
                          bg-white/95
                          px-3
                          py-1.5
                          text-[11px]
                          font-semibold
                          text-[#7A4E2D]
                          shadow-md
                          backdrop-blur-sm
                        "
                      >
                        {image.category}
                      </div>
                    )}


                    {/* HOVER CONTENT */}

                    <div
                      className="
                        absolute
                        inset-x-0
                        bottom-0
                        translate-y-4
                        p-5
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-y-0
                        group-hover:opacity-100
                      "
                    >

                      {image.caption && (
                        <p
                          className="
                            mb-3
                            line-clamp-2
                            text-sm
                            font-medium
                            leading-relaxed
                            text-white
                          "
                        >
                          {image.caption}
                        </p>
                      )}

                      <div
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          bg-white/95
                          px-4
                          py-2
                          text-xs
                          font-semibold
                          text-[#292522]
                          shadow-lg
                        "
                      >
                        View Photo

                        <ArrowDown
                          className="
                            h-3.5
                            w-3.5
                            rotate-[-45deg]
                          "
                        />
                      </div>

                    </div>

                  </div>

                ))}

              </div>


              {/* IMAGE COUNT */}

              <div className="mt-10 text-center">

                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-[#9A8D82]
                  "
                >
                  Showing {filteredImages.length}{" "}
                  {filteredImages.length === 1
                    ? "photo"
                    : "photos"}
                </p>

              </div>

            </>

          ) : (

            /* ================================================= */
            /* EMPTY STATE */
            /* ================================================= */

            <div className="py-16 text-center">

              <div
                className="
                  mx-auto
                  mb-5
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F1E8DE]
                "
              >
                <Camera
                  className="
                    h-9
                    w-9
                    text-[#B88A68]
                  "
                />
              </div>

              <h3
                className="
                  mb-2
                  text-xl
                  font-semibold
                  text-[#292522]
                "
              >
                No Images Yet
              </h3>

              <p
                className="
                  mx-auto
                  max-w-md
                  text-sm
                  leading-relaxed
                  text-[#756E68]
                "
              >
                No images in this category yet.
                Please check back soon.
              </p>

            </div>

          )}

        </div>
      </section>


      {/* ========================================================= */}
      {/* GALLERY CTA */}
      {/* ========================================================= */}

      <section className="bg-white py-14">

        <div
          className="
            mx-auto
            max-w-4xl
            px-4
            text-center
            sm:px-6
          "
        >

          <p
            className="
              mb-2
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#B8784F]
            "
          >
            Experience It Yourself
          </p>

          <h2
            className="
              mb-3
              text-3xl
              font-semibold
              text-[#292522]
              md:text-4xl
            "
          >
            Come Experience Cherdung Café
          </h2>

          <p
            className="
              mx-auto
              max-w-2xl
              text-sm
              leading-relaxed
              text-[#756E68]
              md:text-base
            "
          >
            Great coffee, delicious food, and a warm
            atmosphere are waiting for you.
          </p>

        </div>

      </section>


      {/* ========================================================= */}
      {/* LIGHTBOX */}
      {/* ========================================================= */}

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
