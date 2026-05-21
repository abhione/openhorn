// ============================================================
// OpenHorn CRM - Mock Data
// ============================================================

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  status: "Active" | "Passive" | "Placed" | "Do Not Contact";
  skills: string[];
  source: string;
  owner: string;
  lastActivity: string;
  linkedIn?: string;
  summary?: string;
  experience?: WorkHistory[];
  education?: Education[];
}

export interface WorkHistory {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  year: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  companyId: number;
  status: "Open" | "Closed" | "On Hold";
  location: string;
  employmentType: "Full-Time" | "Contract" | "Contract-to-Hire" | "Part-Time";
  salaryMin: number;
  salaryMax: number;
  openings: number;
  submissions: number;
  priority: "High" | "Medium" | "Low";
  postedDate: string;
  description?: string;
  requirements?: string[];
  owner: string;
}

export interface Company {
  id: number;
  name: string;
  industry: string;
  status: "Active" | "Prospect" | "Inactive";
  website: string;
  openJobs: number;
  contacts: number;
  owner: string;
  location: string;
}

export interface Activity {
  id: number;
  type: "submission" | "interview" | "note" | "call" | "email" | "placement" | "status_change";
  description: string;
  user: string;
  timestamp: string;
  relatedEntity?: string;
  relatedEntityType?: "candidate" | "job" | "company";
}

export interface Submission {
  id: number;
  candidateId: number;
  candidateName: string;
  jobId: number;
  jobTitle: string;
  company: string;
  stage: "New Lead" | "Screening" | "Submitted" | "Interview" | "Offer" | "Placed";
  submittedDate: string;
  daysInStage: number;
  owner: string;
}

export interface Note {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  entityType: "candidate" | "job" | "company";
  entityId: number;
}

