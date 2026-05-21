import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/contacts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "25");
    const companyId = searchParams.get("companyId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { title: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: {
          company: { select: { id: true, name: true } },
          owner: { select: { id: true, name: true } },
          _count: { select: { jobOrders: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

// POST /api/contacts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId, companyId, firstName, lastName, title, email, phone, status, linkedinUrl, ownerId } = body;

    if (!workspaceId || !companyId || !firstName || !lastName) {
      return NextResponse.json(
        { error: "workspaceId, companyId, firstName, and lastName are required" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: { workspaceId, companyId, firstName, lastName, title, email, phone, status: status || "Active", linkedinUrl, ownerId },
      include: {
        company: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
