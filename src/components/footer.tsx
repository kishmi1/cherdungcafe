import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Share2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-light tracking-wider mb-4">CHERDUNG CAFE</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your neighborhood café serving specialty coffee, delicious food, and memorable experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm">Services</Link></li>
              <li><Link href="/offers" className="text-gray-400 hover:text-white transition-colors text-sm">Offers</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-white transition-colors text-sm">Gallery</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-4 text-amber-400">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-amber-400 mt-0.5" />
                <span className="text-gray-400 text-sm">Sankhamul, Kathmandu</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-amber-400" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-amber-400" />
                <span className="text-gray-400 text-sm">cherdungcafe@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-amber-400 mt-0.5" />
                <span className="text-gray-400 text-sm">Mon-Fri: 7am-8pm<br />Sat-Sun: 8am-9pm</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-4 text-amber-400">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe for updates and special offers.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-800 text-white text-sm border border-gray-700 focus:border-amber-400 focus:outline-none"
              />
              <button className="px-4 py-2 bg-amber-400 text-black text-sm uppercase tracking-wider hover:bg-amber-300 transition-colors">
                Join
              </button>
            </form>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors" aria-label="Facebook">
                <Share2 className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors" aria-label="Instagram">
                <Share2 className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors" aria-label="Twitter">
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2026 Cherdung Café. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}