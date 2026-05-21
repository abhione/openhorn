import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Helper ──────────────────────────────────────────────────
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function cuid(): string {
  return "c" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36).slice(-4);
}

// ─── Realistic data pools ────────────────────────────────────
const firstNames = [
  "James", "Maria", "Robert", "Jennifer", "Michael", "Linda", "David", "Sarah",
  "William", "Jessica", "Richard", "Emily", "Joseph", "Amanda", "Thomas", "Ashley",
  "Christopher", "Stephanie", "Daniel", "Nicole", "Matthew", "Elizabeth", "Anthony",
  "Megan", "Andrew", "Rachel", "Joshua", "Lauren", "Kevin", "Samantha", "Brian",
  "Katherine", "Brandon", "Rebecca", "Ryan", "Heather", "Jason", "Diane", "Justin",
  "Michelle", "Nathan", "Tiffany", "Aaron", "Christina", "Marcus", "Angela", "Derek",
  "Priya", "Wei", "Carlos",
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  "Patel", "Chen",
];

const cities = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "Austin, TX",
  "San Jose, CA", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
  "Indianapolis, IN", "San Francisco, CA", "Seattle, WA", "Denver, CO", "Nashville, TN",
  "Boston, MA", "Atlanta, GA", "Portland, OR", "Miami, FL", "Raleigh, NC",
  "Minneapolis, MN", "Tampa, FL", "Remote", "Hybrid - NYC", "Hybrid - Chicago",
];

const candidateSkillSets = [
  "JavaScript, React, Node.js, TypeScript",
  "Python, Django, PostgreSQL, AWS",
  "Java, Spring Boot, Microservices, Kubernetes",
  "C#, .NET, Azure, SQL Server",
  "React, Next.js, Tailwind CSS, GraphQL",
  "Python, Machine Learning, TensorFlow, Data Science",
  "AWS, Terraform, Docker, CI/CD",
  "Registered Nurse, ICU, Critical Care, BLS",
  "Licensed Practical Nurse, Geriatrics, Medication Administration",
  "Project Management, PMP, Agile, Scrum",
  "Salesforce, Apex, Lightning, Integration",
  "Data Analysis, SQL, Tableau, Power BI",
  "iOS, Swift, UIKit, SwiftUI",
  "Android, Kotlin, Jetpack Compose",
  "DevOps, Jenkins, GitLab CI, Ansible",
  "Ruby, Rails, PostgreSQL, Redis",
  "Go, gRPC, Kubernetes, Prometheus",
  "PHP, Laravel, MySQL, Redis",
  "Nursing, BSN, Patient Care, EMR",
  "Healthcare Administration, HIPAA, Compliance",
  "Accounting, CPA, QuickBooks, Financial Reporting",
  "Human Resources, Recruiting, HRIS, Benefits Administration",
  "Marketing, SEO, Google Analytics, Content Strategy",
  "Sales, CRM, B2B, Lead Generation",
  "Cybersecurity, CISSP, Penetration Testing, SIEM",
  "UI/UX Design, Figma, User Research, Prototyping",
  "Full Stack, React, Python, PostgreSQL, Docker",
  "Data Engineering, Spark, Airflow, Snowflake",
  "Technical Writing, API Documentation, Markdown",
  "Executive Assistant, Calendar Management, Travel Coordination",
];

const candidateTitles = [
  "Senior Software Engineer", "Full Stack Developer", "Frontend Developer",
  "Backend Engineer", "DevOps Engineer", "Data Scientist", "Product Manager",
  "Registered Nurse", "Licensed Practical Nurse", "Nurse Practitioner",
  "Project Manager", "Scrum Master", "Business Analyst", "Data Analyst",
  "Salesforce Administrator", "Cloud Architect", "iOS Developer",
  "Android Developer", "QA Engineer", "Security Analyst",
  "UI/UX Designer", "Technical Writer", "HR Generalist",
  "Staff Accountant", "Marketing Manager", "Sales Representative",
  "Healthcare Administrator", "Clinical Research Coordinator",
  "Executive Assistant", "Operations Manager",
];

