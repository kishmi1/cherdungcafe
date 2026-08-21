import Link from "next/link"
import { MapPin, Coffee, Heart, Leaf, Star, Users, Utensils, Calendar, Gift } from "lucide-react"
import { prisma } from "@/lib/prisma"

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

export default async function AboutPage() {
  const galleryImages = await getGalleryImages()
  return (
    <div className="flex flex-col">
      {/* About Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80")',
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-wide">About Cherdung Cafe</h1>
          <p className="text-2xl md:text-3xl text-gray-200 mb-4 max-w-3xl">Where great coffee, delicious food, and warm moments come together.</p>
          <p className="text-lg text-gray-300 max-w-2xl">हाम्रो कफेमा राम्रो कफी, स्वादिष्ट खाना र मनको गहिराइसम्म पुग्ने अनुभवहरू।</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Cherdung Cafe कसरी सुरु भयो? किन सुरु गरियो?</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">कसरी सुरु भयो?</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Cherdung Cafe was created as a welcoming space where people can enjoy quality coffee, delicious food, and meaningful moments. Starting from a simple idea to bring people together, we transformed our passion for great coffee and warm hospitality into a reality.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  हाम्रो सुरुवात सानो अनुभवबाट भयो - मानिसहरूलाई एउटा यस्तो ठाउँ दिने जहाँ तिनीहरू राम्रो कफी, स्वादिष्ट खाना र मनको गहिराइसम्म पुग्ने अनुभवहरू पाउन सक्छन्।
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">किन सुरु गरियो?</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We started Cherdung Cafe because we believe that everyone deserves a space where they can relax, connect, and enjoy life's simple pleasures. We wanted to create more than just a café – we wanted to build a community hub where memories are made and relationships flourish.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  हामीले यो कफे सुरु गर्यौं किनकि हामी विश्वास गर्छौं कि हरेक मानिसलाई एउटा यस्तो ठाउँ चाहिन्छ जहाँ तिनीहरू आराम गर्न, जोड्न र जीवनका साना खुशीहरू मनाउन सक्छन्।
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our vision is to become the heart of our community – a place where people from all walks of life come together to share moments, ideas, and warmth. We strive to set the standard for quality coffee and exceptional hospitality while maintaining our commitment to sustainability and local partnerships.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  हाम्रो दृष्टि हाम्रो समुदायको मुटु बन्नु हो - एउटा ठाउँ जहाँ सबै तहका मानिसहरू भेला हुन्छन्, अनुभवहरू साझा गर्छन्, र एक-अर्कालाई समर्थन गर्छन्।
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Local Community Connection</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Cherdung Cafe is deeply rooted in our local community. We source ingredients from nearby farmers, support local artisans, and create a space where neighbors become friends. From hosting small events to providing a cozy spot for students and professionals, we're proud to be part of the fabric that makes our community special.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Cherdung Cafe हाम्रो स्थानीय समुदायसँग गहिरो रूपमा जोडिएको छ। हामी नजिकैका किसानहरूबाट सामग्रीहरू ल्याउँछौं, स्थानीय कारीगरहरूलाई समर्थन गर्छौं, र छिमेकीहरू मित्र बन्ने ठाउँ सिर्जना गर्छौं।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="bg-amber-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Our Philosophy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">What drives us every day</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Coffee className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Quality First</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                राम्रो coffee र fresh ingredients
              </p>
              <p className="text-gray-600 leading-relaxed">
                We never compromise on quality. From our carefully selected coffee beans to our fresh, locally sourced ingredients, every element is chosen with care to ensure the best possible experience for our customers.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Made with Care</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                प्रत्येक customer लाई राम्रो experience
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every cup of coffee, every dish we serve, and every interaction with our customers is infused with genuine care and attention. We believe that small details make the biggest difference in creating memorable experiences.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Leaf className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">A Place to Belong</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                आरामदायी र friendly environment
              </p>
              <p className="text-gray-600 leading-relaxed">
                Cherdung Cafe is more than just a place to grab coffee – it's a space where you belong. Whether you're staying for hours or just minutes, we want you to feel comfortable, welcomed, and valued.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">The Cherdung Cafe experience</p>
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
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                  <Utensils className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Freshly Prepared Food</h3>
                  <p className="text-gray-600">Every dish is made to order using the freshest ingredients, ensuring maximum flavor and quality in every bite.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                  <Coffee className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Carefully Selected Coffee</h3>
                  <p className="text-gray-600">We source our beans from the finest coffee-growing regions, expertly roasted to bring out the perfect flavor profile.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                  <Leaf className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Comfortable Atmosphere</h3>
                  <p className="text-gray-600">Our space is designed to be your second home – cozy, welcoming, and perfect for work, relaxation, or socializing.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Friendly Service</h3>
                  <p className="text-gray-600">Our team genuinely cares about your experience, providing warm, personalized service that makes you feel valued.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Attention to Detail</h3>
                  <p className="text-gray-600">From the temperature of your coffee to the presentation of your food, we obsess over the details that matter.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Menu/Experience Section */}
      <section className="bg-amber-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Our Menu & Experience</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">More than just food – it's the complete Cherdung experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Coffee className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Specialty Coffee</h3>
              <p className="text-gray-600">Expertly crafted espresso drinks, pour-over coffee, and signature beverages made with premium beans.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Utensils className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fresh Food</h3>
              <p className="text-gray-600">From hearty breakfasts to light lunches and delicious dinners, our menu features dishes made with love.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Star className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Desserts</h3>
              <p className="text-gray-600">Indulge in our selection of freshly baked pastries, cakes, and sweet treats perfect for any time of day.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Casual Meetings</h3>
              <p className="text-gray-600">A perfect spot for business meetings, study sessions, or casual catch-ups with friends and colleagues.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Family & Friends</h3>
              <p className="text-gray-600">Create lasting memories with family gatherings, birthday celebrations, and quality time together.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Small Events</h3>
              <p className="text-gray-600">Host intimate gatherings, workshops, or small celebrations in our warm and welcoming space.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Quality</h3>
              <p className="text-gray-600">We never compromise on excellence in every aspect of our business.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Hospitality</h3>
              <p className="text-gray-600">Every guest is treated like family with warmth and genuine care.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Freshness</h3>
              <p className="text-gray-600">Daily preparation using the freshest ingredients available.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">Building connections and supporting our local neighborhood.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cafe Gallery Section */}
      <section className="bg-amber-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Cafe Gallery</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Moments that make Cherdung Cafe special</p>
          </div>
          
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div 
                  key={image.id}
                  className="aspect-square bg-cover bg-center rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  style={{
                    backgroundImage: `url("${image.url}")`,
                  }}
                  title={image.caption || ''}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No gallery images available yet.</p>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              <span>Coffee Making</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Cafe Interior</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              <span>Food & Drinks</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Our Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* Community/Local Connection Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Community Connection</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">How Cherdung Cafe supports and celebrates our local community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-amber-50 p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Gift className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Local Sourcing</h3>
              </div>
              <p className="text-gray-600">
                We partner with local farmers, bakers, and artisans to source ingredients and products. This not only ensures freshness but also supports our local economy and reduces our carbon footprint.
              </p>
            </div>
            
            <div className="bg-amber-50 p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Community Events</h3>
              </div>
              <p className="text-gray-600">
                From local artist showcases to book clubs and community meetings, Cherdung Cafe serves as a gathering place for meaningful connections and cultural exchange.
              </p>
            </div>
            
            <div className="bg-amber-50 p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Supporting Local Causes</h3>
              </div>
              <p className="text-gray-600">
                We regularly contribute to local charities, schools, and community initiatives. A portion of our proceeds goes back into making our neighborhood a better place for everyone.
              </p>
            </div>
            
            <div className="bg-amber-50 p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Creating Opportunities</h3>
              </div>
              <p className="text-gray-600">
                We provide employment opportunities for local residents and offer training programs to help young people develop valuable skills in hospitality and customer service.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-6">
              Cherdung Cafe is more than a business – we're proud members of this community, committed to growing together and creating positive change.
            </p>
            <p className="text-gray-600">
              हामी समुदायको लागि प्रतिबद्ध छौं - साथमा बढ्दै र सकारात्मक परिवर्तन ल्याउँदै।
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Visit Us Button */}
      <div className="lg:hidden bg-amber-50 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/contact"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            <MapPin className="h-5 w-5" />
            Visit Us
          </Link>
        </div>
      </div>
    </div>
  )
}