import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/staff/", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin/", "/staff/", "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/admin/", "/staff/", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin/", "/staff/", "/api/"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/admin/", "/staff/", "/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/admin/", "/staff/", "/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/admin/", "/staff/", "/api/"],
      },
    ],
    sitemap: "https://cherdungcafe.vercel.app/sitemap.xml",
  }
}