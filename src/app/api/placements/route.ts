import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/placements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "25");
    const status = searchParams.get("status");
    const companyId = searchParams.get("companyId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (companyId) where.companyId = companyId;

    const [data, total] = await Promise.all([
      prisma.placement.findMany({
        where,
        include: {
          candidate: { select: { id: true, firstName: true, lastName: true, currentTitle: true } },
          jobOrder: { select: { id: true, title: true } },
          company: { select: { id: true, name: true } },
          contact: { select: { id: true, firstName: true, lastName: true, title: true } },
          owner: { select: { id: true, name: true } },
        },
        orderBy: { startDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.placement.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching placements:", error);
    return NextResponse.json({ error: "Failed to fetch placements" }, { status: 500 });
  }
}

// POST /api/placements
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      candidateId, jobOrderId, companyId, contactId, ownerId,
      startDate, endDate, status, salary, billRate, payRate,
      feeAmount, guaranteeEndDate,
    } = body;

    if (!candidateId || !jobOrderId || !companyId || !startDate) {
      return NextResponse.json(
        { error: "candidateId, jobOrderId, companyId, and startDate are required" },
        { status: 400 }
      );
    }

    const placement = await prisma.placement.create({
      data: {
        candidateId, jobOrderId, companyId, contactId, ownerId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status || "Pending Start",
        salary, billRate, payRate, feeAmount,
        guaranteeEndDate: guaranteeEndDate ? new Date(guaranteeEndDate) : null,
      },
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true } },
        jobOrder: { select: { id: true, title: true } },
        company: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(placement, { status: 201 });
  } catch (error) {
    console.error("Error creating placement:", error);
    return NextResponse.json({ error: "Failed to create placement" }, { status: 500 });
  }
}
