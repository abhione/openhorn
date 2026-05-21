import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/dashboard/stats
export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCandidates,
      activeCandidates,
      totalCompanies,
      activeJobs,
      totalSubmissions,
      placementsThisMonth,
      allSubmissions,
      recentActivities,
      candidatesByStatus,
      jobsByStatus,
    ] = await Promise.all([
      prisma.candidate.count(),
      prisma.candidate.count({ where: { status: { in: ["Active", "Contacted", "Interested", "Submitted", "Interviewing"] } } }),
      prisma.company.count(),
      prisma.jobOrder.count({ where: { status: "Open" } }),
      prisma.submission.count(),
      prisma.placement.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.submission.groupBy({
        by: ["stage"],
        _count: { id: true },
      }),
      prisma.activity.findMany({
        orderBy: { occurredAt: "desc" },
        take: 10,
        include: {
          user: { select: { id: true, name: true } },
        },
      }),
      prisma.candidate.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.jobOrder.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

    // Build pipeline by stage
    const pipelineByStage: Record<string, number> = {};
    for (const s of allSubmissions) {
      pipelineByStage[s.stage] = s._count.id;
    }

    // Build candidates by status
    const candidateStatusCounts: Record<string, number> = {};
    for (const c of candidatesByStatus) {
      candidateStatusCounts[c.status] = c._count.id;
    }

    // Build jobs by status
    const jobStatusCounts: Record<string, number> = {};
    for (const j of jobsByStatus) {
      jobStatusCounts[j.status] = j._count.id;
    }

    return NextResponse.json({
      totalCandidates,
      activeCandidates,
      totalCompanies,
      activeJobs,
      totalSubmissions,
      placementsThisMonth,
      pipelineByStage,
      candidatesByStatus: candidateStatusCounts,
      jobsByStatus: jobStatusCounts,
      recentActivities,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
