import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  BlogPostingSchema,
  BreadcrumbSchema,
} from "@/components/structured-data"
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

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }

  return {
    title:
      post.metaTitle ||
      `${post.title} - Cherdung Café Blog`,

    description:
      post.metaDescription ||
      post.excerpt ||
      post.content.substring(0, 160),

    openGraph: {
      title: post.title,

      description:
        post.metaDescription ||
        post.excerpt ||
        post.content.substring(0, 160),

      images: post.coverImage
        ? [post.coverImage]
        : [],
    },
  }
}

/* =========================================================
   GET BLOG POST
========================================================= */

async function getBlogPost(
  slug: string
): Promise<BlogPostWithAuthor | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
      },
    })

    if (post) {
      const author =
        await prisma.user.findUnique({
          where: {
            id: post.authorId,
          },

          select: {
            id: true,
            name: true,
            email: true,
          },
        })

      return {
        ...post,

        author:
          author || {
            id: post.authorId,
            name: "Unknown Author",
            email: "",
          },
      } as BlogPostWithAuthor
    }

    return post
  } catch (error) {
    console.error(
      "Error fetching blog post:",
      error
    )

    return null
  }
}

/* =========================================================
   GET RELATED POSTS
========================================================= */

async function getRelatedPosts(
  currentPostId: number,
  category?: string | null
): Promise<BlogPostWithAuthor[]> {
  try {
    const where: any = {
      status: "PUBLISHED",

      id: {
        not: currentPostId,
      },
    }

    if (category) {
      where.category = category
    }

    const posts =
      await prisma.blogPost.findMany({
        where,

        orderBy: {
          publishedAt: "desc",
        },

        take: 3,
      })

    const authorIds = posts.map(
      (post) => post.authorId
    )

    const authors =
      await prisma.user.findMany({
        where: {
          id: {
            in: authorIds,
          },
        },

        select: {
          id: true,
          name: true,
          email: true,
        },
      })

    const authorMap = new Map(
      authors.map((author) => [
        author.id,
        author,
      ])
    )

    return posts.map((post) => ({
      ...post,

      author:
        authorMap.get(post.authorId) || {
          id: post.authorId,
          name: "Unknown Author",
          email: "",
        },
    })) as BlogPostWithAuthor[]
  } catch (error) {
    console.error(
      "Error fetching related posts:",
      error
    )

    return []
  }
}

