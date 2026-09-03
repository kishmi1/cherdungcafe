import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single service
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);

    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PUT update service
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      title,
      description,
      image,
      priceNote,
      sortOrder,
      isActive,
    } = body;

    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        image,
        priceNote,
        sortOrder,
        isActive,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating service:", error);

    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE service
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.service.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);

    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}