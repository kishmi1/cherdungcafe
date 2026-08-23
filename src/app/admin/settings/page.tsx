"use client"

import { useState, useEffect } from "react"
import { Save, RefreshCw, Globe, Mail, Phone, MapPin, Palette, Smartphone, Layout, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Cherdung Café',
    siteDescription: 'Your neighborhood café serving delicious coffee and more',
    contactEmail: 'info@cherdungcafe.com',
    contactPhone: '+977-1-1234567',
    contactAddress: 'Sankhamul, Kathmandu 44600, Nepal',
    socialFacebook: '',
    socialInstagram: '',
    socialTwitter: '',
    socialWhatsApp: '',
    socialTikTok: '',
    openingHours: 'Mon-Sun: 7:00 AM - 9:00 PM',
    businessHours: 'Mon-Sun: 7:00 AM - 9:00 PM',
    seoTitle: 'Cherdung Café - Coffee & More',
    seoDescription: 'Welcome to Cherdung Café, your neighborhood café serving delicious coffee, food, and more.',
    logoUrl: '',
    faviconUrl: '',
    googleMapsEmbed: '',
    themeColor: '#B68A52',
    accentColor: '#7A4E2D',
    backgroundColor: '#F7F4EF',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value || '' // Ensure null/undefined becomes empty string
    }))
  }
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      
      // Only update settings if the response is successful and valid
      if (response.ok && data && !data.error) {
        // Convert any null values to empty strings
        const cleanData = {
          siteName: data.siteName || 'Cherdung Café',
          siteDescription: data.siteDescription || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          contactAddress: data.contactAddress || '',
          socialFacebook: data.socialFacebook || '',
          socialInstagram: data.socialInstagram || '',
          socialTwitter: data.socialTwitter || '',
          socialWhatsApp: data.socialWhatsApp || '',
          socialTikTok: data.socialTikTok || '',
          openingHours: data.openingHours || '',
          businessHours: data.businessHours || '',
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          logoUrl: data.logoUrl || '',
          faviconUrl: data.faviconUrl || '',
          googleMapsEmbed: data.googleMapsEmbed || '',
          themeColor: data.themeColor || '#B68A52',
          accentColor: data.accentColor || '#7A4E2D',
          backgroundColor: data.backgroundColor || '#F7F4EF',
        }
        setSettings(cleanData)
      } else {
        console.error('Invalid settings response:', data)
        setMessage('Failed to load settings: Invalid response from server')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage('')

    try {
      // Clean the settings data before sending - only include valid settings fields
      const cleanSettings = {
        siteName: settings.siteName || 'Cherdung Café',
        siteDescription: settings.siteDescription || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        contactAddress: settings.contactAddress || '',
        socialFacebook: settings.socialFacebook || '',
        socialInstagram: settings.socialInstagram || '',
        socialTwitter: settings.socialTwitter || '',
        socialWhatsApp: settings.socialWhatsApp || '',
        socialTikTok: settings.socialTikTok || '',
        openingHours: settings.openingHours || '',
        businessHours: settings.businessHours || '',
        seoTitle: settings.seoTitle || '',
        seoDescription: settings.seoDescription || '',
        logoUrl: settings.logoUrl || '',
        faviconUrl: settings.faviconUrl || '',
        googleMapsEmbed: settings.googleMapsEmbed || '',
        themeColor: settings.themeColor || '#B68A52',
        accentColor: settings.accentColor || '#7A4E2D',
        backgroundColor: settings.backgroundColor || '#F7F4EF',
      }

      console.log('Sending settings:', cleanSettings)

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanSettings),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok && data.success) {
        setMessage('Settings saved successfully!')
      } else {
        console.error('Server error:', data)
        const errorMessage = data.details || data.error || 'Unknown error'
        setMessage(`Failed to save settings: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your café's global settings and configurations</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Name</label>
              <Input
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                placeholder="Cherdung Café"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Description</label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Your café description"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <Input
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleInputChange}
                placeholder="info@cherdungcafe.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <Input
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleInputChange}
                placeholder="+977-1-1234567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
              <textarea
                name="contactAddress"
                value={settings.contactAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Sankhamul, Kathmandu 44600, Nepal"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facebook URL</label>
              <Input
                name="socialFacebook"
                value={settings.socialFacebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourcafe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instagram URL</label>
              <Input
                name="socialInstagram"
                value={settings.socialInstagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourcafe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Twitter URL</label>
              <Input
                name="socialTwitter"
                value={settings.socialTwitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourcafe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">WhatsApp URL</label>
              <Input
                name="socialWhatsApp"
                value={settings.socialWhatsApp}
                onChange={handleInputChange}
                placeholder="https://wa.me/yournumber"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TikTok URL</label>
              <Input
                name="socialTikTok"
                value={settings.socialTikTok}
                onChange={handleInputChange}
                placeholder="https://tiktok.com/@yourcafe"
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Business Hours</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Opening Hours (Display)</label>
              <Input
                name="openingHours"
                value={settings.openingHours}
                onChange={handleInputChange}
                placeholder="Mon-Sun: 7:00 AM - 9:00 PM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Hours (Internal)</label>
              <Input
                name="businessHours"
                value={settings.businessHours}
                onChange={handleInputChange}
                placeholder="Mon-Sun: 7:00 AM - 9:00 PM"
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SEO Title</label>
              <Input
                name="seoTitle"
                value={settings.seoTitle}
                onChange={handleInputChange}
                placeholder="Cherdung Café - Coffee & More"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SEO Description</label>
              <textarea
                name="seoDescription"
                value={settings.seoDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Your café SEO description"
              />
            </div>
          </div>
        </div>

        {/* Theme Colors */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Theme Colors</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Color</label>
              <div className="flex gap-2">
                <Input
                  name="themeColor"
                  type="color"
                  value={settings.themeColor}
                  onChange={handleInputChange}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={settings.themeColor}
                  onChange={handleInputChange}
                  name="themeColor"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accent Color</label>
              <div className="flex gap-2">
                <Input
                  name="accentColor"
                  type="color"
                  value={settings.accentColor}
                  onChange={handleInputChange}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={settings.accentColor}
                  onChange={handleInputChange}
                  name="accentColor"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background Color</label>
              <div className="flex gap-2">
                <Input
                  name="backgroundColor"
                  type="color"
                  value={settings.backgroundColor}
                  onChange={handleInputChange}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={settings.backgroundColor}
                  onChange={handleInputChange}
                  name="backgroundColor"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media URLs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Media URLs</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo URL</label>
              <Input
                name="logoUrl"
                value={settings.logoUrl}
                onChange={handleInputChange}
                placeholder="https://your-domain.com/logo.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Favicon URL</label>
              <Input
                name="faviconUrl"
                value={settings.faviconUrl}
                onChange={handleInputChange}
                placeholder="https://your-domain.com/favicon.ico"
              />
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Google Maps</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Google Maps Embed URL</label>
              <textarea
                name="googleMapsEmbed"
                value={settings.googleMapsEmbed}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}