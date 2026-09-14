import Link from "next/link"
import {
  Coffee,
  Utensils,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  ArrowDown,
  Star,
} from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function Home() {
  // Fetch settings from database for hero section
  const settings = await prisma.settings.findFirst()

  // Fetch services from database
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })

  // Fetch featured offers from database
  const now = new Date()
  const featuredOffers = await prisma.offer.findMany({
    where: {
      AND: [
        { isFeatured: true },
        { startsAt: { lte: now } },
        { endsAt: { gte: now } },
      ],
    },
    orderBy: { startsAt: "asc" },
    take: 2,
  })

  // Fetch gallery images for preview
  const galleryImages = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
    take: 6,
  })

  // Popular Menu is managed from the admin panel and refreshes with every page request.
  const popularMenuItems = await prisma.menuItem.findMany({
    where: { isPopular: true, isAvailable: true },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    take: 4,
  })

  // Fetch latest blog posts for Latest Updates section
  const latestBlogPosts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
  })

  // Hero section settings with fallbacks
  const heroSettings = {
    imageUrl: settings?.heroImageUrl as string || "/hero-cafe.jpg",
    overlayOpacity: (settings?.heroOverlayOpacity as number) || 0.85,
    gradientLeft: (settings?.heroGradientLeft as string) || "rgba(26,24,21,0.88)",
    gradientRight: (settings?.heroGradientRight as string) || "rgba(26,24,21,0.55)",
    gradientBottom: (settings?.heroGradientBottom as string) || "rgba(26,24,21,0.75)",
    warmOverlayColor: (settings?.heroWarmOverlayColor as string) || "rgba(212,196,168,0.15)",
    warmOverlayOpacity: (settings?.heroWarmOverlayOpacity as number) || 0.25,
    enabled: (settings?.heroEnabled as boolean) ?? true,
  }

  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      {heroSettings.enabled && (
        <section className="relative h-screen min-h-[350px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[650px] xl:min-h-[750px] bg-[#1a1815] overflow-hidden">
          {/* 
            HERO BACKGROUND IMAGE - Managed from Settings Database
            Image URL and overlay settings can be changed from Admin Panel
          */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              // Premium gradient overlay for luxury aesthetic - optimized for text readability
              backgroundImage: `linear-gradient(to right, ${heroSettings.gradientLeft} 0%, ${heroSettings.gradientRight} 35%, ${heroSettings.gradientBottom} 100%), 
                               linear-gradient(to bottom, rgba(26,24,21,0.4) 0%, rgba(26,24,21,0.6) 50%, rgba(26,24,21,0.75) 100%),
                               url("${heroSettings.imageUrl}")`,
            }}
          />
          {/* Luxury warm overlay for elegant classic aesthetic */}
          <div
            className="absolute inset-0"
            style={{
              opacity: heroSettings.warmOverlayOpacity,
              background: `linear-gradient(135deg, ${heroSettings.warmOverlayColor} 0%, rgba(196,180,152,0.1) 50%, rgba(184,168,140,0.18) 100%)`,
            }}
          />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16 max-w-7xl mx-auto py-4 sm:py-8 md:py-12">
          <div className="text-center max-w-4xl px-2 sm:px-4">
            {/* Eyebrow Text - Luxury Classic */}
            <p className="text-[10px] sm:text-[10px] md:text-xs lg:text-base text-[#D4C4A8] mb-2 sm:mb-3 md:mb-4 lg:mb-6 tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.35em] uppercase font-sans font-light opacity-90">
              GOOD FOOD • GREAT COFFEE • WARM MOMENTS
            </p>

            {/* Main Heading - Elegant Serif */}
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl font-light text-white mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 tracking-[0.03em] sm:tracking-[0.03em] md:tracking-[0.05em] lg:tracking-[0.08em] leading-[1.1] sm:leading-[1.15] md:leading-[1.2] font-serif" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              A Taste of Warmth,<br />A Place to Belong.
            </h1>

            {/* Supporting Text - Clean Sans */}
            <p className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-100 mb-4 sm:mb-5 md:mb-6 lg:mb-8 max-w-md sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto font-sans leading-relaxed sm:leading-relaxed tracking-[0.02em] sm:tracking-[0.02em] md:tracking-[0.03em] lg:tracking-[0.05em] font-light px-2 sm:px-4" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.4)' }}>
              At Cherdung Café, we serve more than just coffee and food —<br className="hidden sm:block" />
              we serve cozy corners, meaningful conversations and moments<br className="hidden sm:block" />
              that feel like home.
            </p>

            {/* Buttons - Luxury Classic Style */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center px-2 sm:px-4 w-full max-w-xs sm:max-w-none mx-auto">
              <Link
                href="/menu"
                className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 lg:px-10 lg:py-3 bg-[#D4C4A8] text-[#1a1815] text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.1em] sm:tracking-[0.1em] md:tracking-[0.15em] lg:tracking-[0.2em] hover:bg-[#C4B498] transition-all duration-300 font-sans font-light hover:shadow-lg hover:shadow-[#D4C4A8]/20 hover:-translate-y-1 text-center"
              >
                EXPLORE MENU →
              </Link>

              <Link
                href="/book-a-table"
                className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 lg:px-10 lg:py-3 border-2 border-[#D4C4A8] text-[#D4C4A8] text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.1em] sm:tracking-[0.1em] md:tracking-[0.15em] lg:tracking-[0.2em] hover:bg-[#D4C4A8] hover:text-[#1a1815] transition-all duration-300 font-sans font-light hover:shadow-lg hover:shadow-[#D4C4A8]/20 hover:-translate-y-1 text-center"
              >
                BOOK A TABLE
              </Link>
            </div>
          </div>

          {/* Subtle Text - More than just a café */}
          <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-24 xl:bottom-32 right-2 sm:right-4 md:right-8 lg:right-16 hidden lg:block">
            <p className="text-[#D4C4A8] text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-light italic font-serif opacity-80" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
              More than just a café
            </p>
          </div>

          {/* Scroll Indicator - Elegant - Hidden on mobile */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center hidden sm:flex">
            <p className="text-[#D4C4A8] text-[8px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] uppercase mb-2 sm:mb-3 md:mb-4 font-sans font-light opacity-70">
              SCROLL DOWN
            </p>
            <div className="w-3 h-6 sm:w-4 sm:h-8 md:w-5 md:h-10 border-2 border-[#D4C4A8] rounded-full flex justify-center opacity-80">
              <div className="w-1 h-1.5 sm:h-2 md:h-3 bg-[#D4C4A8] rounded-full mt-1 sm:mt-1.5 md:mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Welcome / About Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#F6F1E8] dark:bg-[#25211E]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">

            {/* Left: Cafe Image */}
            <div className="relative order-2 lg:order-1">
              <div
                className="aspect-[4/3] bg-cover bg-center rounded-lg shadow-2xl"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=90")',
                }}
              />
            </div>

            {/* Right: Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#302923] dark:text-white mb-3 sm:mb-4 md:mb-6 tracking-[0.02em] sm:tracking-[0.03em] leading-tight font-serif">
                Welcome to Cherdung Cafe
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-[#766C63] dark:text-gray-300 mb-4 sm:mb-6 md:mb-8 leading-relaxed font-sans tracking-wide">
                More than just a café, Cherdung Cafe is your community space where quality coffee meets culinary excellence. We're passionate about creating moments that matter – from your morning espresso to evening gatherings with friends.
              </p>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 md:px-6 md:py-3 bg-[#E8DED0] text-[#302923] text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] hover:bg-[#DCCFBE] transition-colors font-sans font-medium"
              >
                Our Story
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#E8EDE7] dark:bg-[#202522]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          {/* Section Heading */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#292E2A] dark:text-white mb-2 sm:mb-3 md:mb-4 tracking-[0.02em] sm:tracking-[0.03em] leading-tight font-serif">
              Our Services
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#69736B] dark:text-gray-300 max-w-2xl mx-auto font-sans tracking-wide">
              Everything you need for the perfect café experience
            </p>
          </div>

          {/* Only 4 Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {services.slice(0, 4).map((service) => {
              return (
                <div
                  key={service.id}
                  className="bg-[#FAFBF8] dark:bg-[#292D2A] p-4 sm:p-5 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Service Image */}
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="mb-3 sm:mb-4 md:mb-6 h-28 sm:h-36 md:h-44 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="bg-[#DDE5DC] dark:bg-[#374039] w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 md:mb-6 mx-auto">
                      <span className="text-[10px] sm:text-xs text-[#6D513C]">No image</span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#292E2A] dark:text-white mb-1.5 sm:mb-2 md:mb-3 tracking-wide leading-tight font-serif">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-[#69736B] dark:text-gray-300 line-clamp-3 font-sans leading-relaxed">
                    {service.description}
                  </p>

                  {/* Price Note */}
                  {service.priceNote && (
                    <p className="text-[#7A4E2D] text-[10px] sm:text-xs md:text-sm mt-1.5 sm:mt-2 md:mt-3 font-medium font-sans tracking-wide">
                      {service.priceNote}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* View All Services Button */}
          <div className="flex justify-center mt-6 sm:mt-8 md:mt-12">
            <a
              href="/services"
              className="group inline-flex items-center gap-2 bg-[#76543C] hover:bg-[#5F422F] text-white px-4 py-2.5 sm:px-6 sm:py-3 md:px-7 md:py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg font-sans tracking-[0.08em] sm:tracking-[0.1em]"
            >
              View All Services

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

        </div>
      </section>

      {/* Popular Menu */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#FBF8F2] dark:bg-[#211E1B]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#302923] dark:text-white mb-2 sm:mb-3 md:mb-4 tracking-[0.02em] sm:tracking-[0.03em] leading-tight font-serif">
              Popular Menu
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#766C63] dark:text-gray-300 max-w-2xl mx-auto font-sans tracking-wide">
              Customer favorites you'll love
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {popularMenuItems.map((menuItem) => (
              <div key={menuItem.id} className="group">
                {menuItem.image ? (
                  <img
                    src={menuItem.image}
                    alt={menuItem.title}
                    className="mb-2 sm:mb-3 md:mb-4 aspect-square w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="mb-2 sm:mb-3 md:mb-4 flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-[#F1E8DC] to-[#E7DED2]">
                    <Coffee className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-[#76543C]" />
                  </div>
                )}

                <h3 className="mb-1 text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-[#302923] dark:text-white tracking-wide leading-tight font-serif">
                  {menuItem.title}
                </h3>

                {menuItem.description && (
                  <p className="mb-1.5 sm:mb-2 text-[10px] sm:text-xs md:text-sm text-[#766C63] dark:text-gray-300 font-sans leading-relaxed line-clamp-2">
                    {menuItem.description}
                  </p>
                )}

                <p className="mb-1.5 sm:mb-2 text-xs sm:text-sm md:text-base font-semibold text-[#76543C] font-sans tracking-wide">
                  {menuItem.price}
                </p>
              </div>
            ))}
          </div>

          {popularMenuItems.length === 0 && (
            <p className="py-6 sm:py-8 text-center text-xs sm:text-sm md:text-base text-[#766C63] dark:text-gray-300 font-sans">
              No popular menu items are available right now.
            </p>
          )}

          <div className="text-center mt-6 sm:mt-8 md:mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 bg-[#76543C] text-white text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] hover:bg-[#5F422F] transition-colors font-sans font-medium"
            >
              View Full Menu
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-[#76503A] to-[#4E3325] text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-2 sm:mb-3 md:mb-4 tracking-[0.02em] sm:tracking-[0.03em] leading-tight font-serif">
              Today's Special
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#E8D9C8] max-w-2xl mx-auto font-sans tracking-wide">
              Limited time offers you don't want to miss
            </p>
          </div>

          {featuredOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {featuredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-lg border border-white/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide leading-tight font-serif">
                      {offer.title}
                    </h3>

                    {offer.discount && (
                      <span className="bg-white text-[#76503A] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-bold font-sans tracking-wide">
                        {offer.discount}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm md:text-base text-[#E8D9C8] mb-3 sm:mb-4 font-sans leading-relaxed">
                    {offer.description}
                  </p>

                  {offer.promoCode && (
                    <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded bg-white/20">
                      <span className="text-[10px] sm:text-xs md:text-sm font-mono font-bold">
                        {offer.promoCode}
                      </span>
                    </div>
                  )}

                  <p className="text-[10px] sm:text-xs md:text-sm text-[#E8D9C8] font-sans">
                    Valid until:{" "}
                    {new Date(offer.endsAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 md:py-12">
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#E8D9C8] font-sans">
                No featured offers at the moment. Check back soon!
              </p>
            </div>
          )}

          <div className="text-center mt-6 sm:mt-8 md:mt-12">
            <Link
              href="/offers"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 bg-white text-[#76503A] text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] hover:bg-[#F3EDE2] transition-colors font-sans font-medium"
            >
              View All Offers
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#F0E8DE] dark:bg-[#27221E]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#302923] dark:text-white mb-2 sm:mb-3 md:mb-4 tracking-[0.02em] sm:tracking-[0.03em] leading-tight font-serif">
              Why Choose Cherdung Cafe
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#766C63] dark:text-gray-300 max-w-2xl mx-auto font-sans tracking-wide">
              What makes us different
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">

            <div className="text-center">
              <div className="bg-[#E2D6C7] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Coffee className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#76503A]" />
              </div>

              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#302923] dark:text-white mb-1 sm:mb-1.5 md:mb-2 tracking-wide leading-tight font-serif">
                Quality Coffee
              </h3>

              <p className="text-[10px] sm:text-xs md:text-sm text-[#766C63] dark:text-gray-300 font-sans leading-relaxed">
                Premium beans, expert baristas
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#E2D6C7] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Utensils className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#76503A]" />
              </div>

              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#302923] dark:text-white mb-1 sm:mb-1.5 md:mb-2 tracking-wide leading-tight font-serif">
                Fresh Ingredients
              </h3>

              <p className="text-[10px] sm:text-xs md:text-sm text-[#766C63] dark:text-gray-300 font-sans leading-relaxed">
                Locally sourced, organic when possible
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#E2D6C7] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#76503A]" />
              </div>

              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#302923] dark:text-white mb-1 sm:mb-1.5 md:mb-2 tracking-wide leading-tight font-serif">
                Cozy Atmosphere
              </h3>

              <p className="text-[10px] sm:text-xs md:text-sm text-[#766C63] dark:text-gray-300 font-sans leading-relaxed">
                Warm, welcoming environment
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#E2D6C7] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#A47D45]" />
              </div>

              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#302923] dark:text-white mb-1 sm:mb-1.5 md:mb-2 tracking-wide leading-tight font-serif">
                Friendly Service
              </h3>

              <p className="text-[10px] sm:text-xs md:text-sm text-[#766C63] dark:text-gray-300 font-sans leading-relaxed">
                Attentive, personalized care
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#E7E3DC] dark:bg-[#242321]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#302923] dark:text-white mb-2 sm:mb-3 md:mb-4 tracking-[0.02em] sm:tracking-[0.03em] leading-tight font-serif">
              Our Gallery
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#766C63] dark:text-gray-300 max-w-2xl mx-auto font-sans tracking-wide">
              A glimpse into our world
            </p>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.caption || "Gallery image"}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">

              <div className="aspect-square bg-gradient-to-br from-[#DDD7CE] to-[#F0ECE5] rounded-lg flex items-center justify-center">
                <Coffee className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#76503A]" />
              </div>

              <div className="aspect-square bg-gradient-to-br from-[#DDD7CE] to-[#F0ECE5] rounded-lg flex items-center justify-center">
                <Utensils className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#76503A]" />
              </div>

              <div className="aspect-square bg-gradient-to-br from-[#DDD7CE] to-[#F0ECE5] rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#76503A]" />
              </div>

              <div className="aspect-square bg-gradient-to-br from-[#DDD7CE] to-[#F0ECE5] rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#76503A]" />
              </div>

              <div className="aspect-square bg-gradient-to-br from-[#DDD7CE] to-[#F0ECE5] rounded-lg flex items-center justify-center">
                <Coffee className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#76503A]" />
              </div>

              <div className="aspect-square bg-gradient-to-br from-[#DDD7CE] to-[#F0ECE5] rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#76503A]" />
              </div>

            </div>
          )}

          <div className="text-center mt-6 sm:mt-8 md:mt-12">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 bg-[#F5F0E8] text-[#302923] text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] hover:bg-[#E4DCCF] transition-colors font-sans font-medium"
            >
              View Gallery
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#FAF7F1] dark:bg-[#211F1C]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#302923] dark:text-white mb-2 sm:mb-3 md:mb-4 tracking-[0.02em] sm:tracking-[0.03em] leading-tight font-serif">
              What Our Customers Say
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#766C63] dark:text-gray-300 max-w-2xl mx-auto font-sans tracking-wide">
              Real reviews from real people
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">

            <div className="bg-[#EFE7DC] dark:bg-[#302B27] p-4 sm:p-6 md:p-8 rounded-lg">
              <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-[#B8955A] fill-current"
                  />
                ))}
              </div>

              <p className="text-xs sm:text-sm md:text-base text-[#766C63] dark:text-gray-300 mb-2 sm:mb-3 md:mb-4 italic font-sans leading-relaxed">
                "Amazing coffee, beautiful atmosphere and excellent service. This is my go-to spot for meetings and relaxation."
              </p>

              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#DED1C2] rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4">
                  <span className="text-[10px] sm:text-xs md:text-sm text-[#76503A] font-semibold font-sans">SM</span>
                </div>

                <div>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-[#302923] dark:text-white font-serif">
                    Sarah Mitchell
                  </p>

                  <p className="text-[10px] sm:text-xs md:text-sm text-[#766C63] dark:text-gray-400 font-sans">
                    Regular Customer
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#EFE7DC] dark:bg-[#302B27] p-4 sm:p-6 md:p-8 rounded-lg">
              <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-[#B8955A] fill-current"
                  />
                ))}
              </div>

              <p className="text-xs sm:text-sm md:text-base text-[#766C63] dark:text-gray-300 mb-2 sm:mb-3 md:mb-4 italic font-sans leading-relaxed">
                "The best latte I've ever had. The staff is always friendly and the ambiance is perfect for both work and social."
              </p>

              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#DED1C2] rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4">
                  <span className="text-[10px] sm:text-xs md:text-sm text-[#76503A] font-semibold font-sans">JD</span>
                </div>

                <div>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-[#302923] dark:text-white font-serif">
                    John Davis
                  </p>

                  <p className="text-[10px] sm:text-xs md:text-sm text-[#766C63] dark:text-gray-400 font-sans">
                    Remote Worker
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#EFE7DC] dark:bg-[#302B27] p-4 sm:p-6 md:p-8 rounded-lg">
              <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-[#B8955A] fill-current"
                  />
                ))}
              </div>

              <p className="text-xs sm:text-sm md:text-base text-[#766C63] dark:text-gray-300 mb-2 sm:mb-3 md:mb-4 italic font-sans leading-relaxed">
                "Great food, reasonable prices, and the team makes you feel like family. Highly recommend their weekend brunch!"
              </p>

              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#DED1C2] rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4">
                  <span className="text-[10px] sm:text-xs md:text-sm text-[#76503A] font-semibold font-sans">AK</span>
                </div>

                <div>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-[#302923] dark:text-white font-serif">
                    Emily Chen
                  </p>

                  <p className="text-[10px] sm:text-xs md:text-sm text-[#766C63] dark:text-gray-400 font-sans">
                    Food Blogger
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#EDE7DF] dark:bg-[#25221F]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#302923] dark:text-white mb-2 sm:mb-3 md:mb-4 font-serif">
              Latest Updates
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#766C63] dark:text-gray-300 max-w-2xl mx-auto font-sans">
              Stay connected with our latest news and stories
            </p>
          </div>

          {latestBlogPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {latestBlogPosts.map((post) => (
                <div key={post.id} className="bg-[#FCFAF6] dark:bg-[#302C28] p-4 sm:p-5 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  {post.coverImage ? (
                    <div className="aspect-video overflow-hidden rounded-lg mb-2 sm:mb-3 md:mb-4">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-[#F0E8DC] to-[#E3D9CC] rounded-lg mb-2 sm:mb-3 md:mb-4 flex items-center justify-center">
                      <Coffee className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#76503A]" />
                    </div>
                  )}

                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#302923] dark:text-white mb-1.5 sm:mb-2 font-serif">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#766C63] dark:text-gray-300 mb-2 sm:mb-3 md:mb-4 line-clamp-2 font-sans">
                    {post.excerpt || "Discover our latest stories and updates..."}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[#76503A] hover:text-[#5F422F] font-medium text-[10px] sm:text-xs md:text-sm font-sans"
                  >
                    Read More →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-[#FCFAF6] dark:bg-[#302C28] p-4 sm:p-5 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-[#F0E8DC] to-[#E3D9CC] rounded-lg mb-2 sm:mb-3 md:mb-4 flex items-center justify-center">
                  <Coffee className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#76503A]" />
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#302923] dark:text-white mb-1.5 sm:mb-2 font-serif">
                  New Summer Menu Launch
                </h3>

                <p className="text-xs sm:text-sm text-[#766C63] dark:text-gray-300 mb-2 sm:mb-3 md:mb-4 font-sans">
                  Discover our refreshing seasonal offerings...
                </p>

                <Link
                  href="/blog"
                  className="text-[#76503A] hover:text-[#5F422F] font-medium text-[10px] sm:text-xs md:text-sm font-sans"
                >
                  Read More →
                </Link>
              </div>

              <div className="bg-[#FCFAF6] dark:bg-[#302C28] p-4 sm:p-5 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-[#F0E8DC] to-[#E3D9CC] rounded-lg mb-2 sm:mb-3 md:mb-4 flex items-center justify-center">
                  <Coffee className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#76503A]" />
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#302923] dark:text-white mb-1.5 sm:mb-2 font-serif">
                  Coffee Brewing Tips
                </h3>

                <p className="text-xs sm:text-sm text-[#766C63] dark:text-gray-300 mb-2 sm:mb-3 md:mb-4 font-sans">
                  Learn the art of perfect pour-over at home...
                </p>

                <Link
                  href="/blog"
                  className="text-[#76503A] hover:text-[#5F422F] font-medium text-[10px] sm:text-xs md:text-sm font-sans"
                >
                  Read More →
                </Link>
              </div>

              <div className="bg-[#FCFAF6] dark:bg-[#302C28] p-4 sm:p-5 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-[#F0E8DC] to-[#E3D9CC] rounded-lg mb-2 sm:mb-3 md:mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#76503A]" />
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#302923] dark:text-white mb-1.5 sm:mb-2 font-serif">
                  Community Events
                </h3>

                <p className="text-xs sm:text-sm text-[#766C63] dark:text-gray-300 mb-2 sm:mb-3 md:mb-4 font-sans">
                  Join us for music nights and art shows...
                </p>

                <Link
                  href="/blog"
                  className="text-[#76503A] hover:text-[#5F422F] font-medium text-[10px] sm:text-xs md:text-sm font-sans"
                >
                  Read More →
                </Link>
              </div>
            </div>
          )}

          <div className="text-center mt-6 sm:mt-8 md:mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 bg-[#76543C] text-white text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.08em] sm:tracking-widest hover:bg-[#5F422F] transition-colors font-sans"
            >
              View Latest Updates
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reservation & Enquiry CTA */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#29211C] text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">

            {/* Reservation */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-2 sm:mb-3 md:mb-4 font-serif">
                Your Table Is Waiting
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-4 sm:mb-6 md:mb-8 font-sans">
                Reserve your spot for the perfect dining experience
              </p>

              <Link
                href="/book-a-table"
                className="inline-block px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-[#F3EDE2] text-[#29211C] text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.08em] sm:tracking-widest hover:bg-[#E4DACC] transition-colors font-sans"
              >
                Book a Table
              </Link>
            </div>

            {/* Enquiry */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-2 sm:mb-3 md:mb-4 font-serif">
                Have a Question?
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-4 sm:mb-6 md:mb-8 font-sans">
                We'd love to hear from you. Send us an enquiry anytime.
              </p>

              <Link
                href="/enquiry"
                className="inline-block px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 border-2 border-white text-white text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.08em] sm:tracking-widest hover:bg-white hover:text-[#29211C] transition-colors font-sans"
              >
                Send Enquiry
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Location / Contact */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F4F0E8] dark:bg-[#24211E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-light text-[#302923] dark:text-white mb-3 sm:mb-4 font-serif">
              Visit Us
            </h2>

            <p className="text-sm sm:text-base text-[#766C63] dark:text-gray-300 max-w-2xl mx-auto font-sans">
              Visit us at our cozy location
            </p>
          </div>

          <div className="max-w-4xl mx-auto">

            {/* Large Map */}
            <div className="h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg mb-4 sm:mb-6 md:mb-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.047940368783!2d85.3123859!3d27.6919288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18f8c8a0e3eb%3A0x5e4b9c8a5e4b9c8a!2sSankhamul%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cherdung Cafe Location - Sankhamul, Kathmandu"
              />
            </div>

            {/* Address and Get Directions */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#76503A]" />

                <p className="text-base sm:text-lg text-[#302923] dark:text-white font-medium font-sans">
                  Sankhamul, Kathmandu
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Sankhamul,Kathmandu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3 bg-[#76503A] text-white text-xs sm:text-sm uppercase tracking-widest hover:bg-[#5F422F] transition-colors font-sans"
              >
                Get Directions
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
