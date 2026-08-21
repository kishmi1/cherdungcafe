import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Calendar, User, Clock, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { BlogPostingSchema, BreadcrumbSchema } from "@/components/structured-data"
import { Metadata } from "next"

interface BlogPostPageProps {
  params: { slug: string }
}

interface BlogPostWithAuthor {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  coverImage?: string
  category?: string
  tags: string[]
  status: "DRAFT" | "PUBLISHED"
  metaTitle?: string
  metaDescription?: string
  readTime?: number
  authorId: number
  author: {
    id: number
    name: string
    email: string
  }
  publishedAt?: string | Date
  createdAt: string | Date
  updatedAt: string | Date
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }

  return {
    title: post.metaTitle || `${post.title} - Cherdung Café Blog`,
    description: post.metaDescription || post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt || post.content.substring(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

async function getBlogPost(slug: string): Promise<BlogPostWithAuthor | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    })
    
    if (post) {
      // Fetch author separately to avoid Prisma Query Engine panic
      const author = await prisma.user.findUnique({
        where: { id: post.authorId },
        select: { id: true, name: true, email: true }
      })
        return { ...post, author: author || { id: post.authorId, name: 'Unknown Author', email: '' } } as BlogPostWithAuthor
    }
    
    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

async function getRelatedPosts(currentPostId: number, category?: string | null): Promise<BlogPostWithAuthor[]> {
  try {
    const where: any = {
      status: "PUBLISHED",
      id: { not: currentPostId }
    }
    
    if (category) {
      where.category = category
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 3
    })
    
    // Fetch authors separately to avoid Prisma Query Engine panic
    const authorIds = posts.map(post => post.authorId)
    const authors = await prisma.user.findMany({
      where: { id: { in: authorIds } },
      select: { id: true, name: true, email: true }
    })
    
    const authorMap = new Map(authors.map(a => [a.id, a]))
    
    return posts.map(post => ({
      ...post,
      author: authorMap.get(post.authorId) || { id: post.authorId, name: 'Unknown', email: '' }
    })) as BlogPostWithAuthor[]
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category)

  // Fallback content if needed
  const fallbackContent = post.content || `
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <h2>Section Heading</h2>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
  `

  return (
    <div className="flex flex-col">
      <BlogPostingSchema
        title={post.title}
        description={post.excerpt || post.content.substring(0, 160)}
        author={post.author?.name || 'Unknown Author'}
        datePublished={post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()}
        url={`https://cherdungcafe.com/blog/${post.slug}`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://cherdungcafe.com" },
          { name: "Blog", item: "https://cherdungcafe.com/blog" },
          { name: post.title, item: `https://cherdungcafe.com/blog/${post.slug}` }
        ]}
      />
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author?.name || 'Unknown Author'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : ''}>
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="aspect-video rounded-lg mb-8 overflow-hidden">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Category */}
            {post.category && (
              <span className="inline-block text-sm font-medium mb-4" style={{ color: '#7A4E2D' }}>
                {post.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#292522' }}>
              {post.title}
            </h1>

            {/* Author + Date */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b" style={{ color: '#756E68' }}>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author?.name || 'Unknown Author'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : ''}>
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
                </time>
              </div>
              {post.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min read</span>
                </div>
              )}
            </div>

            {/* Full rich content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: post.content || fallbackContent }} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#292522' }}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-8 pt-8 border-t flex items-center justify-between">
              <span className="text-gray-600">Share this post:</span>
              <button className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                <Share2 className="h-5 w-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8" style={{ color: '#292522' }}>Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                  {relatedPost.coverImage ? (
                    <div className="aspect-video rounded-t-lg overflow-hidden">
                      <img 
                        src={relatedPost.coverImage} 
                        alt={relatedPost.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-t-lg flex items-center justify-center">
                      <Clock className="h-12 w-12 text-amber-400" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    {relatedPost.category && (
                      <span className="text-xs font-medium mb-2 inline-block" style={{ color: '#7A4E2D' }}>
                        {relatedPost.category}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Read More →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}