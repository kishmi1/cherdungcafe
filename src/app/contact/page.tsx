"use client"

import { MapPin, Send } from "lucide-react"
import Link from "next/link"
import { FAQPageSchema } from "@/components/structured-data"
import ContactForm from "./contact-form"
import { useSettings } from "@/lib/use-settings"
import SocialMediaIcons from "@/components/social-media-icons"

export default function ContactPage() {
  const { settings } = useSettings()
  const faqs = [
    {
      question: "Do you take reservations?",
      answer: "We don't take reservations for regular dining, but you can book our private event space for special occasions. Contact us for more details."
    },
    {
      question: "Do you offer Wi-Fi?",
      answer: "Yes! We offer free Wi-Fi for all customers. Perfect for working remotely or studying."
    },
    {
      question: "Are you wheelchair accessible?",
      answer: "Yes, our café is fully wheelchair accessible with accessible seating and restrooms."
    },
    {
      question: "Do you cater to dietary restrictions?",
      answer: "We offer vegetarian, vegan, and gluten-free options. Please inform our staff of any allergies or dietary requirements."
    }
  ]

  return (
    <div className="flex flex-col">
      <FAQPageSchema faqs={faqs} />
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Get in touch with us for questions, feedback, or just to say hello
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {settings?.contactAddress || "Sankhamul\nKathmandu 44600\nNepal"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <SocialMediaIcons 
                  settings={settings} 
                  variant="boxed"
                  iconClassName="h-6 w-6"
                />
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Visit Us</h2>
              <div className="rounded-lg overflow-hidden h-96 shadow-lg mb-6">
                <iframe
                  src={settings?.googleMapsEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.047940368783!2d85.3123859!3d27.6919288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18f8c8a0e3eb%3A0x5e4b9c8a5e4b9c8a!2sSankhamul%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Cherdung Cafe Location"
                />
              </div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-amber-600" />
                <p className="text-lg text-gray-900 font-medium">Sankhamul, Kathmandu</p>
              </div>
              <a
                href="https://maps.google.com/?q=Sankhamul,Kathmandu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-100 text-black text-sm uppercase tracking-widest hover:bg-amber-200 transition-colors"
              >
                <Send className="h-4 w-4" />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600">
                Have a question or feedback? Fill out the form below and we'll get back to you soon.
              </p>
            </div>

            <ContactForm />

            <p className="text-center text-sm text-gray-500 mt-6">
              Or use our <Link href="/enquiry" className="text-amber-600 hover:text-amber-700">detailed enquiry form</Link> for more comprehensive requests.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Do you take reservations?</h3>
                <p className="text-gray-600 text-sm">
                  We don't take reservations for regular dining, but you can book our private event space for special occasions. Contact us for more details.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer Wi-Fi?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! We offer free Wi-Fi for all customers. Perfect for working remotely or studying.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Are you wheelchair accessible?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, our café is fully wheelchair accessible with accessible seating and restrooms.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Do you cater to dietary restrictions?</h3>
                <p className="text-gray-600 text-sm">
                  We offer vegetarian, vegan, and gluten-free options. Please inform our staff of any allergies or dietary requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}