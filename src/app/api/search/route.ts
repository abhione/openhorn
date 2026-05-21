import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/search?q=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!q || q.trim().length === 0) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    const query = q.trim();

    const [candidates, companies, jobs, contacts] = await Promise.all([
      prisma.candidate.findMany({
        where: {
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
            { currentTitle: { contains: query } },
            { skills: { contains: query } },
            { location: { contains: query } },
            { summary: { contains: query } },
          ],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          currentTitle: true,
          status: true,
          location: true,
          skills: true,
        },
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),

      prisma.company.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { industry: { contains: query } },
            { location: { contains: query } },
          ],
        },
        select: {
          id: true,
          name: true,
          industry: true,
          status: true,
          location: true,
        },
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),

      prisma.jobOrder.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { location: { contains: query } },
          ],
        },
        select: {
          id: true,
          title: true,
          status: true,
          location: true,
          employmentType: true,
          company: { select: { id: true, name: true } },
        },
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),

      prisma.contact.findMany({
        where: {
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
            { title: { contains: query } },
          ],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          title: true,
          company: { select: { id: true, name: true } },
        },
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      candidates,
      companies,
      jobs,
      contacts,
      totalResults: candidates.length + companies.length + jobs.length + contacts.length,
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
