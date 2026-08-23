"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calendar,
  User,
  ArrowRight,
  Clock,
  Search,
} from "lucide-react"
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
  "Sustainability",
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
      const response = await fetch("/api/blog")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // ================= FILTER POSTS =================

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      post.excerpt
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesCategory =
      categoryFilter === "All" ||
      post.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // ================= PAGINATION =================

  const totalPages = Math.ceil(
    filteredPosts.length / POSTS_PER_PAGE
  )

  const startIndex =
    (currentPage - 1) * POSTS_PER_PAGE

  const endIndex =
    startIndex + POSTS_PER_PAGE

  const currentPosts =
    filteredPosts.slice(startIndex, endIndex)

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter])

  // ================= LOADING =================

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: "#F7F4EF",
        }}
      >
        <div className="text-center">

          <div
            className="
              mx-auto
              mb-4
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
            "
            style={{
              borderColor: "#E7DED4",
              borderTopColor: "#7A4E2D",
            }}
          />

          <p
            className="text-sm"
            style={{
              color: "#756E68",
            }}
          >
            Loading blog posts...
          </p>

        </div>
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "#FFFFFF",
      }}
    >

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="py-14 md:py-16"
        style={{
          backgroundColor: "#FFF9F3",
        }}
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >

          <div className="text-center">

            {/* Small Label */}

            <div
              className="
                mb-3
                inline-flex
                items-center
                rounded-full
                border
                px-4
                py-1.5
                text-sm
                font-medium
              "
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E7DED4",
                color: "#7A4E2D",
              }}
            >
              Cherdung Café
            </div>

            {/* Heading */}

            <h1
              className="
                mb-4
                text-4xl
                font-light
                md:text-5xl
              "
              style={{
                color: "#292522",
              }}
            >
              Our Blog
            </h1>

            {/* Description */}

            <p
              className="
                mx-auto
                max-w-3xl
                text-base
                leading-relaxed
                md:text-lg
              "
              style={{
                color: "#756E68",
              }}
            >
              Discover coffee tips, recipes, and stories
              from our café journey.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          FILTER SECTION
      ===================================================== */}

      <section
        className="
          border-b
          py-6
        "
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E7DED4",
        }}
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* ================= CATEGORIES ================= */}

            <div
              className="
                flex
                flex-wrap
                justify-center
                gap-2
                lg:justify-start
              "
            >

              {CATEGORIES.map((category) => (

                <button
                  key={category}
                  onClick={() => {
                    setCategoryFilter(category)
                    setCurrentPage(1)
                  }}
                  className="
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                  "
                  style={
                    categoryFilter === category
                      ? {
                          backgroundColor: "#7A4E2D",
                          borderColor: "#7A4E2D",
                          color: "#FFFFFF",
                          boxShadow:
                            "0 4px 12px rgba(122, 78, 45, 0.18)",
                        }
                      : {
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E7DED4",
                          color: "#756E68",
                        }
                  }
                >
                  {category}
                </button>

              ))}

            </div>


            {/* ================= SEARCH ================= */}

            <div
              className="
                relative
                mx-auto
                w-full
                max-w-xs
                lg:mx-0
              "
            >

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                "
                style={{
                  color: "#756E68",
                }}
              />

              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="
                  h-10
                  rounded-lg
                  bg-white
                  pl-10
                  pr-4
                  outline-none
                  focus:ring-2
                "
                style={{
                  borderColor: "#E7DED4",
                  color: "#292522",
                }}
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BLOG POSTS
      ===================================================== */}

      <section
        className="py-14 md:py-16"
        style={{
          backgroundColor: "#F7F4EF",
        }}
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {currentPosts.length > 0 ? (

            <>

              {/* ================= GRID ================= */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-6
                  md:grid-cols-2
                  lg:grid-cols-3
                "
              >

                {currentPosts.map((post) => (

                  <Card
                    key={post.id}
                    className="
                      group
                      flex
                      flex-col
                      overflow-hidden
                      rounded-xl
                      border
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                    "
                    style={{
                      borderColor: "#E7DED4",
                    }}
                  >

                    {/* ================= IMAGE ================= */}

                    {post.coverImage ? (

                      <div
                        className="
                          h-52
                          overflow-hidden
                        "
                      >

                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                        />

                      </div>

                    ) : (

                      <div
                        className="
                          flex
                          h-52
                          items-center
                          justify-center
                        "
                        style={{
                          backgroundColor: "#FFF9F3",
                        }}
                      >

                        <Clock
                          className="h-12 w-12"
                          style={{
                            color: "#C9B9A9",
                          }}
                        />

                      </div>

                    )}


                    {/* ================= CONTENT ================= */}

                    <CardContent
                      className="
                        flex
                        flex-1
                        flex-col
                        p-6
                      "
                    >

                      {/* Category */}

                      {post.category && (

                        <span
                          className="
                            mb-2
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                          "
                          style={{
                            color: "#7A4E2D",
                          }}
                        >
                          {post.category}
                        </span>

                      )}


                      {/* Date + Read Time */}

                      <div
                        className="
                          mb-3
                          flex
                          flex-wrap
                          items-center
                          gap-2
                          text-sm
                        "
                        style={{
                          color: "#756E68",
                        }}
                      >

                        <Calendar
                          className="h-4 w-4"
                        />

                        <time
                          dateTime={post.publishedAt}
                        >
                          {new Date(
                            post.publishedAt
                          ).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </time>

                        <span>•</span>

                        <span>
                          {post.readTime
                            ? `${post.readTime} min read`
                            : "5 min read"}
                        </span>

                      </div>


                      {/* Title */}

                      <h3
                        className="
                          mb-2
                          line-clamp-2
                          text-xl
                          font-semibold
                        "
                        style={{
                          color: "#292522",
                        }}
                      >
                        {post.title}
                      </h3>


                      {/* Excerpt */}

                      <p
                        className="
                          mb-5
                          line-clamp-3
                          flex-1
                          leading-relaxed
                        "
                        style={{
                          color: "#756E68",
                        }}
                      >
                        {post.excerpt}
                      </p>


                      {/* ================= BOTTOM ================= */}

                      <div
                        className="
                          mt-auto
                          flex
                          items-center
                          justify-between
                          border-t
                          pt-4
                        "
                        style={{
                          borderColor: "#E7DED4",
                        }}
                      >

                        {/* Author */}

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-sm
                          "
                          style={{
                            color: "#756E68",
                          }}
                        >

                          <User
                            className="h-4 w-4"
                          />

                          <span>
                            {post.author.name}
                          </span>

                        </div>


                        {/* Read More */}

                        <Link
                          href={`/blog/${post.slug}`}
                          className="
                            group/link
                            flex
                            items-center
                            gap-1
                            font-medium
                            transition-colors
                          "
                          style={{
                            color: "#7A4E2D",
                          }}
                        >

                          Read More

                          <ArrowRight
                            className="
                              h-4
                              w-4
                              transition-transform
                              duration-300
                              group-hover/link:translate-x-1
                            "
                          />

                        </Link>

                      </div>

                    </CardContent>

                  </Card>

                ))}

              </div>


              {/* =================================================
                  PAGINATION
              ================================================= */}

              {totalPages > 1 && (

                <div
                  className="
                    mt-12
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  {/* Previous */}

                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.max(prev - 1, 1)
                      )
                    }
                    disabled={currentPage === 1}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E7DED4",
                      color: "#756E68",
                    }}
                  >
                    Previous
                  </Button>


                  {/* Pages */}

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, i) => i + 1
                  ).map((page) => (

                    <Button
                      key={page}
                      variant={
                        currentPage === page
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      style={{
                        backgroundColor:
                          currentPage === page
                            ? "#7A4E2D"
                            : "#FFFFFF",

                        color:
                          currentPage === page
                            ? "#FFFFFF"
                            : "#756E68",

                        borderColor:
                          currentPage === page
                            ? "#7A4E2D"
                            : "#E7DED4",
                      }}
                    >
                      {page}
                    </Button>

                  ))}


                  {/* Next */}

                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          totalPages
                        )
                      )
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E7DED4",
                      color: "#756E68",
                    }}
                  >
                    Next
                  </Button>

                </div>

              )}

            </>

          ) : (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div
              className="
                py-20
                text-center
              "
            >

              <div
                className="
                  mx-auto
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                "
                style={{
                  backgroundColor: "#FFF9F3",
                }}
              >

                <Clock
                  className="h-8 w-8"
                  style={{
                    color: "#C9B9A9",
                  }}
                />

              </div>


              <h3
                className="
                  mb-2
                  text-xl
                  font-semibold
                "
                style={{
                  color: "#292522",
                }}
              >
                No Blog Posts Found
              </h3>


              <p
                style={{
                  color: "#756E68",
                }}
              >
                No blog posts found matching
                your criteria.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          NEWSLETTER
      ===================================================== */}

      <section
        className="py-14 md:py-16"
        style={{
          backgroundColor: "#292522",
        }}
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            text-center
            sm:px-6
            lg:px-8
          "
        >

          <h2
            className="
              mb-3
              text-3xl
              font-semibold
              text-white
            "
          >
            Stay Updated
          </h2>


          <p
            className="
              mx-auto
              mb-7
              max-w-2xl
              text-base
            "
            style={{
              color: "#E7DED4",
            }}
          >
            Subscribe to our newsletter for the
            latest coffee tips, recipes, and café
            updates.
          </p>


          {/* Newsletter Form */}

          <form
            className="
              mx-auto
              flex
              max-w-md
              flex-col
              gap-2
              sm:flex-row
            "
          >

            <input
              type="email"
              placeholder="Enter your email"
              className="
                flex-1
                rounded-lg
                border
                bg-white
                px-4
                py-3
                text-[#292522]
                outline-none
                focus:ring-2
                focus:ring-[#7A4E2D]
              "
              style={{
                borderColor: "#E7DED4",
              }}
              required
            />


            <button
              type="submit"
              className="
                rounded-lg
                px-6
                py-3
                font-semibold
                text-white
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-lg
              "
              style={{
                backgroundColor: "#7A4E2D",
              }}
            >
              Subscribe
            </button>

          </form>

        </div>

      </section>

    </div>
  )
}
