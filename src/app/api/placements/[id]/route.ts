import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/placements/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const placement = await prisma.placement.findUnique({
      where: { id: params.id },
      include: {
        candidate: {
          select: { id: true, firstName: true, lastName: true, currentTitle: true, email: true, phone: true },
        },
        jobOrder: {
          select: { id: true, title: true, employmentType: true, location: true },
        },
        company: {
          select: { id: true, name: true, industry: true },
        },
        contact: {
          select: { id: true, firstName: true, lastName: true, title: true, email: true },
        },
        owner: { select: { id: true, name: true } },
      },
    });

    if (!placement) {
      return NextResponse.json({ error: "Placement not found" }, { status: 404 });
    }

    return NextResponse.json(placement);
  } catch (error) {
    console.error("Error fetching placement:", error);
    return NextResponse.json({ error: "Failed to fetch placement" }, { status: 500 });
  }
}

// PATCH /api/placements/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (body.startDate) body.startDate = new Date(body.startDate);
    if (body.endDate) body.endDate = new Date(body.endDate);
    if (body.guaranteeEndDate) body.guaranteeEndDate = new Date(body.guaranteeEndDate);

    const placement = await prisma.placement.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(placement);
  } catch (error) {
    console.error("Error updating placement:", error);
    return NextResponse.json({ error: "Failed to update placement" }, { status: 500 });
  }
}

// DELETE /api/placements/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.placement.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting placement:", error);
    return NextResponse.json({ error: "Failed to delete placement" }, { status: 500 });
  }
}
