import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "25");
    const stage = searchParams.get("stage");
    const jobOrderId = searchParams.get("jobOrderId");
    const candidateId = searchParams.get("candidateId");

    const where: Record<string, unknown> = {};
    if (stage) where.stage = stage;
    if (jobOrderId) where.jobOrderId = jobOrderId;
    if (candidateId) where.candidateId = candidateId;

    const [data, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        include: {
          candidate: { select: { id: true, firstName: true, lastName: true, currentTitle: true, email: true } },
          jobOrder: {
            select: { id: true, title: true, company: { select: { id: true, name: true } } },
          },
          submittedBy: { select: { id: true, name: true } },
          _count: { select: { interviews: true } },
        },
        orderBy: { lastActivityAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.submission.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

// POST /api/submissions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, jobOrderId, stage, submittedById } = body;

    if (!candidateId || !jobOrderId) {
      return NextResponse.json(
        { error: "candidateId and jobOrderId are required" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        candidateId,
        jobOrderId,
        stage: stage || "Sourced",
        submittedById,
      },
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true } },
        jobOrder: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}