/* =========================================================
   BLOG DETAIL PAGE
========================================================= */

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params

  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts =
    await getRelatedPosts(
      post.id,
      post.category
    )

  const fallbackContent = `
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>

    <h2>Section Heading</h2>

    <p>
      Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  `

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#FFFFFF",
        color: "#292522",
      }}
    >

      {/* =====================================================
          BLOG HERO
      ===================================================== */}

      <section
        className="py-12 md:py-16"
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

          {/* ================= BACK TO BLOG ================= */}

          <Link
            href="/blog"
            className="
              mb-8
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              transition-opacity
              hover:opacity-70
            "
            style={{
              color: "#7A4E2D",
            }}
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Blog
          </Link>


          {/* =================================================
              IMAGE + CONTENT
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              items-center
              gap-8
              md:grid-cols-2
              md:gap-12
              lg:gap-16
            "
          >

            {/* ================= IMAGE ================= */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                bg-white
                shadow-sm
              "
              style={{
                borderColor: "#E7DED4",
              }}
            >

              {post.coverImage ? (

                <div
                  className="
                    aspect-[4/3]
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
                      hover:scale-105
                    "
                  />
                </div>

              ) : (

                <div
                  className="
                    flex
                    aspect-[4/3]
                    items-center
                    justify-center
                  "
                  style={{
                    backgroundColor: "#F7F4EF",
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

            </div>


            {/* ================= CONTENT ================= */}

            <div className="max-w-xl">

              {/* Category */}

              {post.category && (
                <span
                  className="
                    mb-4
                    inline-block
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                  "
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E7DED4",
                    color: "#7A4E2D",
                  }}
                >
                  {post.category}
                </span>
              )}


              {/* Title */}

              <h1
                className="
                  mb-5
                  text-3xl
                  font-semibold
                  leading-tight
                  md:text-4xl
                  lg:text-5xl
                "
                style={{
                  color: "#292522",
                }}
              >
                {post.title}
              </h1>


              {/* Excerpt */}

              {post.excerpt && (
                <p
                  className="
                    mb-6
                    text-base
                    leading-relaxed
                    md:text-lg
                  "
                  style={{
                    color: "#756E68",
                  }}
                >
                  {post.excerpt}
                </p>
              )}


              {/* Divider */}

              <div
                className="mb-6 h-px w-full"
                style={{
                  backgroundColor: "#E7DED4",
                }}
              />


              {/* ================= META ================= */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-x-5
                  gap-y-3
                  text-sm
                "
                style={{
                  color: "#756E68",
                }}
              >

                {/* Author */}

                <div className="flex items-center gap-2">

                  <User
                    className="h-4 w-4"
                    style={{
                      color: "#7A4E2D",
                    }}
                  />

                  <span>
                    {post.author?.name ||
                      "Unknown Author"}
                  </span>

                </div>


                {/* Date */}

                <div className="flex items-center gap-2">

                  <Calendar
                    className="h-4 w-4"
                    style={{
                      color: "#7A4E2D",
                    }}
                  />

                  <time
                    dateTime={
                      post.publishedAt
                        ? new Date(
                            post.publishedAt
                          ).toISOString()
                        : ""
                    }
                  >
                    {post.publishedAt
                      ? new Date(
                          post.publishedAt
                        ).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : ""}
                  </time>

                </div>


                {/* Read Time */}

                <div className="flex items-center gap-2">

                  <Clock
                    className="h-4 w-4"
                    style={{
                      color: "#7A4E2D",
                    }}
                  />

                  <span>
                    {post.readTime || 5} min read
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          BLOG CONTENT
      ===================================================== */}

      <section
        className="py-12 md:py-16"
        style={{
          backgroundColor: "#FFFFFF",
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

          <article className="mx-auto max-w-4xl">

            {/* ================= CONTENT ================= */}

            <div
              className="
                prose
                prose-lg
                max-w-none
                prose-headings:font-semibold
                prose-p:leading-relaxed
                prose-a:no-underline
                prose-blockquote:border-l-4
              "
              style={{
                color: "#756E68",
              }}
            >

              <div
                dangerouslySetInnerHTML={{
                  __html:
                    post.content ||
                    fallbackContent,
                }}
              />

            </div>


            {/* =================================================
                TAGS
            ================================================= */}

            {post.tags &&
              post.tags.length > 0 && (

                <div
                  className="
                    mt-10
                    border-t
                    pt-6
                  "
                  style={{
                    borderColor: "#E7DED4",
                  }}
                >

                  <h3
                    className="
                      mb-3
                      text-lg
                      font-semibold
                    "
                    style={{
                      color: "#292522",
                    }}
                  >
                    Tags
                  </h3>


                  <div className="flex flex-wrap gap-2">

                    {post.tags.map(
                      (tag: string) => (

                        <span
                          key={tag}
                          className="
                            rounded-full
                            border
                            px-3
                            py-1
                            text-sm
                          "
                          style={{
                            backgroundColor:
                              "#FFF9F3",
                            borderColor:
                              "#E7DED4",
                            color: "#7A4E2D",
                          }}
                        >
                          #{tag}
                        </span>

                      )
                    )}

                  </div>

                </div>

              )}


            {/* =================================================
                SHARE
            ================================================= */}

            <div
              className="
                mt-6
                flex
                items-center
                justify-between
                border-t
                pt-6
              "
              style={{
                borderColor: "#E7DED4",
              }}
            >

              <span
                className="text-sm"
                style={{
                  color: "#756E68",
                }}
              >
                Share this post
              </span>


              <button
                className="
                  inline-flex
                  items-center
                  gap-2
                  font-medium
                  transition-opacity
                  hover:opacity-70
                "
                style={{
                  color: "#7A4E2D",
                }}
              >

                <Share2 className="h-5 w-5" />

                Share

              </button>

            </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          RELATED POSTS
      ===================================================== */}

      {relatedPosts.length > 0 && (

        <section
          className="py-12 md:py-16"
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

            {/* ================= TITLE ================= */}

            <div className="mb-8">

              <h2
                className="
                  text-3xl
                  font-semibold
                "
                style={{
                  color: "#292522",
                }}
              >
                Related Posts
              </h2>


              <p
                className="mt-2"
                style={{
                  color: "#756E68",
                }}
              >
                You may also enjoy these stories.
              </p>

            </div>


            {/* ================= CARDS ================= */}

            <div
              className="
                grid
                grid-cols-1
                gap-6
                md:grid-cols-3
              "
            >

              {relatedPosts.map(
                (relatedPost) => (

                  <Card
                    key={relatedPost.id}
                    className="
                      group
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

                    {relatedPost.coverImage ? (

                      <div
                        className="
                          aspect-video
                          overflow-hidden
                        "
                      >

                        <img
                          src={
                            relatedPost.coverImage
                          }
                          alt={
                            relatedPost.title
                          }
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
                          aspect-video
                          items-center
                          justify-center
                        "
                        style={{
                          backgroundColor:
                            "#FFF9F3",
                        }}
                      >

                        <Clock
                          className="h-10 w-10"
                          style={{
                            color: "#C9B9A9",
                          }}
                        />

                      </div>

                    )}


                    {/* ================= CARD CONTENT ================= */}

                    <CardContent className="p-5">

                      {/* Category */}

                      {relatedPost.category && (

                        <span
                          className="
                            mb-2
                            inline-block
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                          "
                          style={{
                            color: "#7A4E2D",
                          }}
                        >
                          {
                            relatedPost.category
                          }
                        </span>

                      )}


                      {/* Title */}

                      <h3
                        className="
                          mb-2
                          line-clamp-2
                          text-lg
                          font-semibold
                        "
                        style={{
                          color: "#292522",
                        }}
                      >
                        {
                          relatedPost.title
                        }
                      </h3>


                      {/* Excerpt */}

                      <p
                        className="
                          mb-4
                          line-clamp-2
                          text-sm
                        "
                        style={{
                          color: "#756E68",
                        }}
                      >
                        {
                          relatedPost.excerpt
                        }
                      </p>


                      {/* Read More */}

                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="
                          group/link
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          font-medium
                          transition-opacity
                          hover:opacity-70
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
                            group-hover/link:translate-x-1
                          "
                        />

                      </Link>

                    </CardContent>

                  </Card>

                )
              )}

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          STRUCTURED DATA
      ===================================================== */}

      <BlogPostingSchema
        title={post.title}
        description={
          post.excerpt ||
          post.content.substring(0, 160)
        }
        author={
          post.author?.name ||
          "Unknown Author"
        }
        datePublished={
          post.publishedAt
            ? new Date(
                post.publishedAt
              ).toISOString()
            : new Date().toISOString()
        }
        url={`https://cherdungcafe.com/blog/${post.slug}`}
      />


      <BreadcrumbSchema
        items={[
          {
            name: "Home",
            item: "https://cherdungcafe.com",
          },
          {
            name: "Blog",
            item: "https://cherdungcafe.com/blog",
          },
          {
            name: post.title,
            item: `https://cherdungcafe.com/blog/${post.slug}`,
          },
        ]}
      />

    </div>
  )
}
