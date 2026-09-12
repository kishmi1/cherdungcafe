import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Settings } from "@/lib/use-settings"
import SocialMediaIcons from "@/components/social-media-icons"

interface FooterProps {
  settings?: Settings
}

export default function Footer({ settings }: FooterProps) {
  const siteName = settings?.siteName || "CHERDUNG CAFE"
  const logoUrl = settings?.logoUrl || ""
  const siteDescription = settings?.siteDescription || "Your neighborhood café serving specialty coffee, delicious food, and memorable experiences."
  const contactAddress = settings?.contactAddress || "Sankhamul, Kathmandu"
  const contactPhone = settings?.contactPhone || "+1 (555) 123-4567"
  const contactEmail = settings?.contactEmail || "cherdungcafe@gmail.com"
  const openingHours = settings?.openingHours || "Mon-Fri: 7am-8pm<br />Sat-Sun: 8am-9pm"

  return (
    <footer className="bg-black dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            {logoUrl ? (
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={logoUrl} 
                  alt={siteName} 
                  className="h-16 w-auto object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-[0.12em] italic bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-serif">
                    cherdung
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="h-px bg-white flex-1"></span>
                    <span className="text-white text-xs font-medium tracking-[0.2em] font-sans">
                     CAFE
                    </span>
                    <span className="h-px bg-white flex-1"></span>
                  </div>
                </div>
              </div>
            ) : (
              <h2 className="text-2xl font-light tracking-[0.12em] mb-4 font-serif">{siteName}</h2>
            )}
            <p className="text-gray-400 text-sm leading-relaxed font-sans tracking-wide">
              {siteDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] mb-4 text-amber-400 font-sans font-medium">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm font-sans tracking-wide">Services</Link></li>
              <li><Link href="/offers" className="text-gray-400 hover:text-white transition-colors text-sm font-sans tracking-wide">Offers</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-white transition-colors text-sm font-sans tracking-wide">Gallery</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm font-sans tracking-wide">Blog</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm font-sans tracking-wide">About</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm font-sans tracking-wide">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] mb-4 text-amber-400 font-sans font-medium">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-amber-400 mt-0.5" />
                <span className="text-gray-400 text-sm font-sans tracking-wide">{contactAddress}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-amber-400" />
                <span className="text-gray-400 text-sm font-sans tracking-wide">{contactPhone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-amber-400" />
                <span className="text-gray-400 text-sm font-sans tracking-wide">{contactEmail}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-amber-400 mt-0.5" />
                <span className="text-gray-400 text-sm font-sans tracking-wide" dangerouslySetInnerHTML={{ __html: openingHours }}></span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] mb-4 text-amber-400 font-sans font-medium">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4 font-sans tracking-wide">Subscribe for updates and special offers.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-800 text-white text-sm border border-gray-700 focus:border-amber-400 focus:outline-none font-sans tracking-wide"
              />
              <button className="px-4 py-2 bg-amber-400 text-black text-sm uppercase tracking-[0.12em] hover:bg-amber-300 transition-colors font-sans font-medium">
                Join
              </button>
            </form>
            
            {/* Social Media Icons */}
            <div className="mt-6">
              <SocialMediaIcons settings={settings} />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p className="font-sans">&copy; 2026 {siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}