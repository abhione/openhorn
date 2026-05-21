"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Building2, Globe, MapPin, ArrowLeft, Users, Briefcase, FileText, Mail, Phone,
} from "lucide-react";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Prospect: "bg-blue-100 text-blue-700 border-blue-200",
  Inactive: "bg-gray-100 text-gray-500 border-gray-200",
};

const jobStatusColors: Record<string, string> = {
  Open: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "On Hold": "bg-amber-100 text-amber-700 border-amber-200",
  Closed: "bg-gray-100 text-gray-500 border-gray-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

interface Company {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  location: string | null;
  status: string;
  phone: string | null;
  size: string | null;
  billingTerms: string | null;
  owner: { id: string; name: string | null; email: string } | null;
  contacts: Contact[];
  jobOrders: JobOrder[];
  placements: Placement[];
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  status: string;
}

interface JobOrder {
  id: string;
  title: string;
  status: string;
  location: string | null;
  employmentType: string | null;
  createdAt: string;
}

interface Placement {
  id: string;
  status: string;
  startDate: string;
  salary: number | null;
  feeAmount: number | null;
  candidate: { id: string; firstName: string; lastName: string };
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/companies/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Company not found");
        return r.json();
      })
      .then((data) => {
        setCompany(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (error || !company) {
    return (
      <div className="space-y-4">
        <Link href="/companies" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Back to Companies
        </Link>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">{error || "Company not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/companies" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <Badge variant="outline" className={statusColors[company.status] || ""}>{company.status}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">{company.industry || "No industry set"}</p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">Edit Company</Button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {company.location && (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">{company.location}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {company.website && (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Website</p>
                <a href={company.website.startsWith("http") ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:underline">{company.website}</a>
              </div>
            </CardContent>
          </Card>
        )}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Contacts</p>
              <p className="text-sm font-medium text-gray-900">{company.contacts?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Job Orders</p>
              <p className="text-sm font-medium text-gray-900">{company.jobOrders?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts ({company.contacts?.length || 0})</TabsTrigger>
          <TabsTrigger value="jobs">Job Orders ({company.jobOrders?.length || 0})</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Industry</span>
                  <span className="font-medium text-gray-900">{company.industry || "—"}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Size</span>
                  <span className="font-medium text-gray-900">{company.size || "—"}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">{company.phone || "—"}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Billing Terms</span>
                  <span className="font-medium text-gray-900">{company.billingTerms || "—"}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Account Owner</span>
                  <span className="font-medium text-gray-900">{company.owner?.name || "—"}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Placements</CardTitle>
              </CardHeader>
              <CardContent>
                {company.placements && company.placements.length > 0 ? (
                  <div className="space-y-3">
                    {company.placements.map((p) => (
                      <div key={p.id} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{p.candidate.firstName} {p.candidate.lastName}</p>
                          <p className="text-gray-500">{new Date(p.startDate).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline">{p.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No placements yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <Card className="border border-gray-200 shadow-sm overflow-hidden">
            {company.contacts && company.contacts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {company.contacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</TableCell>
                      <TableCell className="text-gray-600">{contact.title || "—"}</TableCell>
                      <TableCell>
                        {contact.email ? (
                          <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:underline flex items-center gap-1">
                            <Mail className="w-3 h-3" />{contact.email}
                          </a>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        {contact.phone ? (
                          <span className="flex items-center gap-1 text-gray-600"><Phone className="w-3 h-3" />{contact.phone}</span>
                        ) : "—"}
                      </TableCell>
                      <TableCell><Badge variant="outline">{contact.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No contacts found for this company.</p>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="mt-4">
          <Card className="border border-gray-200 shadow-sm overflow-hidden">
            {company.jobOrders && company.jobOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {company.jobOrders.map((job) => (
                    <TableRow key={job.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/jobs/${job.id}`}>
                      <TableCell className="font-medium text-gray-900">{job.title}</TableCell>
                      <TableCell><Badge variant="outline" className={jobStatusColors[job.status] || ""}>{job.status}</Badge></TableCell>
                      <TableCell className="text-gray-600">{job.employmentType || "—"}</TableCell>
                      <TableCell className="text-gray-600">{job.location || "—"}</TableCell>
                      <TableCell className="text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No job orders found for this company.</p>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="py-12 text-center">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Notes feature coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
