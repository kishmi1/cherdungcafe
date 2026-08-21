import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Utensils, Calendar, CakeSlice, Truck, ShoppingBag, ArrowRight, Check } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Our Services - Cherdung Café",
  description: "Discover our café services including specialty coffee, dine-in, takeaway, catering, private events, and fresh bakery items.",
  openGraph: {
    title: "Our Services - Cherdung Café",
    description: "From specialty coffee to private events, we offer everything you need for a perfect café experience.",
  },
}

const iconMap: Record<string, any> = {
  coffee: Coffee,
  utensils: Utensils,
  calendar: Calendar,
  cake: CakeSlice,
  truck: Truck,
  shopping: ShoppingBag,
  takeaway: ShoppingBag,
  bakery: CakeSlice,
  events: Calendar,
  users: Calendar,
  wifi: Calendar,
}

async function getServices() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
    return services
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

export default async function ServicesPage() {
  const services = await getServices()

  // Fallback services if database is empty
  const fallbackServices = [
    {
      id: 1,
      title: "Specialty Coffee",
      description: "Freshly brewed coffee crafted by our baristas using quality beans.",
      icon: "coffee",
      priceNote: "Starting from $3.50"
    },
    {
      id: 2,
      title: "Dine-In Experience",
      description: "Enjoy delicious food and drinks in our warm and comfortable space.",
      icon: "utensils",
      priceNote: "No minimum order"
    },
    {
      id: 3,
      title: "Takeaway",
      description: "Freshly prepared meals and beverages, ready to enjoy wherever you go.",
      icon: "shopping",
      priceNote: "Ready in 5 minutes"
    },
    {
      id: 4,
      title: "Bakery & Fresh Bakes",
      description: "Fresh pastries, cakes, muffins and other delicious baked treats.",
      icon: "cake",
      priceNote: "Daily from 7am"
    },
    {
      id: 5,
      title: "Catering",
      description: "Food and beverage service for meetings, gatherings and special occasions.",
      icon: "truck",
      priceNote: "Custom quotes available"
    },
    {
      id: 6,
      title: "Private Events",
      description: "A cozy space for birthdays, celebrations, meetings and private gatherings.",
      icon: "calendar",
      priceNote: "Requires booking"
    }
  ]

  const displayServices = services.length > 0 ? services : fallbackServices

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-16" style={{ backgroundColor: '#F7F4EF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#292522' }}>Our Services</h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#756E68' }}>
              More than just coffee — an experience crafted for you.
            </p>
          </div>
        </div>
      </section>

      {/* All Services */}
      <section className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#292522' }}>All Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Coffee
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow" style={{ border: '1px solid #E7DED4' }}>
                  <CardContent className="p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: '#F7F4EF', border: '1px solid #E7DED4' }}>
                          <IconComponent className="h-8 w-8" style={{ color: '#7A4E2D' }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2" style={{ color: '#292522' }}>{service.title}</h3>
                          <p className="mb-3" style={{ color: '#756E68' }}>{service.description}</p>
                          {service.priceNote && (
                            <p className="font-medium text-sm" style={{ color: '#7A4E2D' }}>{service.priceNote}</p>
                          )}
                        </div>
                      </div>
                      <Link 
                        href="/enquiry"
                        className="inline-flex items-center gap-2 font-medium mt-auto"
                        style={{ color: '#7A4E2D' }}
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Service / Experience */}
      <section className="py-16" style={{ backgroundColor: '#F7F4EF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#292522' }}>Made for Every Moment</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div 
                className="aspect-[4/3] bg-cover bg-center rounded-lg shadow-2xl"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=90")',
                }}
              />
            </div>
            <div>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#756E68' }}>
                Whether you're meeting friends, working remotely, grabbing a quick coffee, or celebrating something special, Cherdung Cafe has a space and experience for you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                  <span style={{ color: '#292522' }}>Freshly prepared food</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                  <span style={{ color: '#292522' }}>Quality coffee</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                  <span style={{ color: '#292522' }}>Comfortable atmosphere</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5" style={{ color: '#7A4E2D' }} />
                  <span style={{ color: '#292522' }}>Friendly service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Serve You */}
      <section className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#292522' }}>How We Serve You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-4" style={{ color: '#7A4E2D' }}>01</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#292522' }}>Choose</h3>
              <p style={{ color: '#756E68' }}>Explore our food, coffee and services.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-4" style={{ color: '#7A4E2D' }}>02</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#292522' }}>Enjoy</h3>
              <p style={{ color: '#756E68' }}>Relax and enjoy your time at Cherdung Cafe.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-4" style={{ color: '#7A4E2D' }}>03</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#292522' }}>Experience</h3>
              <p style={{ color: '#756E68' }}>Make your visit memorable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Private Events / Catering CTA */}
      <section className="py-16 text-white" style={{ backgroundColor: '#2B211B' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Planning Something Special?</h2>
          <p className="mb-8 max-w-2xl mx-auto text-lg" style={{ color: '#E7DED4' }}>
            Let us make your next gathering memorable with delicious food, great coffee and a welcoming atmosphere.
          </p>
          <Link 
            href="/enquiry"
            className="inline-block px-8 py-4 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
          >
            Enquire Now
          </Link>
        </div>
      </section>
    </div>
  )
}