// ============================================================
// CANDIDATES
// ============================================================
export const candidates: Candidate[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Martinez",
    name: "John Martinez",
    title: "Senior Software Engineer",
    email: "john.martinez@email.com",
    phone: "(512) 555-0142",
    location: "Austin, TX",
    status: "Active",
    skills: ["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"],
    source: "LinkedIn",
    owner: "Sarah Chen",
    lastActivity: "2 hours ago",
    linkedIn: "linkedin.com/in/johnmartinez",
    summary: "Experienced full-stack engineer with 8+ years building scalable web applications. Strong background in React, TypeScript, and cloud infrastructure. Previously at Amazon and two YC startups.",
    experience: [
      { company: "TechVentures Inc", title: "Senior Software Engineer", startDate: "2022-03", endDate: "Present", description: "Led frontend architecture migration to Next.js, improving page load times by 40%." },
      { company: "Amazon Web Services", title: "Software Engineer II", startDate: "2019-06", endDate: "2022-02", description: "Built internal tooling for AWS Lambda team. Managed services handling 10M+ requests/day." },
      { company: "LaunchPad (YC S17)", title: "Full Stack Developer", startDate: "2017-01", endDate: "2019-05", description: "Employee #3. Built the core product from MVP to Series A." },
    ],
    education: [
      { school: "University of Texas at Austin", degree: "BS", field: "Computer Science", year: "2016" },
    ],
  },
  {
    id: 2,
    firstName: "Emily",
    lastName: "Nakamura",
    name: "Emily Nakamura",
    title: "Registered Nurse - ICU",
    email: "emily.nakamura@email.com",
    phone: "(415) 555-0198",
    location: "San Francisco, CA",
    status: "Active",
    skills: ["ICU", "ACLS", "BLS", "Ventilator Management", "Epic EMR"],
    source: "Referral",
    owner: "Mike Johnson",
    lastActivity: "1 day ago",
    linkedIn: "linkedin.com/in/emilynakamura",
    summary: "Dedicated ICU nurse with 6 years of critical care experience. Certified in ACLS and experienced with Epic EMR systems. Seeking travel nursing opportunities.",
    experience: [
      { company: "UCSF Medical Center", title: "ICU Registered Nurse", startDate: "2021-01", endDate: "Present", description: "Provide critical care for complex surgical and medical ICU patients." },
      { company: "Kaiser Permanente", title: "Staff Nurse - Med/Surg", startDate: "2018-06", endDate: "2020-12", description: "Transitioned from med/surg to critical care. Precepted 5 new graduate nurses." },
    ],
    education: [
      { school: "University of San Francisco", degree: "BSN", field: "Nursing", year: "2018" },
    ],
  },
  {
    id: 3,
    firstName: "David",
    lastName: "Thompson",
    name: "David Thompson",
    title: "Senior Accountant - CPA",
    email: "david.thompson@email.com",
    phone: "(312) 555-0167",
    location: "Chicago, IL",
    status: "Passive",
    skills: ["CPA", "GAAP", "SAP", "Financial Reporting", "Tax Compliance", "Excel"],
    source: "Job Board",
    owner: "Lisa Park",
    lastActivity: "3 days ago",
    linkedIn: "linkedin.com/in/davidthompson-cpa",
    summary: "CPA with 10+ years in corporate accounting and financial reporting. Expertise in GAAP compliance, tax preparation, and ERP systems. Currently employed but open to senior/manager roles.",
    experience: [
      { company: "Deloitte", title: "Senior Accountant", startDate: "2020-01", endDate: "Present", description: "Manage audit engagements for mid-market manufacturing clients." },
      { company: "BDO USA", title: "Staff Accountant", startDate: "2016-09", endDate: "2019-12", description: "Prepared financial statements and tax returns for diverse client portfolio." },
    ],
    education: [
      { school: "University of Illinois", degree: "MS", field: "Accountancy", year: "2016" },
      { school: "University of Illinois", degree: "BS", field: "Accounting", year: "2015" },
    ],
  },
  {
    id: 4,
    firstName: "Maria",
    lastName: "Rodriguez",
    name: "Maria Rodriguez",
    title: "DevOps Engineer",
    email: "maria.rodriguez@email.com",
    phone: "(206) 555-0133",
    location: "Seattle, WA",
    status: "Active",
    skills: ["Kubernetes", "Docker", "Terraform", "CI/CD", "Python", "AWS"],
    source: "LinkedIn",
    owner: "Sarah Chen",
    lastActivity: "5 hours ago",
  },
  {
    id: 5,
    firstName: "James",
    lastName: "Wilson",
    name: "James Wilson",
    title: "Project Manager - PMP",
    email: "james.wilson@email.com",
    phone: "(214) 555-0189",
    location: "Dallas, TX",
    status: "Active",
    skills: ["PMP", "Agile", "Scrum", "JIRA", "Stakeholder Management"],
    source: "Referral",
    owner: "Mike Johnson",
    lastActivity: "1 day ago",
  },
  {
    id: 6,
    firstName: "Aisha",
    lastName: "Patel",
    name: "Aisha Patel",
    title: "Data Scientist",
    email: "aisha.patel@email.com",
    phone: "(408) 555-0154",
    location: "San Jose, CA",
    status: "Active",
    skills: ["Python", "TensorFlow", "SQL", "Tableau", "Machine Learning"],
    source: "Career Fair",
    owner: "Lisa Park",
    lastActivity: "2 days ago",
  },
  {
    id: 7,
    firstName: "Robert",
    lastName: "Kim",
    name: "Robert Kim",
    title: "Mechanical Engineer",
    email: "robert.kim@email.com",
    phone: "(313) 555-0121",
    location: "Detroit, MI",
    status: "Placed",
    skills: ["SolidWorks", "AutoCAD", "FMEA", "GD&T", "Lean Manufacturing"],
    source: "Job Board",
    owner: "Sarah Chen",
    lastActivity: "1 week ago",
  },
  {
    id: 8,
    firstName: "Jennifer",
    lastName: "O'Brien",
    name: "Jennifer O'Brien",
    title: "Marketing Manager",
    email: "jennifer.obrien@email.com",
    phone: "(646) 555-0176",
    location: "New York, NY",
    status: "Active",
    skills: ["Digital Marketing", "SEO", "Google Ads", "HubSpot", "Content Strategy"],
    source: "LinkedIn",
    owner: "Mike Johnson",
    lastActivity: "4 hours ago",
  },
  {
    id: 9,
    firstName: "Carlos",
    lastName: "Mendez",
    name: "Carlos Mendez",
    title: "Electrical Engineer",
    email: "carlos.mendez@email.com",
    phone: "(713) 555-0145",
    location: "Houston, TX",
    status: "Passive",
    skills: ["PLC", "SCADA", "AutoCAD Electrical", "Power Systems", "NEC Code"],
    source: "Referral",
    owner: "Lisa Park",
    lastActivity: "5 days ago",
  },
  {
    id: 10,
    firstName: "Sarah",
    lastName: "Liu",
    name: "Sarah Liu",
    title: "UX Designer",
    email: "sarah.liu@email.com",
    phone: "(503) 555-0112",
    location: "Portland, OR",
    status: "Active",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],
    source: "Portfolio Review",
    owner: "Sarah Chen",
    lastActivity: "6 hours ago",
  },
  {
    id: 11,
    firstName: "Michael",
    lastName: "Brown",
    name: "Michael Brown",
    title: "Physical Therapist",
    email: "michael.brown@email.com",
    phone: "(602) 555-0134",
    location: "Phoenix, AZ",
    status: "Active",
    skills: ["Orthopedic PT", "Manual Therapy", "Sports Rehab", "EMR", "Patient Education"],
    source: "Job Board",
    owner: "Mike Johnson",
    lastActivity: "3 days ago",
  },
  {
    id: 12,
    firstName: "Amanda",
    lastName: "Foster",
    name: "Amanda Foster",
    title: "Financial Analyst",
    email: "amanda.foster@email.com",
    phone: "(617) 555-0198",
    location: "Boston, MA",
    status: "Do Not Contact",
    skills: ["Financial Modeling", "Excel", "Bloomberg", "Valuation", "SQL"],
    source: "LinkedIn",
    owner: "Lisa Park",
    lastActivity: "2 weeks ago",
  },
  {
    id: 13,
    firstName: "Kevin",
    lastName: "Nguyen",
    name: "Kevin Nguyen",
    title: "Cloud Architect",
    email: "kevin.nguyen@email.com",
    phone: "(425) 555-0167",
    location: "Bellevue, WA",
    status: "Active",
    skills: ["AWS", "Azure", "GCP", "Microservices", "Solution Architecture"],
    source: "Conference",
    owner: "Sarah Chen",
    lastActivity: "1 day ago",
  },
  {
    id: 14,
    firstName: "Rachel",
    lastName: "Adams",
    name: "Rachel Adams",
    title: "HR Business Partner",
    email: "rachel.adams@email.com",
    phone: "(404) 555-0143",
    location: "Atlanta, GA",
    status: "Passive",
    skills: ["Employee Relations", "HRIS", "Talent Development", "Workday", "Compensation"],
    source: "Referral",
    owner: "Mike Johnson",
    lastActivity: "4 days ago",
  },
  {
    id: 15,
    firstName: "Daniel",
    lastName: "Cooper",
    name: "Daniel Cooper",
    title: "Supply Chain Manager",
    email: "daniel.cooper@email.com",
    phone: "(704) 555-0188",
    location: "Charlotte, NC",
    status: "Active",
    skills: ["SAP", "Demand Planning", "Logistics", "Procurement", "Six Sigma"],
    source: "LinkedIn",
    owner: "Lisa Park",
    lastActivity: "8 hours ago",
  },
  {
    id: 16,
    firstName: "Stephanie",
    lastName: "Wright",
    name: "Stephanie Wright",
    title: "Cybersecurity Analyst",
    email: "stephanie.wright@email.com",
    phone: "(571) 555-0126",
    location: "Arlington, VA",
    status: "Active",
    skills: ["SIEM", "Penetration Testing", "CISSP", "Incident Response", "Python"],
    source: "Job Board",
    owner: "Sarah Chen",
    lastActivity: "12 hours ago",
  },
];

