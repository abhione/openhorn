"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search as SearchIcon,
  Users,
  Briefcase,
  Building2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface SearchResults {
  candidates: Array<{
    id: string;
    firstName: string;
    lastName: string;
    currentTitle: string | null;
    status: string;
    location: string | null;
    skills: string;
  }>;
  jobs: Array<{
    id: string;
    title: string;
    status: string;
    location: string | null;
    company: { id: string; name: string };
  }>;
  companies: Array<{
    id: string;
    name: string;
    industry: string | null;
    status: string;
    location: string | null;
  }>;
  contacts: Array<{
    id: string;
    firstName: string;
    lastName: string;
    title: string | null;
    company?: { id: string; name: string };
  }>;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setResults(null);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => {
          if (!r.ok) throw new Error("Search failed");
          return r.json();
        })
        .then(setResults)
        .catch(() => setResults(null))
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const hasResults =
    results &&
    (results.candidates.length > 0 ||
      results.jobs.length > 0 ||
      results.companies.length > 0 ||
      results.contacts.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search</h1>
        <p className="text-sm text-gray-500 mt-1">
          Find candidates, jobs, and companies
        </p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by name, title, skills, company..."
          className="pl-12 py-6 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      )}

      {query.length >= 2 && !loading && !hasResults && (
        <div className="text-center py-12 text-gray-500">
          <SearchIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}

      {results && results.candidates.length > 0 && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Candidates ({results.candidates.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {results.candidates.map((c) => {
                const skills = c.skills
                  ? c.skills
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : [];
                return (
                  <Link
                    key={c.id}
                    href={`/candidates/${c.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {c.currentTitle || "No title"} ·{" "}
                          {c.location || "No location"}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {skills.slice(0, 3).map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {results && results.jobs.length > 0 && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Jobs ({results.jobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {results.jobs.map((j) => (
                <Link
                  key={j.id}
                  href={`/jobs/${j.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{j.title}</p>
                      <p className="text-sm text-gray-500">
                        {j.company.name} · {j.location || "No location"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        j.status === "Open"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {j.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results && results.companies.length > 0 && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Companies ({results.companies.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {results.companies.map((c) => (
                <Link
                  key={c.id}
                  href={`/companies/${c.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-sm text-gray-500">
                        {c.industry || "—"} · {c.location || "—"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        c.status === "Active Client"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {c.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {query.length < 2 && !loading && (
        <div className="text-center py-12 text-gray-400">
          <SearchIcon className="w-12 h-12 mx-auto mb-3 text-gray-200" />
          <p>Type at least 2 characters to search</p>
        </div>
      )}
    </div>
  );
}
