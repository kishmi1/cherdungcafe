"use client"

import { useState, useEffect } from "react"
import { Save, RefreshCw, Globe, Mail, Phone, MapPin, Palette, Layout, Image as ImageIcon } from "lucide-react"
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
    socialLinkedIn: '',
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
    logoSize: 'medium',
  })
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value || '' // Ensure null/undefined becomes empty string
    }))
  }

  const handleImageUpload = async (file: File, type: 'logo' | 'favicon') => {
    if (type === 'logo') {
      setIsUploadingLogo(true)
    } else {
      setIsUploadingFavicon(true)
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'cafe-website/settings')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSettings(prev => ({
          ...prev,
          [type === 'logo' ? 'logoUrl' : 'faviconUrl']: data.url
        }))
        setMessage(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully!`)
      } else {
        setMessage(`Failed to upload ${type}: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setMessage(`Failed to upload ${type}`)
    } finally {
      if (type === 'logo') {
        setIsUploadingLogo(false)
      } else {
        setIsUploadingFavicon(false)
      }
    }
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
          socialLinkedIn: data.socialLinkedIn || '',
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
          logoSize: data.logoSize || 'medium',
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
        socialLinkedIn: settings.socialLinkedIn || '',
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
        logoSize: settings.logoSize || 'medium',
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
            <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facebook URL</label>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <Input
                  name="socialFacebook"
                  value={settings.socialFacebook}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/yourcafe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instagram URL</label>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
                <Input
                  name="socialInstagram"
                  value={settings.socialInstagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourcafe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Twitter URL</label>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <Input
                  name="socialTwitter"
                  value={settings.socialTwitter}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/yourcafe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn URL</label>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
                <Input
                  name="socialLinkedIn"
                  value={settings.socialLinkedIn}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/company/yourcafe"
                />
              </div>
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
          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'logo')
                    }}
                    disabled={isUploadingLogo}
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-900 dark:file:text-amber-300"
                  />
                  {isUploadingLogo && (
                    <RefreshCw className="h-5 w-5 animate-spin text-amber-600" />
                  )}
                </div>
                {settings.logoUrl && (
                  <div className="flex items-center gap-3">
                    <img 
                      src={settings.logoUrl} 
                      alt="Logo preview" 
                      className="h-12 w-auto object-contain border border-gray-200 dark:border-gray-700 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, logoUrl: '' }))}
                      className="px-3 py-1 text-sm border border-red-600 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Or enter URL directly:
                </div>
                <Input
                  name="logoUrl"
                  value={settings.logoUrl}
                  onChange={handleInputChange}
                  placeholder="https://your-domain.com/logo.png"
                />
                
                {/* Logo Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo Size</label>
                  <select
                    name="logoSize"
                    value={settings.logoSize || 'medium'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="small">Small (32px)</option>
                    <option value="medium">Medium (48px)</option>
                    <option value="large">Large (64px)</option>
                    <option value="xlarge">Extra Large (80px)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Favicon Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Favicon</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'favicon')
                    }}
                    disabled={isUploadingFavicon}
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-900 dark:file:text-amber-300"
                  />
                  {isUploadingFavicon && (
                    <RefreshCw className="h-5 w-5 animate-spin text-amber-600" />
                  )}
                </div>
                {settings.faviconUrl && (
                  <div className="flex items-center gap-3">
                    <img 
                      src={settings.faviconUrl} 
                      alt="Favicon preview" 
                      className="h-8 w-8 object-contain border border-gray-200 dark:border-gray-700 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, faviconUrl: '' }))}
                      className="px-3 py-1 text-sm border border-red-600 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Or enter URL directly:
                </div>
                <Input
                  name="faviconUrl"
                  value={settings.faviconUrl}
                  onChange={handleInputChange}
                  placeholder="https://your-domain.com/favicon.ico"
                />
              </div>
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