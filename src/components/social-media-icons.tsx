import { Share2 } from "lucide-react"
import { Settings } from "@/lib/use-settings"

interface SocialMediaIconsProps {
  settings?: Settings
  className?: string
  iconClassName?: string
  variant?: "default" | "boxed"
}

export default function SocialMediaIcons({ settings, className = "", iconClassName = "h-5 w-5", variant = "default" }: SocialMediaIconsProps) {
  const socialFacebook = settings?.socialFacebook || "#"
  const socialInstagram = settings?.socialInstagram || "#"
  const socialTwitter = settings?.socialTwitter || "#"
  const socialWhatsApp = settings?.socialWhatsApp || "#"
  const socialTikTok = settings?.socialTikTok || "#"

  const socialLinks = [
    { href: socialFacebook, label: "Facebook" },
    { href: socialInstagram, label: "Instagram" },
    { href: socialTwitter, label: "Twitter" },
    { href: socialWhatsApp, label: "WhatsApp" },
    { href: socialTikTok, label: "TikTok" },
  ]

  if (variant === "boxed") {
    return (
      <div className={`flex space-x-4 ${className}`}>
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="bg-gray-100 p-3 rounded-lg hover:bg-amber-100 transition-colors"
            aria-label={link.label}
          >
            <Share2 className={`${iconClassName} text-gray-700 hover:text-amber-600`} />
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex space-x-4 ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-gray-400 hover:text-amber-400 transition-colors"
          aria-label={link.label}
        >
          <Share2 className={iconClassName} />
        </a>
      ))}
    </div>
  )
}