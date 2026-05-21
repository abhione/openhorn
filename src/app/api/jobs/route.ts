import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "25");
    const status = searchParams.get("status");
    const companyId = searchParams.get("companyId");
    const search = searchParams.get("search");
    const priority = searchParams.get("priority");
    const employmentType = searchParams.get("employmentType");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (companyId) where.companyId = companyId;
    if (priority) where.priority = priority;
    if (employmentType) where.employmentType = employmentType;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.jobOrder.findMany({
        where,
        include: {
          company: { select: { id: true, name: true } },
          contact: { select: { id: true, firstName: true, lastName: true, title: true } },
          owner: { select: { id: true, name: true } },
          _count: { select: { submissions: true, placements: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.jobOrder.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// POST /api/jobs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workspaceId, companyId, contactId, ownerId, title, description,
      employmentType, location, openings, compensationMin, compensationMax,
      billRate, feeType, feePercent, priority, status,
    } = body;

    if (!workspaceId || !companyId || !title) {
      return NextResponse.json(
        { error: "workspaceId, companyId, and title are required" },
        { status: 400 }
      );
    }

    const job = await prisma.jobOrder.create({
      data: {
        workspaceId, companyId, contactId, ownerId, title, description,
        employmentType, location, openings: openings || 1,
        compensationMin, compensationMax, billRate, feeType, feePercent,
        priority: priority || "Medium", status: status || "Draft",
      },
      include: {
        company: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        owner: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
