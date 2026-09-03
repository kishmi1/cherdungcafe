import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// GET all blog posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const includeAll = searchParams.get('includeAll') === 'true'
    
    const where: any = {}
    
    if (!includeAll) {
      where.status = 'PUBLISHED'
    } else if (status) {
      where.status = status
    }
    
    if (category) {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' }
    })
    
    // Fetch authors separately to avoid Prisma Query Engine panic
    const authorIds = posts.map(post => post.authorId)
    const authors = await prisma.user.findMany({
      where: { id: { in: authorIds } },
      select: { id: true, name: true, email: true }
    })
    
    const authorMap = new Map(authors.map(a => [a.id, a]))
    
    const postsWithAuthors = posts.map(post => ({
      ...post,
      author: authorMap.get(post.authorId) || { id: post.authorId, name: 'Unknown', email: '' }
    }))
    
    return NextResponse.json(postsWithAuthors)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

// POST create new blog post
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      coverImage, 
      category, 
      tags, 
      status, 
      metaTitle, 
      metaDescription, 
      readTime,
    } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('adminSession')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Please log in again to create a blog post' }, { status: 401 })
    }

    let sessionUserId: number
    let sessionEmail: string
    try {
      const session = JSON.parse(sessionCookie.value)
      sessionUserId = typeof session.userId === 'number' ? session.userId : 0
      sessionEmail = typeof session.email === 'string' ? session.email : ''
    } catch {
      return NextResponse.json({ error: 'Your session is invalid. Please log in again.' }, { status: 401 })
    }

    if (!sessionUserId || !sessionEmail) {
      return NextResponse.json({ error: 'Your session is invalid. Please log in again.' }, { status: 401 })
    }

    const author = await prisma.user.findUnique({
      where: { id: sessionUserId },
      select: { id: true, name: true, email: true },
    })

    if (!author) {
      return NextResponse.json({ error: 'Your account could not be found. Please log in again.' }, { status: 401 })
    }

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if slug is unique
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: finalSlug }
    })

    if (existingPost) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        coverImage,
        category,
        tags: tags || [],
        status: status || 'DRAFT',
        metaTitle,
        metaDescription,
        readTime,
        authorId: author.id,
        publishedAt: status === 'PUBLISHED' ? new Date() : null
      }
    })
    
    // Fetch author separately to avoid Prisma Query Engine panic
    const postAuthor = await prisma.user.findUnique({
      where: { id: post.authorId },
      select: { id: true, name: true, email: true }
    })
    
    const postWithAuthor = {
      ...post,
      author: postAuthor || { id: post.authorId, name: 'Unknown', email: '' }
    }

    return NextResponse.json(postWithAuthor, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}
