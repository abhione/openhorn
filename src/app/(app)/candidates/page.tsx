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
import { Search, Plus, Filter, Loader2 } from "lucide-react";
import { AddCandidateModal } from "@/components/add-candidate-modal";

interface Candidate {
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
  updatedAt: string;
  owner?: { id: string; name: string } | null;
  _count?: { submissions: number; placements: number };
}

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  New: "bg-blue-100 text-blue-700 border-blue-200",
  Contacted: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Interested: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Passive: "bg-amber-100 text-amber-700 border-amber-200",
  Placed: "bg-blue-100 text-blue-700 border-blue-200",
  "Do Not Contact": "bg-red-100 text-red-700 border-red-200",
  Archived: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCandidates = useCallback(() => {
    setLoading(true);
    fetch("/api/candidates?pageSize=100")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch candidates");
        return r.json();
      })
      .then((res) => {
        setCandidates(res.data || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const locations = useMemo(
    () =>
      [
        ...new Set(
          candidates.map((c) => c.location).filter(Boolean) as string[]
        ),
      ].sort(),
    [candidates]
  );

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase();
      const title = (c.currentTitle || "").toLowerCase();
      const skillsList = c.skills
        ? c.skills.split(",").map((s) => s.trim().toLowerCase())
        : [];
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        name.includes(q) ||
        title.includes(q) ||
        skillsList.some((s) => s.includes(q));
      const matchesStatus =
        statusFilter === "all" || c.status === statusFilter;
      const matchesLocation =
        locationFilter === "all" || c.location === locationFilter;
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [candidates, searchQuery, statusFilter, locationFilter]);

  const getSkillsArray = (skills: string): string[] => {
    if (!skills) return [];
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
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
        <Button variant="outline" className="mt-4" onClick={fetchCandidates}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} candidates found
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, title, or skills..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Interested">Interested</SelectItem>
            <SelectItem value="Passive">Passive</SelectItem>
            <SelectItem value="Placed">Placed</SelectItem>
            <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Skills</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Owner</TableHead>
              <TableHead className="font-semibold">Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((candidate) => {
              const skills = getSkillsArray(candidate.skills);
              return (
                <TableRow
                  key={candidate.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <TableCell>
                    <Link
                      href={`/candidates/${candidate.id}`}
                      className="font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {candidate.firstName} {candidate.lastName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {candidate.currentTitle || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        statusColors[candidate.status] ||
                        "bg-gray-100 text-gray-600"
                      }
                    >
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-600"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {skills.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-400"
                        >
                          +{skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {candidate.location || "—"}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {candidate.owner?.name || "—"}
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {timeAgo(candidate.updatedAt)}
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-400"
                >
                  No candidates found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddCandidateModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={fetchCandidates}
      />
    </div>
  );
}
