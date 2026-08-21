import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single gallery image
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const image = await prisma.galleryImage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error fetching gallery image:", error);

    return NextResponse.json(
      { error: "Failed to fetch gallery image" },
      { status: 500 }
    );
  }
}

// PUT update gallery image
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { url, caption, category, sortOrder } = body;

    const image = await prisma.galleryImage.update({
      where: { id: parseInt(id) },
      data: {
        ...(url !== undefined && { url }),
        ...(caption !== undefined && { caption }),
        ...(category !== undefined && { category }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error updating gallery image:", error);

    return NextResponse.json(
      { error: "Failed to update gallery image" },
      { status: 500 }
    );
  }
}

// DELETE gallery image
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.galleryImage.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);

    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}