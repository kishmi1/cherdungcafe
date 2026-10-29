import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

async function checkAdminAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get('adminSession')
  
  if (!sessionCookie) {
    return null
  }

  let sessionData
  try {
    sessionData = JSON.parse(sessionCookie.value)
  } catch (error) {
    return null
  }

  if (!sessionData.userId || !sessionData.role || sessionData.role !== 'ADMIN') {
    return null
  }

  return sessionData
}

export async function GET(request: NextRequest) {
  try {
    const sessionData = await checkAdminAuth(request)
    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || '7' // Default to 7 days

    const now = new Date()

    // Get sales data based on date range
    const days = parseInt(dateRange)
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    const dateRangeData = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      dateRangeData.push(date)
    }

    const dailySales = await Promise.all(
      dateRangeData.map(async (date) => {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0))
        const endOfDay = new Date(date.setHours(23, 59, 59, 999))
        
        const orders = await prisma.order.findMany({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          },
          select: { totalAmount: true }
        })
        
        const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        
        return {
          name: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          sales: Math.round(totalSales)
        }
      })
    )

    // Get order status data
    const orders = await prisma.order.findMany({
      select: { status: true, totalAmount: true, createdAt: true, customerName: true, email: true, id: true },
      orderBy: { createdAt: "desc" },
      take: 10
    })

    const orderStatusData = [
      { name: "Delivered", value: 0, color: "#7A4E2D" },
      { name: "Processing", value: 0, color: "#B68A52" },
      { name: "Pending", value: 0, color: "#D4C4A8" },
      { name: "Cancelled", value: 0, color: "#E7DED4" }
    ]

    orders.forEach(order => {
      const statusIndex = orderStatusData.findIndex(s => s.name.toLowerCase() === order.status?.toLowerCase())
      if (statusIndex !== -1) {
        orderStatusData[statusIndex].value++
      }
    })

    const totalOrders = orders.length
    const orderStatusDataWithPercentage = orderStatusData.map(item => ({
      ...item,
      value: totalOrders > 0 ? Math.round((item.value / totalOrders) * 100) : 0
    }))

    // Get recent orders for display
    const recentOrders = orders.slice(0, 5).map(order => ({
      id: order.id,
      customerName: order.customerName || "Unknown",
      customerEmail: order.email || "",
      totalAmount: order.totalAmount || 0,
      status: order.status || "Pending",
      createdAt: order.createdAt
    }))

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

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
      dailySales,
      orderStatusData: orderStatusDataWithPercentage,
      totalOrders,
      recentOrders,
      totalRevenue
    })
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    )
  }
}
