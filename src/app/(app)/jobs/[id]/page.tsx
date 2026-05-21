"use client";

import { use, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Building2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface JobDetail {
  id: string;
  title: string;
  description: string | null;
  status: string;
  location: string | null;
  employmentType: string | null;
  compensationMin: number | null;
  compensationMax: number | null;
  openings: number;
  priority: string;
  createdAt: string;
  company: { id: string; name: string; industry?: string; location?: string };
  owner?: { id: string; name: string } | null;
  submissions: Array<{
    id: string;
    stage: string;
    submittedAt: string;
    lastActivityAt: string;
    candidate: {
      id: string;
      firstName: string;
      lastName: string;
      currentTitle: string | null;
    };
    submittedBy?: { id: string; name: string } | null;
  }>;
}

const statusColors: Record<string, string> = {
  Open: "bg-emerald-100 text-emerald-700",
  Closed: "bg-red-100 text-red-700",
  "On Hold": "bg-amber-100 text-amber-700",
  Draft: "bg-gray-100 text-gray-600",
  Filled: "bg-blue-100 text-blue-700",
};

const stageColors: Record<string, string> = {
  Sourced: "bg-gray-100 text-gray-700 border-gray-300",
  Contacted: "bg-blue-100 text-blue-700 border-blue-300",
  Interested: "bg-cyan-100 text-cyan-700 border-cyan-300",
  "Internal Review": "bg-indigo-100 text-indigo-700 border-indigo-300",
  "Submitted to Client": "bg-indigo-100 text-indigo-700 border-indigo-300",
  "Client Reviewing": "bg-purple-100 text-purple-700 border-purple-300",
  "Interview Requested": "bg-amber-100 text-amber-700 border-amber-300",
  "Interview Scheduled": "bg-amber-100 text-amber-700 border-amber-300",
  "Interview Completed": "bg-orange-100 text-orange-700 border-orange-300",
  Offer: "bg-amber-100 text-amber-700 border-amber-300",
  Accepted: "bg-emerald-100 text-emerald-700 border-emerald-300",
  "Placement Created": "bg-emerald-100 text-emerald-700 border-emerald-300",
  Rejected: "bg-red-100 text-red-700 border-red-300",
};

const pipelineStages = [
  "Sourced",
  "Contacted",
  "Interested",
  "Internal Review",
  "Submitted to Client",
  "Client Reviewing",
  "Interview Scheduled",
  "Interview Completed",
  "Offer",
  "Accepted",
  "Placement Created",
];

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((r) => {
        if (r.status === 404) throw new Error("Job not found");
        if (!r.ok) throw new Error("Failed to fetch job");
        return r.json();
      })
      .then(setJob)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <Link
          href="/jobs"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Jobs
        </Link>
        <div className="text-center py-12">
          <p className="text-red-600">{error || "Job not found"}</p>
        </div>
      </div>
    );
  }

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    const fmtMin = min
      ? min < 10000
        ? `$${min.toLocaleString()}`
        : `$${(min / 1000).toFixed(0)}K`
      : "?";
    const fmtMax = max
      ? max < 10000
        ? `$${max.toLocaleString()}`
        : `$${(max / 1000).toFixed(0)}K`
      : "?";
    return `${fmtMin} - ${fmtMax}`;
  };

  const daysInStage = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // Group submissions by stage for kanban - only stages that have items + standard stages
  const activeStages = new Set(job.submissions.map((s) => s.stage));
  const kanbanStages = pipelineStages.filter(
    (stage) => activeStages.has(stage)
  );
  // Add any stages from submissions that aren't in our predefined list
  job.submissions.forEach((s) => {
    if (!kanbanStages.includes(s.stage)) {
      kanbanStages.push(s.stage);
    }
  });

  const submissionsByStage =
    kanbanStages.length > 0
      ? kanbanStages.map((stage) => ({
          stage,
          items: job.submissions.filter((s) => s.stage === stage),
        }))
      : pipelineStages.slice(0, 6).map((stage) => ({ stage, items: [] as typeof job.submissions }));

  const salaryStr = formatSalary(job.compensationMin, job.compensationMax);

  return (
    <div className="space-y-6">
      <Link
        href="/jobs"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Jobs
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <Badge
                className={
                  statusColors[job.status] || "bg-gray-100 text-gray-600"
                }
              >
                {job.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4 text-gray-400" />
              <Link
                href={`/companies`}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {job.company.name}
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
              )}
              {salaryStr && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {salaryStr}
                </span>
              )}
              {job.employmentType && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job.employmentType}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {job.openings} opening{job.openings !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              Submit Candidate
            </Button>
          </div>
        </div>
        {job.description && (
          <>
            <Separator className="my-4" />
            <p className="text-sm text-gray-600">{job.description}</p>
          </>
        )}
      </div>

      {/* Pipeline Kanban */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Candidate Pipeline
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {submissionsByStage.map(({ stage, items }) => (
            <div key={stage} className="flex-shrink-0 w-56">
              <div
                className={`rounded-t-lg px-3 py-2 text-sm font-medium border-b-2 ${
                  stageColors[stage] || "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                {stage} ({items.length})
              </div>
              <div className="bg-gray-50 rounded-b-lg min-h-[120px] p-2 space-y-2 border border-t-0 border-gray-200">
                {items.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">
                    No candidates
                  </p>
                ) : (
                  items.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/candidates/${sub.candidate.id}`}
                      className="block p-2.5 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {sub.candidate.firstName} {sub.candidate.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {sub.candidate.currentTitle || "—"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {daysInStage(sub.lastActivityAt)}d in stage
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Submissions */}
      {job.submissions.length > 0 && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              All Submissions ({job.submissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {job.submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <Link
                      href={`/candidates/${sub.candidate.id}`}
                      className="font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {sub.candidate.firstName} {sub.candidate.lastName}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Submitted{" "}
                      {new Date(sub.submittedAt).toLocaleDateString()}
                      {sub.submittedBy && ` by ${sub.submittedBy.name}`}
                    </p>
                  </div>
                  <Badge
                    className={
                      stageColors[sub.stage] || "bg-gray-100 text-gray-600"
                    }
                  >
                    {sub.stage}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
