import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/companies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "25");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const industry = searchParams.get("industry");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (industry) where.industry = industry;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { industry: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          owner: { select: { id: true, name: true } },
          _count: { select: { contacts: true, jobOrders: true, placements: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.company.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

// POST /api/companies
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId, name, website, industry, size, status, billingTerms, location, phone, ownerId } = body;

    if (!workspaceId || !name) {
      return NextResponse.json({ error: "workspaceId and name are required" }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: { workspaceId, name, website, industry, size, status: status || "Prospect", billingTerms, location, phone, ownerId },
      include: {
        owner: { select: { id: true, name: true } },
        _count: { select: { contacts: true, jobOrders: true } },
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
