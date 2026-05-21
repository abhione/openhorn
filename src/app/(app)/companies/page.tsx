"use client";

import { useState, useMemo, useEffect } from "react";
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

interface Company {
  id: string;
  name: string;
  industry: string | null;
  status: string;
  website: string | null;
  location: string | null;
  phone: string | null;
  owner?: { id: string; name: string } | null;
  _count?: { contacts: number; jobOrders: number; placements: number };
}

const statusColors: Record<string, string> = {
  "Active Client": "bg-emerald-100 text-emerald-700 border-emerald-200",
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Prospect: "bg-blue-100 text-blue-700 border-blue-200",
  Inactive: "bg-gray-100 text-gray-500 border-gray-200",
  "Former Client": "bg-gray-100 text-gray-500 border-gray-200",
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/companies?pageSize=100")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch companies");
        return r.json();
      })
      .then((res) => {
        setCompanies(res.data || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.industry || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [companies, searchQuery, statusFilter]);

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} companies
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search companies..."
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
            <SelectItem value="Active Client">Active Client</SelectItem>
            <SelectItem value="Prospect">Prospect</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Former Client">Former Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Industry</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Open Jobs</TableHead>
              <TableHead className="font-semibold">Contacts</TableHead>
              <TableHead className="font-semibold">Owner</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((company) => (
              <TableRow
                key={company.id}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <TableCell>
                  <Link
                    href={`/companies/${company.id}`}
                    className="font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    {company.name}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600">
                  {company.industry || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      statusColors[company.status] ||
                      "bg-gray-100 text-gray-500"
                    }
                  >
                    {company.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {company._count?.jobOrders ?? 0}
                </TableCell>
                <TableCell className="text-gray-600">
                  {company._count?.contacts ?? 0}
                </TableCell>
                <TableCell className="text-gray-600">
                  {company.owner?.name || "—"}
                </TableCell>
                <TableCell className="text-gray-500">
                  {company.location || "—"}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-400"
                >
                  No companies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