// ============================================================
// JOBS
// ============================================================
export const jobs: Job[] = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechFlow Solutions",
    companyId: 1,
    status: "Open",
    location: "Austin, TX (Hybrid)",
    employmentType: "Full-Time",
    salaryMin: 140000,
    salaryMax: 180000,
    openings: 2,
    submissions: 8,
    priority: "High",
    postedDate: "2026-05-01",
    owner: "Sarah Chen",
    description: "Looking for a Senior React Developer to join our growing engineering team. You will build and maintain our core SaaS platform used by 500+ enterprise clients.",
    requirements: ["5+ years React/TypeScript", "Experience with Next.js", "REST and GraphQL APIs", "AWS or GCP experience", "Strong communication skills"],
  },
  {
    id: 2,
    title: "ICU Travel Nurse",
    company: "Memorial Health System",
    companyId: 2,
    status: "Open",
    location: "Denver, CO",
    employmentType: "Contract",
    salaryMin: 2800,
    salaryMax: 3400,
    openings: 5,
    submissions: 12,
    priority: "High",
    postedDate: "2026-04-28",
    owner: "Mike Johnson",
    description: "13-week travel nurse assignment in our Level 1 Trauma Center ICU. Day and night shifts available.",
    requirements: ["Active RN license", "2+ years ICU experience", "BLS and ACLS certified", "Epic EMR experience preferred"],
  },
  {
    id: 3,
    title: "Staff Accountant",
    company: "Pinnacle Financial Group",
    companyId: 3,
    status: "Open",
    location: "Chicago, IL",
    employmentType: "Full-Time",
    salaryMin: 65000,
    salaryMax: 80000,
    openings: 1,
    submissions: 5,
    priority: "Medium",
    postedDate: "2026-05-10",
    owner: "Lisa Park",
    description: "Seeking a Staff Accountant to handle month-end close, journal entries, and account reconciliations for our investment management division.",
    requirements: ["CPA or CPA-eligible", "2+ years public or corporate accounting", "GAAP knowledge", "Excel proficiency", "SAP experience a plus"],
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudScale Inc",
    companyId: 4,
    status: "Open",
    location: "Remote",
    employmentType: "Full-Time",
    salaryMin: 130000,
    salaryMax: 165000,
    openings: 1,
    submissions: 6,
    priority: "High",
    postedDate: "2026-05-05",
    owner: "Sarah Chen",
  },
  {
    id: 5,
    title: "Marketing Director",
    company: "BrandVista Agency",
    companyId: 5,
    status: "Open",
    location: "New York, NY",
    employmentType: "Full-Time",
    salaryMin: 120000,
    salaryMax: 160000,
    openings: 1,
    submissions: 3,
    priority: "Medium",
    postedDate: "2026-05-12",
    owner: "Mike Johnson",
  },
  {
    id: 6,
    title: "Physical Therapist",
    company: "WellCare Rehabilitation",
    companyId: 6,
    status: "Open",
    location: "Phoenix, AZ",
    employmentType: "Full-Time",
    salaryMin: 75000,
    salaryMax: 95000,
    openings: 3,
    submissions: 4,
    priority: "Medium",
    postedDate: "2026-05-08",
    owner: "Mike Johnson",
  },
  {
    id: 7,
    title: "Data Engineer",
    company: "TechFlow Solutions",
    companyId: 1,
    status: "On Hold",
    location: "Austin, TX (Remote)",
    employmentType: "Full-Time",
    salaryMin: 125000,
    salaryMax: 155000,
    openings: 1,
    submissions: 2,
    priority: "Low",
    postedDate: "2026-04-20",
    owner: "Sarah Chen",
  },
  {
    id: 8,
    title: "Electrical Engineer",
    company: "Apex Energy Solutions",
    companyId: 7,
    status: "Open",
    location: "Houston, TX",
    employmentType: "Contract-to-Hire",
    salaryMin: 85000,
    salaryMax: 110000,
    openings: 2,
    submissions: 3,
    priority: "High",
    postedDate: "2026-05-15",
    owner: "Lisa Park",
  },
  {
    id: 9,
    title: "UX/UI Designer",
    company: "CloudScale Inc",
    companyId: 4,
    status: "Open",
    location: "Portland, OR (Hybrid)",
    employmentType: "Full-Time",
    salaryMin: 95000,
    salaryMax: 125000,
    openings: 1,
    submissions: 7,
    priority: "Medium",
    postedDate: "2026-05-03",
    owner: "Sarah Chen",
  },
  {
    id: 10,
    title: "Cybersecurity Analyst",
    company: "SecureNet Federal",
    companyId: 8,
    status: "Open",
    location: "Arlington, VA",
    employmentType: "Full-Time",
    salaryMin: 100000,
    salaryMax: 135000,
    openings: 2,
    submissions: 4,
    priority: "High",
    postedDate: "2026-05-07",
    owner: "Sarah Chen",
  },
  {
    id: 11,
    title: "Supply Chain Analyst",
    company: "Global Logistics Corp",
    companyId: 9,
    status: "Closed",
    location: "Charlotte, NC",
    employmentType: "Full-Time",
    salaryMin: 70000,
    salaryMax: 90000,
    openings: 0,
    submissions: 9,
    priority: "Low",
    postedDate: "2026-03-15",
    owner: "Lisa Park",
  },
  {
    id: 12,
    title: "HR Generalist",
    company: "BrandVista Agency",
    companyId: 5,
    status: "Open",
    location: "Atlanta, GA",
    employmentType: "Full-Time",
    salaryMin: 60000,
    salaryMax: 78000,
    openings: 1,
    submissions: 2,
    priority: "Low",
    postedDate: "2026-05-18",
    owner: "Mike Johnson",
  },
  {
    id: 13,
    title: "Cloud Solutions Architect",
    company: "TechFlow Solutions",
    companyId: 1,
    status: "Open",
    location: "Remote",
    employmentType: "Full-Time",
    salaryMin: 160000,
    salaryMax: 200000,
    openings: 1,
    submissions: 5,
    priority: "High",
    postedDate: "2026-05-14",
    owner: "Sarah Chen",
  },
];

