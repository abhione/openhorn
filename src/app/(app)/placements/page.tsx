"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Trophy, Plus } from "lucide-react";

const statusColors: Record<string, string> = {
  "Pending Start": "bg-amber-100 text-amber-700 border-amber-200",
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Completed: "bg-blue-100 text-blue-700 border-blue-200",
  "Fell Off": "bg-red-100 text-red-700 border-red-200",
  Cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

interface Placement {
  id: string;
  status: string;
  startDate: string;
  endDate: string | null;
  salary: number | null;
  billRate: number | null;
  payRate: number | null;
  feeAmount: number | null;
  candidate: { id: string; firstName: string; lastName: string; currentTitle: string | null } | null;
  jobOrder: { id: string; title: string } | null;
  company: { id: string; name: string } | null;
  owner: { id: string; name: string | null } | null;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function formatCurrency(amount: number | null) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/placements")
      .then((r) => r.json())
      .then((data) => {
        setPlacements(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Placements</h1>
          <p className="text-sm text-gray-500 mt-1">{placements.length} placements</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700"><Plus className="w-4 h-4 mr-2" />New Placement</Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Candidate</TableHead>
                <TableHead className="font-semibold">Job Title</TableHead>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Start Date</TableHead>
                <TableHead className="font-semibold">Salary</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placements.map((p) => (
                <TableRow key={p.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {p.candidate ? `${p.candidate.firstName} ${p.candidate.lastName}` : "—"}
                  </TableCell>
                  <TableCell className="text-gray-600">{p.jobOrder?.title || "—"}</TableCell>
                  <TableCell className="text-gray-600">{p.company?.name || "—"}</TableCell>
                  <TableCell className="text-gray-600">
                    {p.startDate ? new Date(p.startDate).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-gray-600">{formatCurrency(p.salary)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[p.status] || ""}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium">{formatCurrency(p.feeAmount)}</TableCell>
                </TableRow>
              ))}
              {placements.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    No placements yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
