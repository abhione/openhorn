"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Loader2 } from "lucide-react";
import { AddJobModal } from "@/components/add-job-modal";

interface Job {
  id: string;
  title: string;
  status: string;
  location: string | null;
  employmentType: string | null;
  compensationMin: number | null;
  compensationMax: number | null;
  openings: number;
  priority: string;
  createdAt: string;
  company: { id: string; name: string };
  owner?: { id: string; name: string } | null;
  _count?: { submissions: number; placements: number };
}

const statusColors: Record<string, string> = {
  Open: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Closed: "bg-red-100 text-red-700 border-red-200",
  "On Hold": "bg-amber-100 text-amber-700 border-amber-200",
  Draft: "bg-gray-100 text-gray-500 border-gray-200",
  Filled: "bg-blue-100 text-blue-700 border-blue-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-50 text-red-600 border-red-200",
  Urgent: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-amber-50 text-amber-600 border-amber-200",
  Low: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchJobs = useCallback(() => {
    setLoading(true);
    fetch("/api/jobs?pageSize=100")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch jobs");
        return r.json();
      })
      .then((res) => {
        setJobs(res.data || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const companyNames = useMemo(
    () => [...new Set(jobs.map((j) => j.company.name))].sort(),
    [jobs]
  );

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesSearch =
        searchQuery === "" ||
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.company.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || j.status === statusFilter;
      const matchesCompany =
        companyFilter === "all" || j.company.name === companyFilter;
      return matchesSearch && matchesStatus && matchesCompany;
    });
  }, [jobs, searchQuery, statusFilter, companyFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchJobs}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} jobs found
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Job
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search jobs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
            <SelectItem value="Filled">Filled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companyNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Openings</TableHead>
              <TableHead className="font-semibold">Submissions</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold">Posted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((job) => (
              <TableRow
                key={job.id}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600">
                  {job.company.name}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      statusColors[job.status] || "bg-gray-100 text-gray-600"
                    }
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{job.openings}</TableCell>
                <TableCell className="text-gray-600">
                  {job._count?.submissions ?? 0}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      priorityColors[job.priority] ||
                      "bg-gray-50 text-gray-500 border-gray-200"
                    }
                  >
                    {job.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {new Date(job.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-400"
                >
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddJobModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={fetchJobs}
      />
    </div>
  );
}