// ============================================================
// COMPANIES
// ============================================================
export const companies: Company[] = [
  { id: 1, name: "TechFlow Solutions", industry: "Technology", status: "Active", website: "techflow.io", openJobs: 3, contacts: 4, owner: "Sarah Chen", location: "Austin, TX" },
  { id: 2, name: "Memorial Health System", industry: "Healthcare", status: "Active", website: "memorialhealth.org", openJobs: 2, contacts: 3, owner: "Mike Johnson", location: "Denver, CO" },
  { id: 3, name: "Pinnacle Financial Group", industry: "Financial Services", status: "Active", website: "pinnaclefg.com", openJobs: 1, contacts: 2, owner: "Lisa Park", location: "Chicago, IL" },
  { id: 4, name: "CloudScale Inc", industry: "Technology", status: "Active", website: "cloudscale.com", openJobs: 2, contacts: 3, owner: "Sarah Chen", location: "Seattle, WA" },
  { id: 5, name: "BrandVista Agency", industry: "Marketing", status: "Active", website: "brandvista.com", openJobs: 2, contacts: 2, owner: "Mike Johnson", location: "New York, NY" },
  { id: 6, name: "WellCare Rehabilitation", industry: "Healthcare", status: "Active", website: "wellcarerehab.com", openJobs: 1, contacts: 2, owner: "Mike Johnson", location: "Phoenix, AZ" },
  { id: 7, name: "Apex Energy Solutions", industry: "Energy", status: "Active", website: "apexenergy.com", openJobs: 1, contacts: 3, owner: "Lisa Park", location: "Houston, TX" },
  { id: 8, name: "SecureNet Federal", industry: "Government/Defense", status: "Active", website: "securenetfed.com", openJobs: 1, contacts: 2, owner: "Sarah Chen", location: "Arlington, VA" },
  { id: 9, name: "Global Logistics Corp", industry: "Logistics", status: "Inactive", website: "globallogistics.com", openJobs: 0, contacts: 1, owner: "Lisa Park", location: "Charlotte, NC" },
  { id: 10, name: "Summit Manufacturing", industry: "Manufacturing", status: "Prospect", website: "summitmfg.com", openJobs: 0, contacts: 1, owner: "Mike Johnson", location: "Detroit, MI" },
  { id: 11, name: "Horizon Education Group", industry: "Education", status: "Prospect", website: "horizonedu.org", openJobs: 0, contacts: 2, owner: "Lisa Park", location: "Boston, MA" },
  { id: 12, name: "Pacific Northwest Labs", industry: "Biotech", status: "Active", website: "pnwlabs.com", openJobs: 0, contacts: 3, owner: "Sarah Chen", location: "Portland, OR" },
];

