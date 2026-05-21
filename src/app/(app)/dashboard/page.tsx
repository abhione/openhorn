"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Briefcase,
  Trophy,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), {
  ssr: false,
});
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), {
  ssr: false,
});

interface DashboardStats {
  totalCandidates: number;
  activeCandidates: number;
  totalCompanies: number;
  activeJobs: number;
  totalSubmissions: number;
  placementsThisMonth: number;
  pipelineByStage: Record<string, number>;
  candidatesByStatus: Record<string, number>;
  jobsByStatus: Record<string, number>;
  recentActivities: Array<{
    id: string;
    type: string;
    subject?: string;
    body?: string;
    occurredAt: string;
    user?: { id: string; name: string };
  }>;
}

const barColors = [
  "#6366f1",
  "#818cf8",
  "#a5b4fc",
  "#c7d2fe",
  "#e0e7ff",
  "#eef2ff",
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load dashboard");
        return r.json();
      })
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "Failed to load dashboard"}</p>
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Total Candidates",
      value: stats.totalCandidates.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      change: `${stats.activeCandidates} active`,
    },
    {
      label: "Active Jobs",
      value: stats.activeJobs.toString(),
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      change: `${stats.totalSubmissions} total submissions`,
    },
    {
      label: "Placements This Month",
      value: stats.placementsThisMonth.toString(),
      icon: Trophy,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      change: "this month",
    },
    {
      label: "Companies",
      value: stats.totalCompanies.toString(),
      icon: Calendar,
      color: "text-amber-600",
      bg: "bg-amber-50",
      change: "in system",
    },
  ];

  const pipelineFunnelData = Object.entries(stats.pipelineByStage).map(
    ([stage, count]) => ({ stage, count })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back. Here&apos;s your recruiting overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="border border-gray-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {kpi.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {kpi.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpi.change}
                  </p>
                </div>
                <div className={`p-2.5 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Funnel Chart */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Pipeline Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pipelineFunnelData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineFunnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="stage"
                      width={80}
                      tick={{ fontSize: 13 }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {pipelineFunnelData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={barColors[index % barColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No pipeline data yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Jobs by Status */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Jobs by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.jobsByStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {status}
                    </p>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                </div>
              ))}
              {Object.keys(stats.jobsByStatus).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No jobs yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActivities.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      {activity.subject || activity.body || activity.type}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {activity.user?.name && `${activity.user.name} · `}
                      {new Date(activity.occurredAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No recent activity
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "submission":
    case "Submission":
      return <ArrowRight className="w-4 h-4 text-indigo-600" />;
    case "interview":
    case "Interview":
    case "Meeting":
      return <Calendar className="w-4 h-4 text-blue-600" />;
    case "placement":
    case "Placement":
      return <Trophy className="w-4 h-4 text-emerald-600" />;
    default:
      return <Users className="w-4 h-4 text-gray-500" />;
  }
}
