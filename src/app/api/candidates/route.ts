import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/candidates - List candidates with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "25");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const ownerId = searchParams.get("ownerId");
    const skills = searchParams.get("skills");

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (ownerId) where.ownerId = ownerId;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { currentTitle: { contains: search } },
        { skills: { contains: search } },
        { location: { contains: search } },
      ];
    }
    if (skills) {
      where.skills = { contains: skills };
    }

    const [data, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        include: {
          owner: { select: { id: true, name: true } },
          tags: { include: { tag: true } },
          _count: { select: { submissions: true, placements: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.candidate.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}

// POST /api/candidates - Create a new candidate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workspaceId,
      firstName,
      lastName,
      email,
      phone,
      location,
      currentTitle,
      status,
      skills,
      linkedinUrl,
      summary,
      source,
      compensation,
      availability,
      ownerId,
    } = body;

    if (!workspaceId || !firstName || !lastName) {
      return NextResponse.json(
        { error: "workspaceId, firstName, and lastName are required" },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidate.create({
      data: {
        workspaceId,
        firstName,
        lastName,
        email,
        phone,
        location,
        currentTitle,
        status: status || "New",
        skills: skills || "",
        linkedinUrl,
        summary,
        source,
        compensation,
        availability,
        ownerId,
      },
      include: {
        owner: { select: { id: true, name: true } },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json({ error: "Failed to create candidate" }, { status: 500 });
  }
}
