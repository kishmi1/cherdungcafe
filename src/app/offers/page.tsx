"use client"

import { useState, useEffect } from "react"
import {
  Tag,
  Star,
  Calendar,
  Percent,
  Ticket,
  Clock,
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
  const [filter, setFilter] = useState<"all" | "featured">("all")

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/offers")
      const data = await response.json()
      setOffers(data)
    } catch (error) {
      console.error("Error fetching offers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOffers = offers.filter((offer) =>
    filter === "all" ? true : offer.isFeatured
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} remaining`
    }

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} remaining`
    }

    return "Ending soon"
  }

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">

          <div
            className="
              mx-auto
              mb-4
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-[#D8B28C]
              border-t-[#B85C38]
            "
          />

          <p className="text-sm text-[#756E68]">
            Loading offers...
          </p>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3]">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#F5E6D5] py-16 md:py-20">

        {/* Decorative Circles */}
        <div
          className="
            absolute
            -left-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-[#D19A5A]/15
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
            bg-[#B85C38]/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-6xl
            px-4
            text-center
            sm:px-6
            lg:px-8
          "
        >

          <p
            className="
              mb-3
              text-sm
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#A66A3F]
            "
          >
            Cherdung Café
          </p>

          <h1
            className="
              mb-4
              text-4xl
              font-light
              tracking-tight
              text-[#3B2A20]
              md:text-5xl
              lg:text-6xl
            "
          >
            Special Offers
          </h1>

          <p
            className="
              mx-auto
              mb-8
              max-w-2xl
              text-base
              leading-relaxed
              text-[#756E68]
              md:text-lg
            "
          >
            Discover amazing deals and exclusive promotions
            at Cherdung Cafe.
          </p>


          {/* ================= FILTER BUTTONS ================= */}
          <div className="flex justify-center gap-3">

            <Button
              onClick={() => setFilter("all")}
              variant="outline"
              className={`
                rounded-full
                border
                px-6
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-300
                ${
                  filter === "all"
                    ? `
                      border-[#B85C38]
                      bg-[#B85C38]
                      text-white
                      shadow-md
                      hover:bg-[#984A2E]
                    `
                    : `
                      border-[#D7BCA5]
                      bg-[#FFFDF9]
                      text-[#8B5438]
                      hover:border-[#B85C38]
                      hover:bg-[#F9EBDD]
                    `
                }
              `}
            >
              All Offers
            </Button>


            <Button
              onClick={() => setFilter("featured")}
              variant="outline"
              className={`
                rounded-full
                border
                px-6
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-300
                ${
                  filter === "featured"
                    ? `
                      border-[#B85C38]
                      bg-[#B85C38]
                      text-white
                      shadow-md
                      hover:bg-[#984A2E]
                    `
                    : `
                      border-[#D7BCA5]
                      bg-[#FFFDF9]
                      text-[#8B5438]
                      hover:border-[#B85C38]
                      hover:bg-[#F9EBDD]
                    `
                }
              `}
            >
              <Star className="mr-2 h-4 w-4" />
              Featured
            </Button>

          </div>

        </div>
      </section>


      {/* ================= OFFERS ================= */}
      <section className="bg-[#FFF9F3] py-16 md:py-20">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* Section Heading */}
          <div className="mb-10 text-center">

            <p
              className="
                mb-2
                text-sm
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#C28A4A]
              "
            >
              Limited Time
            </p>

            <h2
              className="
                text-3xl
                font-semibold
                tracking-tight
                text-[#3B2A20]
                md:text-4xl
              "
            >
              Enjoy More, Pay Less
            </h2>

            <p
              className="
                mx-auto
                mt-3
                max-w-2xl
                text-sm
                leading-relaxed
                text-[#756E68]
                md:text-base
              "
            >
              Take advantage of our special café offers and promotions.
            </p>

          </div>


          {filteredOffers.length > 0 ? (

            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">

              {filteredOffers.map((offer) => (

                <Card
                  key={offer.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border-[#E6D7C8]
                    bg-white
                    shadow-[0_5px_20px_rgba(73,53,38,0.07)]
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-[#D6B99B]
                    hover:shadow-[0_18px_40px_rgba(73,53,38,0.14)]
                  "
                >

                  {/* ================= FEATURED BADGE ================= */}
                  {offer.isFeatured && (
                    <div
                      className="
                        absolute
                        left-4
                        top-4
                        z-20
                        flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-[#C28A4A]
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-white
                        shadow-md
                      "
                    >
                      <Star className="h-3.5 w-3.5 fill-current" />
                      Featured
                    </div>
                  )}


                  {/* ================= OFFER IMAGE ================= */}
                  {offer.image && (
                    <div className="relative h-52 overflow-hidden">

                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />

                      {/* Image Overlay */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/25
                          via-transparent
                          to-transparent
                        "
                      />

                    </div>
                  )}


                  <CardContent className="p-6">

                    {/* ================= TITLE ================= */}
                    <div className="mb-3 flex items-start justify-between gap-3">

                      <h3
                        className="
                          text-lg
                          font-semibold
                          leading-snug
                          text-[#3B2A20]
                        "
                      >
                        {offer.title}
                      </h3>

                      {!offer.isFeatured && (
                        <Star
                          className="
                            h-5
                            w-5
                            flex-shrink-0
                            text-[#D19A5A]
                          "
                        />
                      )}

                    </div>


                    {/* ================= DESCRIPTION ================= */}
                    <p
                      className="
                        mb-5
                        text-sm
                        leading-6
                        text-[#756E68]
                      "
                    >
                      {offer.description}
                    </p>


                    {/* ================= DISCOUNT ================= */}
                    {offer.discount && (
                      <div
                        className="
                          mb-5
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          bg-[#F9EBDD]
                          px-4
                          py-2
                        "
                      >

                        <div
                          className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            bg-[#B85C38]
                          "
                        >
                          <Percent className="h-3.5 w-3.5 text-white" />
                        </div>

                        <span
                          className="
                            text-sm
                            font-bold
                            text-[#8B5438]
                          "
                        >
                          {offer.discount}
                        </span>

                      </div>
                    )}


                    {/* ================= PROMO CODE ================= */}
                    {offer.promoCode && (
                      <div className="mb-5">

                        <p
                          className="
                            mb-2
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                            text-[#9A7450]
                          "
                        >
                          Promo Code
                        </p>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border-2
                            border-dashed
                            border-[#D19A5A]
                            bg-[#FFF9F3]
                            p-2
                          "
                        >

                          <div
                            className="
                              flex
                              h-8
                              w-8
                              flex-shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-[#F5E6D5]
                            "
                          >
                            <Ticket className="h-4 w-4 text-[#B85C38]" />
                          </div>

                          <code
                            className="
                              flex-1
                              font-mono
                              text-sm
                              font-bold
                              tracking-wide
                              text-[#7A4E2D]
                            "
                          >
                            {offer.promoCode}
                          </code>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyPromoCode(offer.promoCode!)
                            }
                            className="
                              h-8
                              rounded-lg
                              px-3
                              text-[#B85C38]
                              hover:bg-[#F5E6D5]
                              hover:text-[#8B5438]
                            "
                          >
                            Copy
                          </Button>

                        </div>

                      </div>
                    )}


                    {/* ================= DATES ================= */}
                    <div
                      className="
                        mb-5
                        space-y-3
                        rounded-xl
                        bg-[#FAF5EF]
                        p-4
                        text-sm
                        text-[#756E68]
                      "
                    >

                      <div className="flex items-center gap-2.5">

                        <Calendar className="h-4 w-4 text-[#B85C38]" />

                        <span>
                          {formatDate(offer.startsAt)} -{" "}
                          {formatDate(offer.endsAt)}
                        </span>

                      </div>


                      <div className="flex items-center gap-2.5">

                        <Clock className="h-4 w-4 text-[#B85C38]" />

                        <span className="font-semibold text-[#8B5438]">
                          {getTimeRemaining(offer.endsAt)}
                        </span>

                      </div>

                    </div>


                    {/* ================= TERMS ================= */}
                    {offer.terms && (
                      <div
                        className="
                          border-t
                          border-[#E9DDD1]
                          pt-4
                          text-xs
                          leading-5
                          text-[#827871]
                        "
                      >

                        <strong className="font-semibold text-[#4B3A30]">
                          Terms:
                        </strong>{" "}

                        {offer.terms}

                      </div>
                    )}

                  </CardContent>

                </Card>

              ))}

            </div>

          ) : (

            /* ================= EMPTY STATE ================= */
            <Card
              className="
                rounded-2xl
                border-[#E6D7C8]
                bg-white
                py-16
                text-center
                shadow-sm
              "
            >

              <CardContent>

                <div
                  className="
                    mx-auto
                    mb-5
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F5E6D5]
                  "
                >
                  <Tag className="h-8 w-8 text-[#C28A4A]" />
                </div>


                <h3
                  className="
                    mb-2
                    text-xl
                    font-semibold
                    text-[#3B2A20]
                  "
                >
                  No Active Offers
                </h3>


                <p
                  className="
                    mx-auto
                    max-w-md
                    text-sm
                    leading-6
                    text-[#756E68]
                  "
                >
                  {filter === "featured"
                    ? "No featured offers at the moment. Check back later!"
                    : "Check back soon for amazing deals and promotions!"}
                </p>

              </CardContent>

            </Card>

          )}

        </div>
      </section>


      {/* ================= BOTTOM CTA ================= */}
      <section className="relative overflow-hidden bg-[#30251F] py-14 text-white">

        {/* Decorative Background */}
        <div
          className="
            absolute
            -left-20
            -top-20
            h-60
            w-60
            rounded-full
            bg-[#C28A4A]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-20
            -right-20
            h-60
            w-60
            rounded-full
            bg-[#B85C38]/10
            blur-3xl
          "
        />

        <div
          className="
            relative
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
              text-sm
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#D19A5A]
            "
          >
            Cherdung Café
          </p>

          <h2 className="mb-3 text-2xl font-semibold md:text-3xl">
            Don't Miss Our Special Offers
          </h2>

          <p
            className="
              mx-auto
              max-w-2xl
              text-sm
              leading-6
              text-[#DED3C8]
              md:text-base
            "
          >
            Visit Cherdung Cafe and enjoy great coffee, delicious food,
            and exclusive deals.
          </p>

        </div>

      </section>


      {/* ================= SEO ================= */}
      <OfferStructuredData offers={filteredOffers} />

    </div>
  )
}
