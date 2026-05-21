"use client";

import { use, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink as LinkedinIcon,
  Edit,
  StickyNote,
  Send,
  Calendar,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface CandidateDetail {
  id: string;
  firstName: string;
  lastName: string;
  currentTitle: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  status: string;
  skills: string;
  source: string | null;
  linkedinUrl: string | null;
  summary: string | null;
  compensation: string | null;
  availability: string | null;
  updatedAt: string;
  owner?: { id: string; name: string } | null;
  submissions: Array<{
    id: string;
    stage: string;
    submittedAt: string;
    lastActivityAt: string;
    jobOrder: {
      id: string;
      title: string;
      company: { id: string; name: string };
    };
  }>;
  activities: Array<{
    id: string;
    type: string;
    subject: string | null;
    body: string | null;
    occurredAt: string;
  }>;
  notes: Array<{
    id: string;
    body: string;
    createdAt: string;
    author?: { id: string; name: string } | null;
  }>;
  documents: Array<{
    id: string;
    fileName: string;
    type: string;
    createdAt: string;
  }>;
}

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  New: "bg-blue-100 text-blue-700 border-blue-200",
  Contacted: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Passive: "bg-amber-100 text-amber-700 border-amber-200",
  Placed: "bg-blue-100 text-blue-700 border-blue-200",
  "Do Not Contact": "bg-red-100 text-red-700 border-red-200",
};

const stageColors: Record<string, string> = {
  Sourced: "bg-gray-100 text-gray-600",
  Contacted: "bg-blue-100 text-blue-700",
  "Internal Review": "bg-indigo-100 text-indigo-700",
  "Submitted to Client": "bg-purple-100 text-purple-700",
  "Interview Scheduled": "bg-amber-100 text-amber-700",
  "Interview Completed": "bg-orange-100 text-orange-700",
  Offer: "bg-amber-100 text-amber-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  "Placement Created": "bg-emerald-100 text-emerald-700",
};

export default function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/candidates/${id}`)
      .then((r) => {
        if (r.status === 404) throw new Error("Candidate not found");
        if (!r.ok) throw new Error("Failed to fetch candidate");
        return r.json();
      })
      .then(setCandidate)
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

  if (error || !candidate) {
    return (
      <div className="space-y-4">
        <Link
          href="/candidates"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Candidates
        </Link>
        <div className="text-center py-12">
          <p className="text-red-600">
            {error || "Candidate not found"}
          </p>
        </div>
      </div>
    );
  }

  const skills = candidate.skills
    ? candidate.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const daysInStage = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/candidates"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Candidates
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600">
              {candidate.firstName[0]}
              {candidate.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {candidate.firstName} {candidate.lastName}
                </h1>
                <Badge
                  variant="outline"
                  className={
                    statusColors[candidate.status] ||
                    "bg-gray-100 text-gray-600"
                  }
                >
                  {candidate.status}
                </Badge>
              </div>
              <p className="text-gray-600 mt-0.5">
                {candidate.currentTitle || "No title"}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                {candidate.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {candidate.email}
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {candidate.phone}
                  </span>
                )}
                {candidate.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {candidate.location}
                  </span>
                )}
                {candidate.linkedinUrl && (
                  <span className="flex items-center gap-1">
                    <LinkedinIcon className="w-4 h-4" />
                    {candidate.linkedinUrl}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <StickyNote className="w-4 h-4 mr-1" />
              Add Note
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-4 h-4 mr-1" />
              Submit to Job
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">
            Jobs ({candidate.submissions.length})
          </TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="notes">
            Notes ({candidate.notes.length})
          </TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Summary */}
              {candidate.summary && (
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {candidate.summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Compensation & Availability */}
              {(candidate.compensation || candidate.availability) && (
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {candidate.compensation && (
                      <div>
                        <span className="text-gray-500">Compensation: </span>
                        <span className="text-gray-900">
                          {candidate.compensation}
                        </span>
                      </div>
                    )}
                    {candidate.availability && (
                      <div>
                        <span className="text-gray-500">Availability: </span>
                        <span className="text-gray-900">
                          {candidate.availability}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Source</span>
                    <span className="text-gray-900">
                      {candidate.source || "—"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Owner</span>
                    <span className="text-gray-900">
                      {candidate.owner?.name || "—"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="text-gray-900">
                      {timeAgo(candidate.updatedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No skills listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="mt-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-0">
              {candidate.submissions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Send className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No job submissions yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {candidate.submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div>
                        <Link
                          href={`/jobs/${sub.jobOrder.id}`}
                          className="font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          {sub.jobOrder.title}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {sub.jobOrder.company.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            stageColors[sub.stage] ||
                            "bg-gray-100 text-gray-600"
                          }
                        >
                          {sub.stage}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {daysInStage(sub.lastActivityAt)}d in stage
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="mt-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              {candidate.activities.length > 0 ? (
                <div className="space-y-4">
                  {candidate.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-700">
                          {activity.subject || activity.body || activity.type}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.occurredAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-6">
                  <p>No activities yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              {candidate.notes.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  <StickyNote className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No notes yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {candidate.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 bg-amber-50 rounded-lg border border-amber-100"
                    >
                      <p className="text-sm text-gray-700">{note.body}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span>{note.author?.name || "Unknown"}</span>
                        <span>·</span>
                        <span>
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8 text-center text-gray-500">
              {candidate.documents.length === 0 ? (
                <>
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No documents uploaded yet</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Upload Document
                  </Button>
                </>
              ) : (
                <div className="space-y-2 text-left">
                  {candidate.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {doc.type} ·{" "}
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
