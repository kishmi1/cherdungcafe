"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, ArrowRight, Clock, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt?: string
  coverImage?: string
  category?: string
  tags: string[]
  author: {
    name: string
  }
  publishedAt: string
  readTime?: number
}

const CATEGORIES = [
  "All",
  "Coffee Tips",
  "Recipes",
  "Cafe Stories",
  "Events",
  "Behind the Scenes",
  "Sustainability"
]

const POSTS_PER_PAGE = 6

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: '#756E68' }}>Loading blog posts...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover coffee tips, recipes, and stories from our café journey
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    categoryFilter === category
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
                style={{ borderColor: '#E7DED4' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow flex flex-col">
                    {post.coverImage ? (
                      <div className="aspect-video rounded-t-lg overflow-hidden">
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-t-lg flex items-center justify-center">
                        <Clock className="h-12 w-12 text-amber-400" />
                      </div>
                    )}
                    <CardContent className="p-6 flex-1 flex flex-col">
                      {post.category && (
                        <span className="text-xs font-medium mb-2" style={{ color: '#7A4E2D' }}>
                          {post.category}
                        </span>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        <span>•</span>
                        <span>{post.readTime ? `${post.readTime} min read` : "5 min read"}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="h-4 w-4" />
                          <span>{post.author.name}</span>
                        </div>
                        <Link href={`/blog/${post.slug}`} className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ borderColor: '#E7DED4', color: '#756E68' }}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        backgroundColor: currentPage === page ? '#7A4E2D' : 'transparent',
                        color: currentPage === page ? '#FFFFFF' : '#756E68',
                        borderColor: '#E7DED4'
                      }}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ borderColor: '#E7DED4', color: '#756E68' }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest coffee tips, recipes, and café updates
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
              required
            />
            <button
              type="submit"
              className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
