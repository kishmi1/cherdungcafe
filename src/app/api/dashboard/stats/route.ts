import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    const [
      totalServices,
      activeOffers,
      galleryImages,
      blogPosts,
      newEnquiries,
      recentServices,
      recentOffers,
      recentGalleryImages,
      recentBlogPosts,
      recentEnquiries,
    ] = await Promise.all([
      prisma.service.count(),
      prisma.offer.count({
        where: {
          startsAt: { lte: now },
          endsAt: { gte: now },
        },
      }),
      prisma.galleryImage.count(),
      prisma.blogPost.count(),
      prisma.enquiry.count({ where: { status: "NEW" } }),
      prisma.service.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { title: true, createdAt: true },
      }),
      prisma.offer.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { title: true, createdAt: true },
      }),
      prisma.galleryImage.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { caption: true, category: true, createdAt: true },
      }),
      prisma.blogPost.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { title: true, createdAt: true },
      }),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { subject: true, createdAt: true },
      }),
    ])

    const recentActivities = [
      ...recentServices.map((service) => ({
        action: "New service added",
        item: service.title,
        createdAt: service.createdAt,
      })),
      ...recentOffers.map((offer) => ({
        action: "New offer added",
        item: offer.title,
        createdAt: offer.createdAt,
      })),
      ...recentGalleryImages.map((image) => ({
        action: "New gallery image added",
        item: image.caption || image.category || "Gallery image",
        createdAt: image.createdAt,
      })),
      ...recentBlogPosts.map((post) => ({
        action: "New blog post created",
        item: post.title,
        createdAt: post.createdAt,
      })),
      ...recentEnquiries.map((enquiry) => ({
        action: "New enquiry received",
        item: enquiry.subject,
        createdAt: enquiry.createdAt,
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)

    return NextResponse.json({
      totalServices,
      activeOffers,
      galleryImages,
      blogPosts,
      newEnquiries,
      recentActivities,
    })
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    )
  }
}
