import Link from "next/link"
import { Coffee, Utensils, Calendar, Users, Wifi, MapPin, ArrowRight, ArrowDown, Star } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  // Fetch services from database
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })

  // Fetch featured offers from database
  const now = new Date()
  const featuredOffers = await prisma.offer.findMany({
    where: {
      AND: [
        { isFeatured: true },
        { startsAt: { lte: now } },
        { endsAt: { gte: now } }
      ]
    },
    orderBy: { startsAt: 'asc' },
    take: 2
  })

  // Fetch gallery images for preview
  const galleryImages = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: 'asc' },
    take: 6
  })

  // Map icon names to Lucide components
  const iconMap: Record<string, any> = {
    coffee: Coffee,
    utensils: Utensils,
    calendar: Calendar,
    users: Users,
    wifi: Wifi,
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] bg-black">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=90")',
          }}
        />
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-wide">
            A Taste of Warmth,<br />A Place to Belong.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
            Fresh coffee. Good food. Warm moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/services"
              className="px-8 py-4 bg-amber-100 text-black text-sm uppercase tracking-widest hover:bg-amber-200 transition-colors"
            >
              Explore Menu
            </Link>
            <Link 
              href="/enquiry"
              className="px-8 py-4 border-2 border-white text-white text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Book a Table
            </Link>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 animate-bounce">
            <ArrowDown className="h-8 w-8 text-white" />
          </div>
        </div>
      </section>

      {/* Welcome / About Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Cafe Image */}
            <div className="relative">
              <div 
                className="aspect-[4/3] bg-cover bg-center rounded-lg shadow-2xl"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=90")',
                }}
              />
            </div>
            
            {/* Right: Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6">
                Welcome to Cherdung Cafe
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                More than just a café, Cherdung Cafe is your community space where quality coffee meets culinary excellence. We're passionate about creating moments that matter – from your morning espresso to evening gatherings with friends.
              </p>
              <Link 
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-100 text-black text-sm uppercase tracking-widest hover:bg-amber-200 transition-colors"
              >
                Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 bg-amber-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4">Our Services</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Everything you need for the perfect café experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Coffee
              return (
                <div key={service.id} className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <IconComponent className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                  {service.priceNote && (
                    <p className="text-amber-600 text-sm mt-2 font-medium">{service.priceNote}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Menu */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4">Popular Menu</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Customer favorites you'll love</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group">
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Coffee className="h-16 w-16 text-amber-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Signature Espresso</h3>
              <p className="text-amber-600 font-semibold mb-2">$4.50</p>
            </div>
            
            <div className="group">
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Utensils className="h-16 w-16 text-amber-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Avocado Toast</h3>
              <p className="text-amber-600 font-semibold mb-2">$8.50</p>
            </div>
            
            <div className="group">
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-amber-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Grilled Chicken</h3>
              <p className="text-amber-600 font-semibold mb-2">$15.00</p>
            </div>
            
            <div className="group">
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Coffee className="h-16 w-16 text-amber-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Tiramisu</h3>
              <p className="text-amber-600 font-semibold mb-2">$7.00</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-3 bg-amber-100 text-black text-sm uppercase tracking-widest hover:bg-amber-200 transition-colors"
            >
              View Full Menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-4">Today's Special</h2>
            <p className="text-amber-100 max-w-2xl mx-auto">Limited time offers you don't want to miss</p>
          </div>
          
          {featuredOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredOffers.map((offer) => (
                <div key={offer.id} className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold">{offer.title}</h3>
                    {offer.discount && (
                      <span className="bg-white text-amber-600 px-3 py-1 rounded-full text-sm font-bold">
                        {offer.discount}
                      </span>
                    )}
                  </div>
                  <p className="text-amber-100 mb-4">{offer.description}</p>
                  {offer.promoCode && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded bg-white/20">
                      <span className="text-sm font-mono font-bold">{offer.promoCode}</span>
                    </div>
                  )}
                  <p className="text-sm text-amber-200">
                    Valid until: {new Date(offer.endsAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-amber-100 text-lg">No featured offers at the moment. Check back soon!</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              href="/offers"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-amber-600 text-sm uppercase tracking-widest hover:bg-amber-50 transition-colors"
            >
              View All Offers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4">Why Choose Cherdung Cafe</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">What makes us different</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quality Coffee</h3>
              <p className="text-gray-600 dark:text-gray-300">Premium beans, expert baristas</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600 dark:text-gray-300">Locally sourced, organic when possible</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cozy Atmosphere</h3>
              <p className="text-gray-600 dark:text-gray-300">Warm, welcoming environment</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Friendly Service</h3>
              <p className="text-gray-600 dark:text-gray-300">Attentive, personalized care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-amber-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4">Our Gallery</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">A glimpse into our world</p>
          </div>
          
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.caption || 'Gallery image'}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="aspect-square bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg flex items-center justify-center">
                <Coffee className="h-8 w-8 text-amber-600" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg flex items-center justify-center">
                <Utensils className="h-8 w-8 text-amber-600" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg flex items-center justify-center">
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg flex items-center justify-center">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg flex items-center justify-center">
                <Coffee className="h-8 w-8 text-amber-600" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg flex items-center justify-center">
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              href="/gallery"
              className="inline-flex items-center gap-2 px-8 py-3 bg-amber-100 text-black text-sm uppercase tracking-widest hover:bg-amber-200 transition-colors"
            >
              View Gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Real reviews from real people</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-amber-50 dark:bg-gray-800 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"Amazing coffee, beautiful atmosphere and excellent service. This is my go-to spot for meetings and relaxation."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-amber-700 font-semibold">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Sarah Mitchell</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Regular Customer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-gray-800 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"The best latte I've ever had. The staff is always friendly and the ambiance is perfect for both work and social."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-amber-700 font-semibold">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">John Davis</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Remote Worker</p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-gray-800 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"Great food, reasonable prices, and the team makes you feel like family. Highly recommend their weekend brunch!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-amber-700 font-semibold">AK</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Emily Chen</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Food Blogger</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-amber-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4">Latest Updates</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Stay connected with our latest news and stories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-4 flex items-center justify-center">
                <Coffee className="h-12 w-12 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">New Summer Menu Launch</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Discover our refreshing seasonal offerings...</p>
              <Link href="/blog" className="text-amber-600 hover:text-amber-700 font-medium text-sm">Read More →</Link>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-4 flex items-center justify-center">
                <Coffee className="h-12 w-12 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Coffee Brewing Tips</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Learn the art of perfect pour-over at home...</p>
              <Link href="/blog" className="text-amber-600 hover:text-amber-700 font-medium text-sm">Read More →</Link>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-4 flex items-center justify-center">
                <Calendar className="h-12 w-12 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community Events</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Join us for music nights and art shows...</p>
              <Link href="/blog" className="text-amber-600 hover:text-amber-700 font-medium text-sm">Read More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation & Enquiry CTA */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Reservation */}
            <div className="text-center">
              <h2 className="text-4xl font-light mb-4">Your Table Is Waiting</h2>
              <p className="text-gray-400 mb-8">Reserve your spot for the perfect dining experience</p>
              <Link 
                href="/enquiry"
                className="inline-block px-8 py-4 bg-amber-100 text-black text-sm uppercase tracking-widest hover:bg-amber-200 transition-colors"
              >
                Book a Table
              </Link>
            </div>
            
            {/* Enquiry */}
            <div className="text-center">
              <h2 className="text-4xl font-light mb-4">Have a Question?</h2>
              <p className="text-gray-400 mb-8">We'd love to hear from you. Send us an enquiry anytime.</p>
              <Link 
                href="/enquiry"
                className="inline-block px-8 py-4 border-2 border-white text-white text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
              >
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Location / Contact */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4">Visit Us</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Visit us at our cozy location</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Large Map */}
            <div className="h-96 rounded-lg overflow-hidden shadow-lg mb-8">
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
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-amber-600" />
                <p className="text-lg text-gray-900 dark:text-white font-medium">Sankhamul, Kathmandu</p>
              </div>
              <a
                href="https://maps.google.com/?q=Sankhamul,Kathmandu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-amber-100 text-black text-sm uppercase tracking-widest hover:bg-amber-200 transition-colors"
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