// ============================================================
// ACTIVITIES
// ============================================================
export const activities: Activity[] = [
  { id: 1, type: "submission", description: "Sarah Chen submitted John Martinez to Senior React Developer at TechFlow Solutions", user: "Sarah Chen", timestamp: "2 hours ago" },
  { id: 2, type: "interview", description: "Mike Johnson scheduled interview for Emily Nakamura - ICU Travel Nurse at Memorial Health", user: "Mike Johnson", timestamp: "3 hours ago" },
  { id: 3, type: "note", description: "Lisa Park added note on David Thompson: 'Candidate interested in manager-level roles only'", user: "Lisa Park", timestamp: "5 hours ago" },
  { id: 4, type: "call", description: "Sarah Chen logged call with Kevin Nguyen - discussed Cloud Architect position at TechFlow", user: "Sarah Chen", timestamp: "6 hours ago" },
  { id: 5, type: "placement", description: "Robert Kim placed as Mechanical Engineer at Summit Manufacturing - $95K/year", user: "Sarah Chen", timestamp: "1 day ago" },
  { id: 6, type: "email", description: "Mike Johnson sent follow-up email to Jennifer O'Brien regarding Marketing Director role", user: "Mike Johnson", timestamp: "1 day ago" },
  { id: 7, type: "submission", description: "Lisa Park submitted Carlos Mendez to Electrical Engineer at Apex Energy Solutions", user: "Lisa Park", timestamp: "1 day ago" },
  { id: 8, type: "status_change", description: "Sarah Chen moved Maria Rodriguez to Interview stage for DevOps Engineer at CloudScale", user: "Sarah Chen", timestamp: "2 days ago" },
  { id: 9, type: "interview", description: "Lisa Park scheduled phone screen for Amanda Foster - Financial Analyst at Pinnacle Financial", user: "Lisa Park", timestamp: "2 days ago" },
  { id: 10, type: "note", description: "Mike Johnson added note on Memorial Health System: 'Budget approved for 5 additional travel nurses Q3'", user: "Mike Johnson", timestamp: "3 days ago" },
];

