"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Eye,
  ChevronUp,
  ChevronDown,
  X,
  Upload,
  Search,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import RichTextEditor from "@/components/RichTextEditor"

interface BlogPost {
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
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

const CATEGORIES = [
  "Coffee Tips",
  "Recipes",
  "Cafe Stories",
  "Events",
  "Behind the Scenes",
  "Sustainability"
]

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft", color: "bg-gray-100 text-gray-800" },
  { value: "PUBLISHED", label: "Published", color: "bg-green-100 text-green-800" }
]

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Coffee Tips',
    tags: [] as string[],
    status: 'DRAFT' as "DRAFT" | "PUBLISHED",
    metaTitle: '',
    metaDescription: '',
    readTime: 5,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog?includeAll=true')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'blog')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, coverImage: data.url })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingPost 
        ? `/api/blog/${editingPost.id}`
        : '/api/blog'
      
      const method = editingPost ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchPosts()
        setShowAddModal(false)
        setEditingPost(null)
        setPreviewMode(false)
        resetFormData()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save blog post')
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Failed to save blog post')
    }
  }

  const resetFormData = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: 'Coffee Tips',
      tags: [],
      status: 'DRAFT',
      metaTitle: '',
      metaDescription: '',
      readTime: 5,
    })
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      coverImage: post.coverImage || '',
      category: post.category || 'Coffee Tips',
      tags: post.tags || [],
      status: post.status,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      readTime: post.readTime || 5,
    })
    setShowAddModal(true)
    setPreviewMode(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting blog post:', error)
    }
  }

  const handleStatusChange = async (post: BlogPost, newStatus: "DRAFT" | "PUBLISHED") => {
    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, status: newStatus })
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error updating post status:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({ 
      ...formData, 
      title,
      slug: formData.slug || generateSlug(title)
    })
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter(tag => tag !== tagToRemove) 
    })
  }

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <p style={{ color: '#756E68' }}>Loading blog posts...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#292522' }}>Blog Management</h1>
          <p className="text-sm" style={{ color: '#756E68' }}>Create and manage blog posts</p>
        </div>
        <Button
          onClick={() => {
            setEditingPost(null)
            resetFormData()
            setShowAddModal(true)
            setPreviewMode(false)
          }}
          style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#756E68' }} />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  style={{ borderColor: '#E7DED4' }}
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border"
              style={{ borderColor: '#E7DED4' }}
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border"
              style={{ borderColor: '#E7DED4' }}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const statusConfig = STATUS_OPTIONS.find(s => s.value === post.status)
          return (
            <Card key={post.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {post.coverImage && (
                    <div className="h-20 w-32 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: '#F7F4EF', border: '1px solid #E7DED4' }}>
                      <img 
                        src={post.coverImage} 
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold" style={{ color: '#292522' }}>{post.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig?.color}`}>
                        {statusConfig?.label}
                      </span>
                      {post.category && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F7F4EF', color: '#756E68' }}>
                          {post.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-2 line-clamp-2" style={{ color: '#756E68' }}>
                      {post.excerpt || post.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: '#756E68' }}>
                      <span>By {post.author.name}</span>
                      <span>•</span>
                      <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}</span>
                      {post.readTime && (
                        <>
                          <span>•</span>
                          <span>{post.readTime} min read</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.status === 'DRAFT' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(post, 'PUBLISHED')}
                        className="p-1"
                        style={{ color: '#7A4E2D' }}
                        title="Publish"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(post)}
                      className="p-1"
                      style={{ color: '#756E68' }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="p-1"
                      style={{ color: '#B94A48' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredPosts.length === 0 && (
          <Card style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: '#E7DED4' }} />
              <p style={{ color: '#756E68' }}>No blog posts yet. Click "New Post" to create your first post.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7DED4' }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle style={{ color: '#292522' }}>
                {previewMode ? 'Preview' : (editingPost ? 'Edit Post' : 'New Post')}
              </CardTitle>
              <div className="flex items-center gap-2">
                {!previewMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingPost(null)
                    setPreviewMode(false)
                    resetFormData()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {previewMode ? (
                // Preview Mode
                <div className="prose max-w-none">
                  {formData.coverImage && (
                    <img src={formData.coverImage} alt="Cover" className="w-full rounded-lg mb-6" />
                  )}
                  {formData.category && (
                    <span className="text-sm font-medium" style={{ color: '#7A4E2D' }}>
                      {formData.category}
                    </span>
                  )}
                  <h1>{formData.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>By Admin</span>
                    <span>•</span>
                    <span>{formData.readTime} min read</span>
                  </div>
                  {formData.excerpt && (
                    <p className="text-lg text-gray-700 mb-4">{formData.excerpt}</p>
                  )}
                  <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                  {formData.tags.length > 0 && (
                    <div className="mt-8 pt-8 border-t">
                      <h3 className="text-lg font-semibold mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span key={tag} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                        Title *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Post title"
                        required
                        style={{ borderColor: '#E7DED4' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                        Slug *
                      </label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="url-friendly-slug"
                        required
                        style={{ borderColor: '#E7DED4' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief description for listings..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border resize-none"
                      style={{ borderColor: '#E7DED4' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                      Cover Image
                    </label>
                    <div className="space-y-2">
                      {formData.coverImage && (
                        <div className="relative h-48 w-full rounded-lg overflow-hidden" style={{ border: '1px solid #E7DED4' }}>
                          <img 
                            src={formData.coverImage} 
                            alt="Cover preview"
                            className="h-full w-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormData({ ...formData, coverImage: '' })}
                            className="absolute top-2 right-2 p-1 bg-white/90 rounded"
                            style={{ color: '#B94A48' }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="flex-1"
                          style={{ borderColor: '#E7DED4' }}
                        />
                        {isUploading && (
                          <span className="text-sm" style={{ color: '#756E68' }}>Uploading...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{ borderColor: '#E7DED4' }}
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                        Read Time (minutes)
                      </label>
                      <Input
                        type="number"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                        min="1"
                        style={{ borderColor: '#E7DED4' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                      Tags
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tag and press Enter"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addTag((e.target as HTMLInputElement).value)
                              ;(e.target as HTMLInputElement).value = ''
                            }
                          }}
                          style={{ borderColor: '#E7DED4' }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-amber-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                      Content *
                    </label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                        Meta Title
                      </label>
                      <Input
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        placeholder="SEO title"
                        style={{ borderColor: '#E7DED4' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                        Meta Description
                      </label>
                      <Input
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        placeholder="SEO description"
                        style={{ borderColor: '#E7DED4' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#292522' }}>
                      Status
                    </label>
                    <div className="flex gap-4">
                      {STATUS_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="status"
                            value={option.value}
                            checked={formData.status === option.value}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as "DRAFT" | "PUBLISHED" })}
                            className="w-4 h-4"
                          />
                          <span className={option.color + " px-2 py-1 rounded text-sm"}>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddModal(false)
                        setEditingPost(null)
                        setPreviewMode(false)
                        resetFormData()
                      }}
                      className="flex-1"
                      style={{ borderColor: '#E7DED4', color: '#756E68' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      style={{ backgroundColor: '#7A4E2D', color: '#FFFFFF' }}
                    >
                      {editingPost ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
