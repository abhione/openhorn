import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/submissions/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
      include: {
        candidate: {
          select: { id: true, firstName: true, lastName: true, currentTitle: true, email: true, phone: true, skills: true },
        },
        jobOrder: {
          select: { id: true, title: true, company: { select: { id: true, name: true } }, status: true },
        },
        submittedBy: { select: { id: true, name: true } },
        interviews: {
          orderBy: { scheduledAt: "desc" },
          include: { contact: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json({ error: "Failed to fetch submission" }, { status: 500 });
  }
}

// PATCH /api/submissions/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const submission = await prisma.submission.update({
      where: { id: params.id },
      data: {
        ...body,
        lastActivityAt: new Date(),
      },
    });
    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}

// DELETE /api/submissions/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.submission.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
