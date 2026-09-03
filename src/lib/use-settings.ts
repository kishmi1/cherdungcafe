import { useState, useEffect } from 'react'

export interface Settings {
  id?: number
  siteName: string
  siteDescription?: string
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  socialFacebook?: string
  socialInstagram?: string
  socialTwitter?: string
  socialLinkedIn?: string
  openingHours?: string
  businessHours?: string
  seoTitle?: string
  seoDescription?: string
  logoUrl?: string
  faviconUrl?: string
  googleMapsEmbed?: string
  themeColor: string
  accentColor: string
  backgroundColor: string
  logoSize?: string
  createdAt?: string
  updatedAt?: string
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'Cherdung Café',
    themeColor: '#B68A52',
    accentColor: '#7A4E2D',
    backgroundColor: '#F7F4EF',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/public/settings')
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, isLoading }
}