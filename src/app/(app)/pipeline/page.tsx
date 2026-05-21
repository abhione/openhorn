"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Submission {
  id: string;
  candidateId: string;
  stage: string;
  submittedAt: string;
  lastActivityAt: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    currentTitle: string | null;
  };
  jobOrder: {
    id: string;
    title: string;
    company: { id: string; name: string };
  };
  submittedBy?: { id: string; name: string } | null;
}

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

const stageColors: Record<string, { bg: string; border: string; header: string }> = {
  Sourced: { bg: "bg-gray-50", border: "border-gray-200", header: "bg-gray-100 text-gray-700" },
  Contacted: { bg: "bg-blue-50", border: "border-blue-200", header: "bg-blue-100 text-blue-700" },
  Interested: { bg: "bg-cyan-50", border: "border-cyan-200", header: "bg-cyan-100 text-cyan-700" },
  "Internal Review": { bg: "bg-indigo-50", border: "border-indigo-200", header: "bg-indigo-100 text-indigo-700" },
  "Submitted to Client": { bg: "bg-indigo-50", border: "border-indigo-200", header: "bg-indigo-100 text-indigo-700" },
  "Client Reviewing": { bg: "bg-purple-50", border: "border-purple-200", header: "bg-purple-100 text-purple-700" },
  "Interview Scheduled": { bg: "bg-amber-50", border: "border-amber-200", header: "bg-amber-100 text-amber-700" },
  "Interview Completed": { bg: "bg-orange-50", border: "border-orange-200", header: "bg-orange-100 text-orange-700" },
  Offer: { bg: "bg-amber-50", border: "border-amber-200", header: "bg-amber-100 text-amber-700" },
  Accepted: { bg: "bg-emerald-50", border: "border-emerald-200", header: "bg-emerald-100 text-emerald-700" },
  "Placement Created": { bg: "bg-emerald-50", border: "border-emerald-200", header: "bg-emerald-100 text-emerald-700" },
};

const defaultColors = { bg: "bg-gray-50", border: "border-gray-200", header: "bg-gray-100 text-gray-700" };

export default function PipelinePage() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/submissions?pageSize=200")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch submissions");
        return r.json();
      })
      .then((res) => {
        setSubs(res.data || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const destStage = result.destination.droppableId;
    const subId = result.draggableId;
    setSubs((prev) =>
      prev.map((s) =>
        s.id === subId
          ? { ...s, stage: destStage, lastActivityAt: new Date().toISOString() }
          : s
      )
    );
    // Optionally PATCH the submission stage
    fetch(`/api/submissions/${subId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: destStage }),
    }).catch(() => {});
  };

  const daysInStage = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
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
      </div>
    );
  }

  // Determine which stages to show - all standard stages, plus any extra stages from data
  const dataStages = new Set(subs.map((s) => s.stage));
  const visibleStages = [...pipelineStages];
  dataStages.forEach((s) => {
    if (!visibleStages.includes(s)) visibleStages.push(s);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
        <p className="text-sm text-gray-500 mt-1">
          Drag and drop candidates between stages
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {visibleStages.map((stage) => {
            const stageItems = subs.filter((s) => s.stage === stage);
            const colors = stageColors[stage] || defaultColors;
            return (
              <div key={stage} className="flex-shrink-0 w-64">
                <div
                  className={`rounded-t-lg px-3 py-2.5 text-sm font-semibold ${colors.header} flex items-center justify-between`}
                >
                  <span>{stage}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stageItems.length}
                  </Badge>
                </div>
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-b-lg min-h-[400px] p-2 space-y-2 border border-t-0 ${
                        colors.border
                      } ${
                        snapshot.isDraggingOver ? "bg-indigo-50" : colors.bg
                      } transition-colors`}
                    >
                      {stageItems.map((sub, index) => (
                        <Draggable
                          key={sub.id}
                          draggableId={sub.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 bg-white rounded-lg border border-gray-200 ${
                                snapshot.isDragging
                                  ? "shadow-lg ring-2 ring-indigo-300"
                                  : "shadow-sm"
                              } transition-shadow`}
                            >
                              <Link
                                href={`/candidates/${sub.candidate.id}`}
                                className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                              >
                                {sub.candidate.firstName}{" "}
                                {sub.candidate.lastName}
                              </Link>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {sub.jobOrder.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {sub.jobOrder.company.name}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">
                                  {daysInStage(sub.lastActivityAt)}d in stage
                                </span>
                                <span className="text-xs text-gray-400">
                                  {sub.submittedBy?.name || ""}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