const candidateStatuses = [
  "New", "New", "Active", "Active", "Active", "Active",
  "Contacted", "Contacted", "Interested", "Interested",
  "Submitted", "Submitted", "Interviewing",
  "Offered", "Placed", "Placed",
  "Nurture", "Nurture", "Archived",
];

const sources = [
  "LinkedIn", "LinkedIn", "LinkedIn", "Indeed", "Indeed",
  "Referral", "Referral", "Job Board", "Company Website",
  "Recruiter Sourced", "Career Fair", "Cold Call", "ZipRecruiter",
];

// ─── Companies ───────────────────────────────────────────────
const companyData = [
  { name: "Acme Healthcare Systems", industry: "Healthcare", size: "1001-5000", website: "https://acmehealthcare.example.com", location: "Boston, MA" },
  { name: "TechForce Solutions", industry: "Information Technology", size: "201-500", website: "https://techforce.example.com", location: "San Francisco, CA" },
  { name: "Summit Financial Group", industry: "Financial Services", size: "501-1000", website: "https://summitfinancial.example.com", location: "New York, NY" },
  { name: "Meridian Manufacturing", industry: "Manufacturing", size: "1001-5000", website: "https://meridianmfg.example.com", location: "Detroit, MI" },
  { name: "Coastal Energy Partners", industry: "Energy", size: "201-500", website: "https://coastalenergy.example.com", location: "Houston, TX" },
  { name: "NovaCare Medical Center", industry: "Healthcare", size: "501-1000", website: "https://novacare.example.com", location: "Philadelphia, PA" },
  { name: "Digital Dynamics Inc", industry: "Technology", size: "51-200", website: "https://digitaldynamics.example.com", location: "Austin, TX" },
  { name: "Pinnacle Consulting Group", industry: "Consulting", size: "201-500", website: "https://pinnaclecg.example.com", location: "Chicago, IL" },
  { name: "Horizon Biotech", industry: "Biotechnology", size: "51-200", website: "https://horizonbiotech.example.com", location: "San Diego, CA" },
  { name: "Atlas Logistics Corp", industry: "Transportation & Logistics", size: "1001-5000", website: "https://atlaslogistics.example.com", location: "Atlanta, GA" },
  { name: "Greenfield Education", industry: "Education", size: "201-500", website: "https://greenfieldedu.example.com", location: "Denver, CO" },
  { name: "Sterling Insurance", industry: "Insurance", size: "501-1000", website: "https://sterlinginsurance.example.com", location: "Hartford, CT" },
  { name: "Nexus Cloud Technologies", industry: "Cloud Computing", size: "51-200", website: "https://nexuscloud.example.com", location: "Seattle, WA" },
  { name: "Patriot Defense Systems", industry: "Defense & Aerospace", size: "1001-5000", website: "https://patriotdefense.example.com", location: "Arlington, VA" },
  { name: "Bloom Retail Group", industry: "Retail", size: "501-1000", website: "https://bloomretail.example.com", location: "Minneapolis, MN" },
];

const contactTitles = [
  "VP of Engineering", "Director of Talent Acquisition", "Hiring Manager",
  "Chief Technology Officer", "VP of Nursing", "Director of Operations",
  "Head of People", "Engineering Manager", "Director of IT",
  "VP of Human Resources", "Chief Nursing Officer", "Technical Lead",
  "Department Manager", "Senior Director of Engineering", "HR Business Partner",
];

