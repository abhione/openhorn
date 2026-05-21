import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/candidates/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: params.id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        documents: true,
        submissions: {
          include: {
            jobOrder: { select: { id: true, title: true, company: { select: { id: true, name: true } } } },
            interviews: true,
          },
        },
        placements: {
          include: {
            jobOrder: { select: { id: true, title: true } },
            company: { select: { id: true, name: true } },
          },
        },
        activities: { orderBy: { occurredAt: "desc" }, take: 20 },
        notes: { orderBy: { createdAt: "desc" }, take: 20, include: { author: { select: { id: true, name: true } } } },
        tags: { include: { tag: true } },
      },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    return NextResponse.json(candidate);
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return NextResponse.json({ error: "Failed to fetch candidate" }, { status: 500 });
  }
}

// PATCH /api/candidates/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const candidate = await prisma.candidate.update({
      where: { id: params.id },
      data: body,
      include: {
        owner: { select: { id: true, name: true } },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(candidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    return NextResponse.json({ error: "Failed to update candidate" }, { status: 500 });
  }
}

// DELETE /api/candidates/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.candidate.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return NextResponse.json({ error: "Failed to delete candidate" }, { status: 500 });
  }
}
