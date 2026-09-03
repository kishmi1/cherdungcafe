import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  Check,
} from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Our Services - Cherdung Café",
  description:
    "Discover our café services including specialty coffee, dine-in, takeaway, catering, private events, and fresh bakery items.",
  openGraph: {
    title: "Our Services - Cherdung Café",
    description:
      "From specialty coffee to private events, we offer everything you need for a perfect café experience.",
  },
}

async function getServices() {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    })

    return services
  } catch (error) {
    console.error("Error fetching services:", error)
    return []
  }
}

export default async function ServicesPage() {
  const services = await getServices()

  const fallbackServices = [
    {
      id: 1,
      title: "Specialty Coffee",
      description:
        "Freshly brewed coffee crafted by our baristas using quality beans.",
      image: null,
      priceNote: "Starting from $3.50",
    },
    {
      id: 2,
      title: "Dine-In Experience",
      description:
        "Enjoy delicious food and drinks in our warm and comfortable space.",
      image: null,
      priceNote: "No minimum order",
    },
    {
      id: 3,
      title: "Takeaway",
      description:
        "Freshly prepared meals and beverages, ready to enjoy wherever you go.",
      image: null,
      priceNote: "Ready in 5 minutes",
    },
    {
      id: 4,
      title: "Bakery & Fresh Bakes",
      description:
        "Fresh pastries, cakes, muffins and other delicious baked treats.",
      image: null,
      priceNote: "Daily from 7am",
    },
    {
      id: 5,
      title: "Catering",
      description:
        "Food and beverage service for meetings, gatherings and special occasions.",
      image: null,
      priceNote: "Custom quotes available",
    },
    {
      id: 6,
      title: "Private Events",
      description:
        "A cozy space for birthdays, celebrations, meetings and private gatherings.",
      image: null,
      priceNote: "Requires booking",
    },
  ]

  const displayServices =
    services.length > 0 ? services : fallbackServices

  return (
    <div className="min-h-screen bg-[#FAF7F2]">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#F3EADF] py-16 md:py-20">
        <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#D8C2A8]/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#A7B09A]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">

            

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
              Our Services
            </h1>

            <p
              className="
                mx-auto
                max-w-3xl
                text-base
                leading-relaxed
                text-[#756E68]
                md:text-lg
              "
            >
              More than just coffee — an experience crafted for you.
            </p>

          </div>
        </div>
      </section>


      {/* ================= ALL SERVICES ================= */}
      <section className="bg-[#EDE6DC] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Heading */}
          <div className="mb-10 text-center">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#9A7450]">
              What We Offer
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
              All Services
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
              Everything you need for the perfect café experience
            </p>

          </div>


          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {displayServices.map((service) => {
              return (
                <Card
                  key={service.id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border-[#DED3C6]
                    bg-[#FFFDF9]
                    shadow-[0_4px_20px_rgba(73,53,38,0.06)]
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-[#CDB79E]
                    hover:shadow-[0_15px_35px_rgba(73,53,38,0.12)]
                  "
                >

                  {/* Image */}
                  {service.image ? (
                    <div className="overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="
                          h-48
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-[#F3EADF]">
                      <span className="text-sm text-[#76543C]">No image available</span>
                    </div>
                  )}

                  <CardContent className="p-6">

                    <div className="flex flex-col">

                      {/* Content */}
                      <div className="mb-5">
                        <div className="flex-1">

                          <h3
                            className="
                              mb-2
                              text-lg
                              font-semibold
                              text-[#3B2A20]
                            "
                          >
                            {service.title}
                          </h3>

                          <p
                            className="
                              text-sm
                              leading-6
                              text-[#756E68]
                            "
                          >
                            {service.description}
                          </p>

                          {service.priceNote && (
                            <p
                              className="
                                mt-3
                                text-xs
                                font-semibold
                                text-[#8B684A]
                              "
                            >
                              {service.priceNote}
                            </p>
                          )}

                        </div>
                      </div>


                      {/* Divider */}
                      <div className="mb-4 h-px bg-[#E9DED1]" />


                      {/* Learn More */}
                      <Link
                        href="/enquiry"
                        className="
                          group/link
                          inline-flex
                          w-fit
                          items-center
                          gap-2
                          text-sm
                          font-semibold
                          text-[#7A4E2D]
                          transition-colors
                          duration-300
                          hover:text-[#4F321F]
                        "
                      >
                        Learn More

                        <ArrowRight
                          className="
                            h-4
                            w-4
                            transition-transform
                            duration-300
                            group-hover/link:translate-x-1
                          "
                        />
                      </Link>

                    </div>

                  </CardContent>
                </Card>
              )
            })}

          </div>
        </div>
      </section>


      {/* ================= FEATURED EXPERIENCE ================= */}
      <section className="bg-[#E9EEE7] py-16 md:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10 text-center">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#68745F]">
              The Café Experience
            </p>

            <h2
              className="
                text-3xl
                font-semibold
                tracking-tight
                text-[#34402F]
                md:text-4xl
              "
            >
              Made for Every Moment
            </h2>

            <p
              className="
                mx-auto
                mt-3
                max-w-2xl
                text-sm
                leading-relaxed
                text-[#697267]
                md:text-base
              "
            >
              A welcoming place for coffee, food, work, conversations,
              and special moments.
            </p>

          </div>


          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">

            {/* Image */}
            <div className="relative">

              <div className="overflow-hidden rounded-3xl shadow-[0_15px_40px_rgba(52,64,47,0.15)]">

                <div
                  className="
                    aspect-[4/3]
                    bg-cover
                    bg-center
                    transition-transform
                    duration-700
                    hover:scale-105
                  "
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=90")',
                  }}
                />

              </div>

            </div>


            {/* Content */}
            <div className="rounded-3xl bg-[#F8FAF6] p-7 shadow-sm md:p-9">

              <p
                className="
                  mb-7
                  text-base
                  leading-7
                  text-[#697267]
                  md:text-lg
                "
              >
                Whether you're meeting friends, working remotely,
                grabbing a quick coffee, or celebrating something special,
                Cherdung Cafe has a space and experience for you.
              </p>


              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DCE5D8]">
                    <Check className="h-4 w-4 text-[#5F6E55]" />
                  </div>

                  <span className="text-sm font-medium text-[#3F493B]">
                    Freshly prepared food
                  </span>
                </div>


                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DCE5D8]">
                    <Check className="h-4 w-4 text-[#5F6E55]" />
                  </div>

                  <span className="text-sm font-medium text-[#3F493B]">
                    Quality coffee
                  </span>
                </div>


                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DCE5D8]">
                    <Check className="h-4 w-4 text-[#5F6E55]" />
                  </div>

                  <span className="text-sm font-medium text-[#3F493B]">
                    Comfortable atmosphere
                  </span>
                </div>


                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DCE5D8]">
                    <Check className="h-4 w-4 text-[#5F6E55]" />
                  </div>

                  <span className="text-sm font-medium text-[#3F493B]">
                    Friendly service
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= HOW WE SERVE ================= */}
      <section className="bg-[#F8F3EC] py-16 md:py-20">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10 text-center">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#9A7450]">
              Simple & Comfortable
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
              How We Serve You
            </h2>

            <p
              className="
                mt-3
                text-sm
                text-[#756E68]
              "
            >
              Simple, comfortable, and made for you.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* 01 */}
            <div
              className="
                rounded-2xl
                border
                border-[#E4D7C8]
                bg-[#FFFDF9]
                p-7
                text-center
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div className="mb-3 text-4xl font-light text-[#9A7450]">
                01
              </div>

              <h3
                className="
                  mb-2
                  text-lg
                  font-semibold
                  text-[#3B2A20]
                "
              >
                Choose
              </h3>

              <p className="text-sm leading-6 text-[#756E68]">
                Explore our food, coffee and services.
              </p>

            </div>


            {/* 02 */}
            <div
              className="
                rounded-2xl
                border
                border-[#E4D7C8]
                bg-[#FFFDF9]
                p-7
                text-center
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div className="mb-3 text-4xl font-light text-[#9A7450]">
                02
              </div>

              <h3
                className="
                  mb-2
                  text-lg
                  font-semibold
                  text-[#3B2A20]
                "
              >
                Enjoy
              </h3>

              <p className="text-sm leading-6 text-[#756E68]">
                Relax and enjoy your time at Cherdung Cafe.
              </p>

            </div>


            {/* 03 */}
            <div
              className="
                rounded-2xl
                border
                border-[#E4D7C8]
                bg-[#FFFDF9]
                p-7
                text-center
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div className="mb-3 text-4xl font-light text-[#9A7450]">
                03
              </div>

              <h3
                className="
                  mb-2
                  text-lg
                  font-semibold
                  text-[#3B2A20]
                "
              >
                Experience
              </h3>

              <p className="text-sm leading-6 text-[#756E68]">
                Make your visit memorable.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="relative overflow-hidden bg-[#30251F] py-16 text-white md:py-20">

        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#9A7450]/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[#C6A77D]/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#C6A77D]">
            Cherdung Café
          </p>

          <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
            Planning Something Special?
          </h2>

          <p
            className="
              mx-auto
              mb-7
              max-w-2xl
              text-base
              leading-7
              text-[#DED3C8]
            "
          >
            Let us make your next gathering memorable with delicious food,
            great coffee and a welcoming atmosphere.
          </p>

          <Link
            href="/enquiry"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#9A7450]
              px-7
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:bg-[#7D5A3C]
              hover:shadow-xl
              hover:-translate-y-0.5
            "
          >
            Enquire Now

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </Link>

        </div>

      </section>

    </div>
  )
}