// ============================================================
// SUBMISSIONS (Pipeline cards)
// ============================================================
export const submissions: Submission[] = [
  { id: 1, candidateId: 1, candidateName: "John Martinez", jobId: 1, jobTitle: "Senior React Developer", company: "TechFlow Solutions", stage: "Submitted", submittedDate: "2026-05-18", daysInStage: 2, owner: "Sarah Chen" },
  { id: 2, candidateId: 2, candidateName: "Emily Nakamura", jobId: 2, jobTitle: "ICU Travel Nurse", company: "Memorial Health", stage: "Interview", submittedDate: "2026-05-10", daysInStage: 3, owner: "Mike Johnson" },
  { id: 3, candidateId: 4, candidateName: "Maria Rodriguez", jobId: 4, jobTitle: "DevOps Engineer", company: "CloudScale Inc", stage: "Interview", submittedDate: "2026-05-08", daysInStage: 5, owner: "Sarah Chen" },
  { id: 4, candidateId: 3, candidateName: "David Thompson", jobId: 3, jobTitle: "Staff Accountant", company: "Pinnacle Financial", stage: "Screening", submittedDate: "2026-05-15", daysInStage: 5, owner: "Lisa Park" },
  { id: 5, candidateId: 8, candidateName: "Jennifer O'Brien", jobId: 5, jobTitle: "Marketing Director", company: "BrandVista Agency", stage: "Submitted", submittedDate: "2026-05-16", daysInStage: 4, owner: "Mike Johnson" },
  { id: 6, candidateId: 10, candidateName: "Sarah Liu", jobId: 9, jobTitle: "UX/UI Designer", company: "CloudScale Inc", stage: "Offer", submittedDate: "2026-04-28", daysInStage: 2, owner: "Sarah Chen" },
  { id: 7, candidateId: 7, candidateName: "Robert Kim", jobId: 11, jobTitle: "Mechanical Engineer", company: "Summit Mfg", stage: "Placed", submittedDate: "2026-04-01", daysInStage: 0, owner: "Sarah Chen" },
  { id: 8, candidateId: 13, candidateName: "Kevin Nguyen", jobId: 13, jobTitle: "Cloud Solutions Architect", company: "TechFlow Solutions", stage: "Screening", submittedDate: "2026-05-17", daysInStage: 3, owner: "Sarah Chen" },
  { id: 9, candidateId: 6, candidateName: "Aisha Patel", jobId: 7, jobTitle: "Data Engineer", company: "TechFlow Solutions", stage: "New Lead", submittedDate: "2026-05-19", daysInStage: 1, owner: "Lisa Park" },
  { id: 10, candidateId: 9, candidateName: "Carlos Mendez", jobId: 8, jobTitle: "Electrical Engineer", company: "Apex Energy", stage: "Submitted", submittedDate: "2026-05-14", daysInStage: 6, owner: "Lisa Park" },
  { id: 11, candidateId: 16, candidateName: "Stephanie Wright", jobId: 10, jobTitle: "Cybersecurity Analyst", company: "SecureNet Federal", stage: "Screening", submittedDate: "2026-05-16", daysInStage: 4, owner: "Sarah Chen" },
  { id: 12, candidateId: 5, candidateName: "James Wilson", jobId: 1, jobTitle: "Senior React Developer", company: "TechFlow Solutions", stage: "New Lead", submittedDate: "2026-05-20", daysInStage: 0, owner: "Mike Johnson" },
  { id: 13, candidateId: 11, candidateName: "Michael Brown", jobId: 6, jobTitle: "Physical Therapist", company: "WellCare Rehab", stage: "Interview", submittedDate: "2026-05-12", daysInStage: 4, owner: "Mike Johnson" },
  { id: 14, candidateId: 15, candidateName: "Daniel Cooper", jobId: 11, jobTitle: "Supply Chain Analyst", company: "Global Logistics", stage: "Offer", submittedDate: "2026-04-20", daysInStage: 3, owner: "Lisa Park" },
  { id: 15, candidateId: 14, candidateName: "Rachel Adams", jobId: 12, jobTitle: "HR Generalist", company: "BrandVista Agency", stage: "New Lead", submittedDate: "2026-05-19", daysInStage: 1, owner: "Mike Johnson" },
];

