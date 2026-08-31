"use client"

import { useState } from "react"
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function BookATablePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfGuests: "",
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: "",
    specialRequest: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")
  const [reservationDetails, setReservationDetails] = useState<any>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[+]?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.numberOfGuests) {
      newErrors.numberOfGuests = "Number of guests is required"
    } else if (parseInt(formData.numberOfGuests) < 1 || parseInt(formData.numberOfGuests) > 20) {
      newErrors.numberOfGuests = "Number of guests must be between 1 and 20"
    }

    if (!formData.reservationDate) {
      newErrors.reservationDate = "Reservation date is required"
    } else {
      const selectedDate = new Date(formData.reservationDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.reservationDate = "Reservation date must be today or in the future"
      }
    }

    if (!formData.reservationTime) {
      newErrors.reservationTime = "Reservation time is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          numberOfGuests: parseInt(formData.numberOfGuests),
          reservationDate: formData.reservationDate,
          reservationTime: formData.reservationTime,
          specialRequest: formData.specialRequest
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setSubmitMessage("Table Reserved Successfully 🎉")
        setReservationDetails({
          reservationId: data.reservationId,
          name: data.reservation.name,
          numberOfGuests: data.reservation.numberOfGuests,
          reservationDate: data.reservation.reservationDate,
          reservationTime: data.reservation.reservationTime
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          numberOfGuests: "",
          reservationDate: "",
          reservationTime: "",
          specialRequest: ""
        })
      } else {
        setSubmitStatus("error")
        setSubmitMessage(data.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Book a Table</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Reserve your spot for the perfect dining experience at Cherdung Cafe
            </p>
          </div>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {submitStatus === "success" && reservationDetails && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900 text-lg">{submitMessage}</h3>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 mt-4 border border-green-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reservation ID:</span>
                      <span className="font-semibold text-gray-900">{reservationDetails.reservationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold text-gray-900">{reservationDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Guests:</span>
                      <span className="font-semibold text-gray-900">{reservationDetails.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(reservationDetails.reservationDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-semibold text-gray-900">{reservationDetails.reservationTime}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-green-700 mt-4">
                  We've sent a confirmation to your email. Please arrive 10 minutes before your reservation time.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">Reservation Error</h3>
                    <p className="text-red-700 text-sm">{submitMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="numberOfGuests"
                      name="numberOfGuests"
                      value={formData.numberOfGuests}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white ${
                        errors.numberOfGuests ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select guests</option>
                      {[...Array(20)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.numberOfGuests && <p className="text-red-600 text-sm mt-1">{errors.numberOfGuests}</p>}
                </div>
                <div>
                  <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Reservation Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      id="reservationDate"
                      name="reservationDate"
                      value={formData.reservationDate}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        errors.reservationDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.reservationDate && <p className="text-red-600 text-sm mt-1">{errors.reservationDate}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="reservationTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Reservation Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="reservationTime"
                    name="reservationTime"
                    value={formData.reservationTime}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white ${
                      errors.reservationTime ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                </div>
                {errors.reservationTime && <p className="text-red-600 text-sm mt-1">{errors.reservationTime}</p>}
              </div>

              <div>
                <label htmlFor="specialRequest" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Request (Optional)
                </label>
                <textarea
                  id="specialRequest"
                  name="specialRequest"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Any special requests (e.g., dietary requirements, high chair, outdoor seating, etc.)"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Confirm Reservation"}
              </button>
            </form>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Reservation Policy</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Reservations are held for 15 minutes past the scheduled time</li>
                <li>• For parties of 8 or more, please call us directly</li>
                <li>• Cancellations should be made at least 2 hours in advance</li>
                <li>• We reserve the right to cancel reservations for no-shows</li>
              </ul>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Need to <Link href="/contact" className="text-amber-600 hover:text-amber-700">contact us</Link> or have an <Link href="/enquiry" className="text-amber-600 hover:text-amber-700">enquiry</Link>?
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
