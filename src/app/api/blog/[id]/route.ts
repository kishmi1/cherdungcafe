import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single blog post
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const author = await prisma.user.findUnique({
      where: { id: post.authorId },
      select: { id: true, name: true, email: true },
    });

    const postWithAuthor = {
      ...post,
      author: author || {
        id: post.authorId,
        name: "Unknown",
        email: "",
      },
    };

    return NextResponse.json(postWithAuthor);
  } catch (error) {
    console.error("Error fetching blog post:", error);

    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT update blog post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

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
    } = body;

    const postId = parseInt(id);

    // Check if new slug is unique
    if (slug) {
      const existingPost = await prisma.blogPost.findFirst({
        where: {
          slug,
          NOT: { id: postId },
        },
      });

      if (existingPost) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;

    if (status !== undefined) {
      updateData.status = status;
      updateData.publishedAt =
        status === "PUBLISHED" ? new Date() : null;
    }

    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      updateData.metaDescription = metaDescription;
    if (readTime !== undefined) updateData.readTime = readTime;

    const post = await prisma.blogPost.update({
      where: { id: postId },
      data: updateData,
    });

    const author = await prisma.user.findUnique({
      where: { id: post.authorId },
      select: { id: true, name: true, email: true },
    });

    const postWithAuthor = {
      ...post,
      author: author || {
        id: post.authorId,
        name: "Unknown",
        email: "",
      },
    };

    return NextResponse.json(postWithAuthor);
  } catch (error) {
    console.error("Error updating blog post:", error);

    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE blog post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.blogPost.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);

    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}