// ─── Job titles for job orders ───────────────────────────────
const jobOrderData = [
  { title: "Senior Software Engineer", type: "Full-Time", compMin: 130000, compMax: 170000, bill: 95, desc: "We are looking for a senior software engineer to join our platform team. You will design and build scalable backend services, mentor junior developers, and collaborate with product managers to define technical architecture." },
  { title: "Registered Nurse - ICU", type: "Full-Time", compMin: 75000, compMax: 95000, bill: 65, desc: "Seeking an experienced ICU Registered Nurse for a Level 1 Trauma Center. Must have current RN license, BLS/ACLS certifications, and at least 2 years of critical care experience." },
  { title: "DevOps Engineer", type: "Contract", compMin: 140000, compMax: 180000, bill: 110, desc: "Contract DevOps role to help migrate legacy infrastructure to Kubernetes. Experience with AWS, Terraform, and CI/CD pipelines required." },
  { title: "Project Manager", type: "Full-Time", compMin: 95000, compMax: 125000, bill: 80, desc: "Lead cross-functional projects from initiation to delivery. PMP certification preferred. Experience with Agile/Scrum methodologies required." },
  { title: "Data Analyst", type: "Full-Time", compMin: 70000, compMax: 95000, bill: 60, desc: "Analyze business data, create dashboards, and provide actionable insights. Proficiency in SQL, Python, and Tableau required." },
  { title: "Full Stack Developer", type: "Contract-to-Hire", compMin: 110000, compMax: 145000, bill: 90, desc: "Build and maintain web applications using React and Node.js. Experience with TypeScript and PostgreSQL preferred." },
  { title: "Nurse Practitioner", type: "Full-Time", compMin: 105000, compMax: 130000, bill: 85, desc: "Primary care Nurse Practitioner needed for outpatient clinic. Must have NP license, DEA, and 3+ years experience." },
  { title: "Cloud Architect", type: "Contract", compMin: 160000, compMax: 200000, bill: 130, desc: "Design multi-cloud architecture for enterprise migration. AWS Solutions Architect certification required." },
  { title: "Salesforce Administrator", type: "Full-Time", compMin: 80000, compMax: 110000, bill: 70, desc: "Manage and customize Salesforce CRM platform. Salesforce Admin certification required. Experience with Apex and Lightning preferred." },
  { title: "QA Automation Engineer", type: "Full-Time", compMin: 100000, compMax: 130000, bill: 85, desc: "Design and implement automated testing frameworks. Experience with Selenium, Cypress, or Playwright required." },
  { title: "HR Generalist", type: "Full-Time", compMin: 60000, compMax: 80000, bill: 50, desc: "Support HR operations including recruiting, onboarding, benefits administration, and employee relations." },
  { title: "Cybersecurity Analyst", type: "Full-Time", compMin: 110000, compMax: 145000, bill: 95, desc: "Monitor security systems, investigate incidents, and implement security controls. CISSP or CompTIA Security+ preferred." },
  { title: "Marketing Manager", type: "Full-Time", compMin: 85000, compMax: 115000, bill: 75, desc: "Lead digital marketing strategy including SEO, content marketing, and paid advertising campaigns." },
  { title: "iOS Mobile Developer", type: "Contract", compMin: 130000, compMax: 165000, bill: 105, desc: "Build native iOS applications using Swift and SwiftUI. Experience with RESTful APIs and Core Data required." },
  { title: "Licensed Practical Nurse", type: "Per Diem", compMin: 45000, compMax: 60000, bill: 42, desc: "Per diem LPN needed for skilled nursing facility. Current LPN license and medication administration experience required." },
  { title: "Business Intelligence Developer", type: "Full-Time", compMin: 95000, compMax: 125000, bill: 80, desc: "Build BI solutions using Power BI and SQL Server. Experience with data warehousing and ETL processes." },
  { title: "Technical Writer", type: "Contract", compMin: 75000, compMax: 95000, bill: 65, desc: "Create API documentation, user guides, and technical specifications for SaaS platform." },
  { title: "Staff Accountant", type: "Full-Time", compMin: 55000, compMax: 75000, bill: 48, desc: "Handle general ledger, month-end close, and financial reporting. CPA preferred." },
  { title: "Machine Learning Engineer", type: "Full-Time", compMin: 150000, compMax: 200000, bill: 120, desc: "Design and deploy ML models for recommendation systems. Experience with Python, TensorFlow, and cloud ML platforms required." },
  { title: "Executive Assistant", type: "Full-Time", compMin: 55000, compMax: 75000, bill: 45, desc: "Support C-suite executives with calendar management, travel coordination, and meeting preparation." },
  { title: "React Frontend Developer", type: "Contract-to-Hire", compMin: 115000, compMax: 150000, bill: 95, desc: "Build responsive web applications with React, TypeScript, and modern CSS. Experience with Next.js preferred." },
  { title: "Clinical Research Coordinator", type: "Full-Time", compMin: 60000, compMax: 80000, bill: 55, desc: "Coordinate clinical trials, manage participant enrollment, and ensure regulatory compliance." },
  { title: "Supply Chain Analyst", type: "Full-Time", compMin: 65000, compMax: 85000, bill: 55, desc: "Analyze supply chain operations, optimize inventory, and improve logistics efficiency." },
  { title: "Senior Java Developer", type: "Full-Time", compMin: 135000, compMax: 175000, bill: 100, desc: "Build enterprise Java applications using Spring Boot and microservices architecture. Experience with Kafka and Kubernetes." },
  { title: "Operations Manager", type: "Full-Time", compMin: 80000, compMax: 110000, bill: 70, desc: "Oversee daily operations, manage teams, improve processes, and drive operational excellence." },
];

