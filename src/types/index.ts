// ─── Enums (as string unions since SQLite doesn't support DB enums) ──

export type UserRole = "ADMIN" | "RECRUITER" | "SALES" | "MANAGER";
export type UserStatus = "active" | "inactive" | "invited";

export type CandidateStatus =
  | "New"
  | "Active"
  | "Contacted"
  | "Interested"
  | "Submitted"
  | "Interviewing"
  | "Offered"
  | "Placed"
  | "Nurture"
  | "Do Not Contact"
  | "Archived";

export type CompanyStatus = "Prospect" | "Active Client" | "Inactive" | "Former Client";

export type JobOrderStatus = "Draft" | "Open" | "On Hold" | "Filled" | "Closed" | "Cancelled";
export type JobPriority = "Low" | "Medium" | "High" | "Urgent";
export type EmploymentType = "Full-Time" | "Contract" | "Contract-to-Hire" | "Part-Time" | "Per Diem";
export type FeeType = "Percentage" | "Flat Fee";

export type SubmissionStage =
  | "Sourced"
  | "Contacted"
  | "Interested"
  | "Internal Review"
  | "Submitted to Client"
  | "Client Reviewing"
  | "Interview Requested"
  | "Interview Scheduled"
  | "Interview Completed"
  | "Offer"
  | "Accepted"
  | "Placement Created"
  | "Rejected"
  | "Not Interested"
  | "No Show"
  | "Declined";

export type InterviewType = "Phone Screen" | "Video" | "In-Person" | "Panel" | "Technical";
export type InterviewStatus = "Scheduled" | "Completed" | "Cancelled" | "No Show";

export type PlacementStatus = "Pending Start" | "Active" | "Completed" | "Terminated" | "Cancelled" | "Closed";

export type ActivityType = "Call" | "Email" | "Meeting" | "Note" | "SMS" | "LinkedIn" | "Other";
export type ActivityDirection = "Inbound" | "Outbound";

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "Open" | "In Progress" | "Completed" | "Cancelled";

export type NoteVisibility = "team" | "private" | "public";

export type ContactStatus = "Active" | "Inactive" | "Left Company";

export type EntityType = "Candidate" | "Company" | "Contact" | "JobOrder" | "Placement";

// ─── Entity interfaces ──────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  workspaceId: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  teamId?: string | null;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  workspaceId: string;
  name: string;
  managerId?: string | null;
  createdAt: Date;
}

export interface Candidate {
  id: string;
  workspaceId: string;
  ownerId?: string | null;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  currentTitle?: string | null;
  status: CandidateStatus;
  skills: string;
  linkedinUrl?: string | null;
  summary?: string | null;
  source?: string | null;
  compensation?: string | null;
  availability?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateDocument {
  id: string;
  candidateId: string;
  fileName: string;
  fileKey: string;
  mimeType?: string | null;
  parsedText?: string | null;
  type: string;
  version: number;
  createdAt: Date;
}

export interface Company {
  id: string;
  workspaceId: string;
  ownerId?: string | null;
  name: string;
  website?: string | null;
  industry?: string | null;
  size?: string | null;
  status: CompanyStatus;
  billingTerms?: string | null;
  location?: string | null;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  workspaceId: string;
  companyId: string;
  ownerId?: string | null;
  firstName: string;
  lastName: string;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  status: ContactStatus;
  linkedinUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobOrder {
  id: string;
  workspaceId: string;
  companyId: string;
  contactId?: string | null;
  ownerId?: string | null;
  title: string;
  description?: string | null;
  employmentType?: EmploymentType | null;
  location?: string | null;
  openings: number;
  compensationMin?: number | null;
  compensationMax?: number | null;
  billRate?: number | null;
  feeType?: FeeType | null;
  feePercent?: number | null;
  priority: JobPriority;
  status: JobOrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Submission {
  id: string;
  candidateId: string;
  jobOrderId: string;
  stage: SubmissionStage;
  clientStage?: string | null;
  submittedAt: Date;
  submittedById?: string | null;
  rejectionReason?: string | null;
  lastActivityAt: Date;
}

export interface Interview {
  id: string;
  submissionId: string;
  scheduledAt: Date;
  type: InterviewType;
  locationOrLink?: string | null;
  status: InterviewStatus;
  feedback?: string | null;
  contactId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Placement {
  id: string;
  candidateId: string;
  jobOrderId: string;
  companyId: string;
  contactId?: string | null;
  ownerId?: string | null;
  startDate: Date;
  endDate?: Date | null;
  status: PlacementStatus;
  salary?: number | null;
  billRate?: number | null;
  payRate?: number | null;
  feeAmount?: number | null;
  guaranteeEndDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  workspaceId?: string | null;
  entityType: EntityType;
  entityId: string;
  userId?: string | null;
  candidateId?: string | null;
  type: ActivityType;
  direction?: ActivityDirection | null;
  subject?: string | null;
  body?: string | null;
  occurredAt: Date;
  dueAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
}

export interface Note {
  id: string;
  entityType: EntityType;
  entityId: string;
  authorId?: string | null;
  candidateId?: string | null;
  body: string;
  visibility: NoteVisibility;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  assigneeId?: string | null;
  entityType?: EntityType | null;
  entityId?: string | null;
  title: string;
  dueAt?: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  workspaceId: string;
  name: string;
  color?: string | null;
}

// ─── API response types ─────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalCandidates: number;
  activeCandidates: number;
  totalCompanies: number;
  activeJobs: number;
  totalSubmissions: number;
  placementsThisMonth: number;
  pipelineByStage: Record<string, number>;
  recentActivities: Activity[];
}

export interface SearchResults {
  candidates: Candidate[];
  companies: Company[];
  jobs: JobOrder[];
  contacts: Contact[];
}