// ============================================================
// NOTES
// ============================================================
export const notes: Note[] = [
  { id: 1, content: "Had a great initial call with John. Very strong React skills, enthusiastic about the TechFlow opportunity. Available to start in 2 weeks.", author: "Sarah Chen", createdAt: "2026-05-18 14:30", entityType: "candidate", entityId: 1 },
  { id: 2, content: "John's references check out - former manager at Amazon gave stellar review. Recommended moving forward quickly.", author: "Sarah Chen", createdAt: "2026-05-19 09:15", entityType: "candidate", entityId: 1 },
  { id: 3, content: "Emily prefers day shifts if available. Open to both Denver and Colorado Springs locations.", author: "Mike Johnson", createdAt: "2026-05-14 11:00", entityType: "candidate", entityId: 2 },
  { id: 4, content: "David is currently employed at Deloitte and wants to be discreet. Do not contact his current employer.", author: "Lisa Park", createdAt: "2026-05-17 16:45", entityType: "candidate", entityId: 3 },
  { id: 5, content: "TechFlow expanding engineering team significantly in Q3. Expect 5-8 more reqs coming.", author: "Sarah Chen", createdAt: "2026-05-15 10:00", entityType: "company", entityId: 1 },
];

// ============================================================
// PIPELINE STAGES
// ============================================================
export const pipelineStages = [
  "New Lead",
  "Screening",
  "Submitted",
  "Interview",
  "Offer",
  "Placed",
] as const;

export type PipelineStage = (typeof pipelineStages)[number];

// ============================================================
// DASHBOARD METRICS
// ============================================================
export const dashboardMetrics = {
  totalCandidates: 2847,
  activeJobs: 156,
  placementsThisMonth: 23,
  interviewsScheduled: 45,
};

export const pipelineFunnelData = [
  { stage: "Applied", count: 450 },
  { stage: "Screened", count: 280 },
  { stage: "Submitted", count: 165 },
  { stage: "Interview", count: 89 },
  { stage: "Offer", count: 34 },
  { stage: "Placed", count: 23 },
];

export const jobsNeedingAttention = [
  { id: 1, title: "Senior React Developer", company: "TechFlow Solutions", reason: "High priority - only 2 qualified submissions" },
  { id: 8, title: "Electrical Engineer", company: "Apex Energy Solutions", reason: "No submissions in 7 days" },
  { id: 10, title: "Cybersecurity Analyst", company: "SecureNet Federal", reason: "Client follow-up overdue" },
  { id: 2, title: "ICU Travel Nurse", company: "Memorial Health System", reason: "Start date approaching - 3 positions unfilled" },
  { id: 13, title: "Cloud Solutions Architect", company: "TechFlow Solutions", reason: "Hiring manager requested update" },
];