const submissionStages = [
  "Sourced", "Sourced", "Contacted", "Contacted", "Interested",
  "Internal Review", "Internal Review", "Submitted to Client",
  "Submitted to Client", "Client Reviewing", "Client Reviewing",
  "Interview Requested", "Interview Scheduled", "Interview Completed",
  "Interview Completed", "Offer", "Accepted", "Placement Created",
  "Rejected", "Rejected", "Not Interested", "Declined",
];

const activityTypes = ["Call", "Email", "Meeting", "Email", "Call", "Email", "LinkedIn", "SMS"];
const activitySubjects = [
  "Initial outreach call", "Follow-up email regarding position",
  "Phone screen completed", "Discussed job opportunity",
  "Sent resume to hiring manager", "Scheduling interview",
  "Client feedback call", "Reference check call",
  "Offer discussion", "Onboarding paperwork review",
  "Candidate availability check", "Job order intake meeting",
  "Client relationship check-in", "Sourcing strategy discussion",
  "Pipeline review meeting", "Salary negotiation call",
  "LinkedIn InMail sent", "Interview prep call",
  "Placement follow-up", "Weekly status update email",
];

const tagData = [
  { name: "JavaScript", color: "#F7DF1E" },
  { name: "Python", color: "#3776AB" },
  { name: "React", color: "#61DAFB" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Node.js", color: "#339933" },
  { name: "AWS", color: "#FF9900" },
  { name: "Java", color: "#ED8B00" },
  { name: "Nursing", color: "#E91E63" },
  { name: "Healthcare", color: "#F44336" },
  { name: "Project Management", color: "#9C27B0" },
  { name: "DevOps", color: "#0288D1" },
  { name: "Data Science", color: "#4CAF50" },
  { name: "Salesforce", color: "#00A1E0" },
  { name: "Cybersecurity", color: "#F44336" },
  { name: "Mobile Development", color: "#AB47BC" },
  { name: "Full Stack", color: "#607D8B" },
  { name: "Cloud Architecture", color: "#FF5722" },
  { name: "HR", color: "#795548" },
  { name: "Finance", color: "#2E7D32" },
  { name: "Marketing", color: "#FF6F00" },
];

// ─── Main seed function ──────────────────────────────────────
async function main() {
  console.log("🌱 Seeding OpenHorn database...\n");

  // Clean existing data
  await prisma.$transaction([
    prisma.tagOnCandidate.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.activity.deleteMany(),
    prisma.note.deleteMany(),
    prisma.task.deleteMany(),
    prisma.interview.deleteMany(),
    prisma.placement.deleteMany(),
    prisma.submission.deleteMany(),
    prisma.candidateDocument.deleteMany(),
    prisma.jobOrder.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.candidate.deleteMany(),
    prisma.company.deleteMany(),
    prisma.user.deleteMany(),
    prisma.team.deleteMany(),
    prisma.workspace.deleteMany(),
  ]);

  // ── Workspace ──
  const workspace = await prisma.workspace.create({
    data: {
      id: cuid(),
      name: "OpenHorn Staffing",
      slug: "openhorn-staffing",
      plan: "professional",
    },
  });
  console.log(`✅ Created workspace: ${workspace.name}`);

  // ── Teams ──
  const recruitingTeam = await prisma.team.create({
    data: { id: cuid(), workspaceId: workspace.id, name: "Recruiting Team" },
  });
  const salesTeam = await prisma.team.create({
    data: { id: cuid(), workspaceId: workspace.id, name: "Sales Team" },
  });
  console.log(`✅ Created 2 teams`);

  // ── Users ──
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: cuid(),
        workspaceId: workspace.id,
        email: "admin@openhorn.com",
        name: "Alex Morgan",
        role: "ADMIN",
        status: "ACTIVE",
        password: adminPassword,
        teamId: recruitingTeam.id,
      },
    }),
    prisma.user.create({
      data: {
        id: cuid(),
        workspaceId: workspace.id,
        email: "sarah.recruiter@openhorn.com",
        name: "Sarah Chen",
        role: "RECRUITER",
        status: "ACTIVE",
        password: userPassword,
        teamId: recruitingTeam.id,
      },
    }),
    prisma.user.create({
      data: {
        id: cuid(),
        workspaceId: workspace.id,
        email: "mike.sales@openhorn.com",
        name: "Mike Johnson",
        role: "SALES",
        status: "ACTIVE",
        password: userPassword,
        teamId: salesTeam.id,
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // ── Tags ──
  const tags = await Promise.all(
    tagData.map((t) =>
      prisma.tag.create({
        data: { id: cuid(), workspaceId: workspace.id, name: t.name, color: t.color },
      })
    )
  );
  console.log(`✅ Created ${tags.length} tags`);

  // ── Candidates (50) ──
  const candidates = [];
  for (let i = 0; i < 50; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const skillSet = candidateSkillSets[i % candidateSkillSets.length];
    const title = candidateTitles[i % candidateTitles.length];
    const status = randomItem(candidateStatuses);

    const candidate = await prisma.candidate.create({
      data: {
        id: cuid(),
        workspaceId: workspace.id,
        ownerId: randomItem(users).id,
        firstName: fn,
        lastName: ln,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@email.com`,
        phone: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
        location: randomItem(cities),
        currentTitle: title,
        status,
        skills: skillSet,
        linkedinUrl: `https://linkedin.com/in/${fn.toLowerCase()}-${ln.toLowerCase()}-${randomInt(1000, 9999)}`,
        summary: `Experienced ${title.toLowerCase()} with ${randomInt(2, 15)} years of experience. Skilled in ${skillSet.split(", ").slice(0, 2).join(" and ")}. Looking for new opportunities in a collaborative environment.`,
        source: randomItem(sources),
        compensation: `$${randomInt(50, 200)}k`,
        availability: randomItem(["Immediate", "2 weeks notice", "1 month notice", "Currently employed", "Available"]),
        createdAt: randomDate(new Date("2024-06-01"), new Date()),
      },
    });
    candidates.push(candidate);
  }
  console.log(`✅ Created ${candidates.length} candidates`);

  // ── Tag candidates ──
  let tagAssignments = 0;
  for (const candidate of candidates) {
    const numTags = randomInt(1, 4);
    const usedTagIds = new Set<string>();
    for (let t = 0; t < numTags; t++) {
      const tag = randomItem(tags);
      if (!usedTagIds.has(tag.id)) {
        usedTagIds.add(tag.id);
        await prisma.tagOnCandidate.create({
          data: { id: cuid(), tagId: tag.id, candidateId: candidate.id },
        });
        tagAssignments++;
      }
    }
  }
  console.log(`✅ Created ${tagAssignments} tag assignments`);

  // ── Companies (15) ──
  const companies = [];
  const companyStatuses = ["Active Client", "Active Client", "Active Client", "Prospect", "Prospect", "Former Client"];
  for (const cd of companyData) {
    const company = await prisma.company.create({
      data: {
        id: cuid(),
        workspaceId: workspace.id,
        ownerId: randomItem(users).id,
        name: cd.name,
        website: cd.website,
        industry: cd.industry,
        size: cd.size,
        status: randomItem(companyStatuses),
        billingTerms: randomItem(["Net 30", "Net 45", "Net 60", "Due on receipt"]),
        location: cd.location,
        phone: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
      },
    });
    companies.push(company);
  }
  console.log(`✅ Created ${companies.length} companies`);

  // ── Contacts (30) ──
  const contacts = [];
  for (let i = 0; i < 30; i++) {
    const company = companies[i % companies.length];
    const fn = firstNames[(i + 25) % firstNames.length];
    const ln = lastNames[(i + 25) % lastNames.length];
    const title = contactTitles[i % contactTitles.length];

    const contact = await prisma.contact.create({
      data: {
        id: cuid(),
        workspaceId: workspace.id,
        companyId: company.id,
        ownerId: randomItem(users).id,
        firstName: fn,
        lastName: ln,
        title,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${company.name.toLowerCase().replace(/[\s&]+/g, "").slice(0, 12)}.com`,
        phone: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
        status: randomItem(["Active", "Active", "Active", "Inactive"]),
        linkedinUrl: `https://linkedin.com/in/${fn.toLowerCase()}-${ln.toLowerCase()}-${randomInt(1000, 9999)}`,
      },
    });
    contacts.push(contact);
  }
  console.log(`✅ Created ${contacts.length} contacts`);

  // ── Job Orders (25) ──
  const jobOrders = [];
  const jobStatuses = ["Open", "Open", "Open", "Open", "Draft", "On Hold", "Filled", "Closed"];
  for (let i = 0; i < 25; i++) {
    const jd = jobOrderData[i % jobOrderData.length];
    const company = companies[i % companies.length];
    const companyContacts = contacts.filter((c) => c.companyId === company.id);
    const contact = companyContacts.length > 0 ? randomItem(companyContacts) : null;

    const job = await prisma.jobOrder.create({
      data: {
        id: cuid(),
        workspaceId: workspace.id,
        companyId: company.id,
        contactId: contact?.id,
        ownerId: randomItem(users).id,
        title: jd.title,
        description: jd.desc,
        employmentType: jd.type,
        location: randomItem(cities),
        openings: randomInt(1, 3),
        compensationMin: jd.compMin,
        compensationMax: jd.compMax,
        billRate: jd.bill,
        feeType: jd.type === "Full-Time" ? "Percentage" : "Flat Fee",
        feePercent: jd.type === "Full-Time" ? randomInt(18, 25) : null,
        priority: randomItem(["Low", "Medium", "Medium", "High", "High", "Urgent"]),
        status: randomItem(jobStatuses),
        createdAt: randomDate(new Date("2024-09-01"), new Date()),
      },
    });
    jobOrders.push(job);
  }
  console.log(`✅ Created ${jobOrders.length} job orders`);

  // ── Submissions (40) ──
  const submissions = [];
  const usedPairs = new Set<string>();
  for (let i = 0; i < 40; i++) {
    let candidate, job;
    let pairKey: string;
    let attempts = 0;
    do {
      candidate = randomItem(candidates);
      job = randomItem(jobOrders);
      pairKey = `${candidate.id}-${job.id}`;
      attempts++;
    } while (usedPairs.has(pairKey) && attempts < 100);

    if (usedPairs.has(pairKey)) continue;
    usedPairs.add(pairKey);

    const stage = randomItem(submissionStages);
    const submission = await prisma.submission.create({
      data: {
        id: cuid(),
        candidateId: candidate.id,
        jobOrderId: job.id,
        stage,
        clientStage: ["Submitted to Client", "Client Reviewing", "Interview Requested", "Interview Scheduled", "Interview Completed", "Offer", "Accepted", "Placement Created"].includes(stage) ? stage : null,
        submittedById: randomItem(users).id,
        rejectionReason: stage === "Rejected" ? randomItem(["Not a culture fit", "Insufficient experience", "Client passed", "Salary mismatch", "Position filled"]) : null,
        submittedAt: randomDate(new Date("2024-10-01"), new Date()),
        lastActivityAt: randomDate(new Date("2025-01-01"), new Date()),
      },
    });
    submissions.push(submission);
  }
  console.log(`✅ Created ${submissions.length} submissions`);

  // ── Interviews (for relevant submissions) ──
  const interviewSubmissions = submissions.filter((s) =>
    ["Interview Scheduled", "Interview Completed", "Offer", "Accepted", "Placement Created"].includes(s.stage)
  );
  let interviewCount = 0;
  for (const sub of interviewSubmissions) {
    const numInterviews = randomInt(1, 3);
    for (let i = 0; i < numInterviews; i++) {
      await prisma.interview.create({
        data: {
          id: cuid(),
          submissionId: sub.id,
          scheduledAt: randomDate(new Date("2025-01-01"), new Date("2025-06-30")),
          type: randomItem(["Phone Screen", "Video", "In-Person", "Panel", "Technical"]),
          locationOrLink: randomItem([
            "https://zoom.us/j/" + randomInt(1000000000, 9999999999),
            "https://teams.microsoft.com/meet/" + cuid(),
            "123 Main St, Conference Room B",
            "Video call - link to be sent",
          ]),
          status: sub.stage === "Interview Scheduled" ? "Scheduled" : randomItem(["Completed", "Completed", "Completed", "No Show"]),
          feedback: sub.stage !== "Interview Scheduled" ? randomItem([
            "Strong technical skills, good culture fit. Recommend proceeding.",
            "Candidate was well-prepared and articulate. Move to next round.",
            "Decent background but lacks specific experience needed. Pass.",
            "Excellent communication skills. Client impressed.",
            "Good overall but concerns about tenure at previous companies.",
            null,
          ]) : null,
          contactId: randomItem(contacts).id,
        },
      });
      interviewCount++;
    }
  }
  console.log(`✅ Created ${interviewCount} interviews`);

  // ── Placements (10) ──
  const acceptedSubmissions = submissions.filter((s) =>
    ["Accepted", "Placement Created"].includes(s.stage)
  );
  const placementCandidates = acceptedSubmissions.length > 0
    ? acceptedSubmissions
    : submissions.slice(0, 10);

  const placements = [];
  for (let i = 0; i < Math.min(10, placementCandidates.length); i++) {
    const sub = placementCandidates[i];
    const job = jobOrders.find((j) => j.id === sub.jobOrderId)!;
    const company = companies.find((c) => c.id === job.companyId)!;
    const companyContacts = contacts.filter((c) => c.companyId === company.id);

    const startDate = randomDate(new Date("2025-01-01"), new Date("2025-06-01"));
    const salary = randomInt(55000, 200000);

    const placement = await prisma.placement.create({
      data: {
        id: cuid(),
        candidateId: sub.candidateId,
        jobOrderId: sub.jobOrderId,
        companyId: company.id,
        contactId: companyContacts.length > 0 ? randomItem(companyContacts).id : null,
        ownerId: randomItem(users).id,
        startDate,
        endDate: job.employmentType === "Contract" ? new Date(startDate.getTime() + 180 * 24 * 60 * 60 * 1000) : null,
        status: randomItem(["Active", "Active", "Active", "Pending Start", "Completed"]),
        salary,
        billRate: job.billRate,
        payRate: job.billRate ? job.billRate * 0.65 : null,
        feeAmount: job.feeType === "Percentage" && job.feePercent ? salary * (job.feePercent / 100) : randomInt(8000, 25000),
        guaranteeEndDate: new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000),
      },
    });
    placements.push(placement);
  }
  console.log(`✅ Created ${placements.length} placements`);

  // ── Activities (100) ──
  const allEntities: { type: string; id: string; candidateId?: string }[] = [
    ...candidates.map((c) => ({ type: "Candidate", id: c.id, candidateId: c.id })),
    ...companies.map((c) => ({ type: "Company", id: c.id })),
    ...contacts.map((c) => ({ type: "Contact", id: c.id })),
    ...jobOrders.map((j) => ({ type: "JobOrder", id: j.id })),
  ];

  for (let i = 0; i < 100; i++) {
    const entity = randomItem(allEntities);
    const type = randomItem(activityTypes);
    await prisma.activity.create({
      data: {
        id: cuid(),
        workspaceId: workspace.id,
        entityType: entity.type,
        entityId: entity.id,
        userId: randomItem(users).id,
        candidateId: entity.type === "Candidate" ? entity.candidateId : null,
        type,
        direction: randomItem(["Inbound", "Outbound", "Outbound"]),
        subject: randomItem(activitySubjects),
        body: `${type} activity - ${randomItem(activitySubjects).toLowerCase()}. Follow up needed: ${randomItem(["Yes", "No", "Pending"])}.`,
        occurredAt: randomDate(new Date("2024-10-01"), new Date()),
        completedAt: Math.random() > 0.3 ? randomDate(new Date("2024-10-01"), new Date()) : null,
      },
    });
  }
  console.log(`✅ Created 100 activities`);

  // ── Notes (30) ──
  const noteContents = [
    "Candidate seems very motivated and has strong technical skills.",
    "Discussed salary expectations - within range for this role.",
    "Client was impressed with the candidate's background.",
    "Need to follow up on reference checks before proceeding.",
    "Candidate prefers remote work - confirmed with client this is acceptable.",
    "Strong culture fit based on initial conversation.",
    "Resume needs updating before sending to client.",
    "Candidate has competing offers - need to move quickly.",
    "Client budget may be tight for this candidate's expectations.",
    "Great rapport with hiring manager during initial call.",
  ];

  for (let i = 0; i < 30; i++) {
    const entity = randomItem(allEntities);
    await prisma.note.create({
      data: {
        id: cuid(),
        entityType: entity.type,
        entityId: entity.id,
        authorId: randomItem(users).id,
        candidateId: entity.type === "Candidate" ? entity.candidateId : null,
        body: randomItem(noteContents),
        visibility: randomItem(["team", "team", "private"]),
        createdAt: randomDate(new Date("2024-10-01"), new Date()),
      },
    });
  }
  console.log(`✅ Created 30 notes`);

  // ── Tasks (20) ──
  const taskTitles = [
    "Follow up with candidate", "Send updated resume to client",
    "Schedule interview", "Check references", "Prepare offer letter",
    "Client check-in call", "Update candidate status", "Review job requirements",
    "Send onboarding paperwork", "Pipeline review for Q2",
  ];

  for (let i = 0; i < 20; i++) {
    const entity = randomItem(allEntities);
    await prisma.task.create({
      data: {
        id: cuid(),
        assigneeId: randomItem(users).id,
        entityType: entity.type,
        entityId: entity.id,
        title: randomItem(taskTitles),
        dueAt: randomDate(new Date(), new Date("2025-08-01")),
        priority: randomItem(["Low", "Medium", "Medium", "High", "Urgent"]),
        status: randomItem(["Open", "Open", "Open", "In Progress", "Completed"]),
      },
    });
  }
  console.log(`✅ Created 20 tasks`);

  console.log("\n🎉 Seeding complete! Database is ready.\n");

  // Summary
  const counts = await Promise.all([
    prisma.workspace.count(),
    prisma.user.count(),
    prisma.team.count(),
    prisma.candidate.count(),
    prisma.company.count(),
    prisma.contact.count(),
    prisma.jobOrder.count(),
    prisma.submission.count(),
    prisma.interview.count(),
    prisma.placement.count(),
    prisma.activity.count(),
    prisma.note.count(),
    prisma.task.count(),
    prisma.tag.count(),
    prisma.tagOnCandidate.count(),
  ]);

  const labels = [
    "Workspaces", "Users", "Teams", "Candidates", "Companies", "Contacts",
    "Job Orders", "Submissions", "Interviews", "Placements", "Activities",
    "Notes", "Tasks", "Tags", "Tag Assignments",
  ];

  console.log("📊 Database summary:");
  labels.forEach((label, i) => {
    console.log(`   ${label}: ${counts[i]}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
