import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/jobs/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.jobOrder.findUnique({
      where: { id: params.id },
      include: {
        company: { select: { id: true, name: true, industry: true, location: true } },
        contact: { select: { id: true, firstName: true, lastName: true, title: true, email: true, phone: true } },
        owner: { select: { id: true, name: true, email: true } },
        submissions: {
          include: {
            candidate: { select: { id: true, firstName: true, lastName: true, currentTitle: true, email: true } },
            submittedBy: { select: { id: true, name: true } },
            interviews: true,
          },
          orderBy: { submittedAt: "desc" },
        },
        placements: {
          include: {
            candidate: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// PATCH /api/jobs/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const job = await prisma.jobOrder.update({
      where: { id: params.id },
      data: body,
      include: {
        company: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

// DELETE /api/jobs/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.jobOrder.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
