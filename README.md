# 🦏 OpenHorn ATS

Open-source Applicant Tracking System for staffing and recruiting agencies.

**Live Demo:** [openhorn.fly.dev](https://openhorn.fly.dev)

Login: `admin@openhorn.com` / `admin123`

## Features

- **Dashboard** — KPI cards, pipeline funnel chart, recent activity feed
- **Candidates** — Search, filter, add/view candidates with full profiles
- **Jobs** — Job orders with company associations, salary ranges, pipeline view
- **Companies** — Client companies with contacts, job orders, and notes
- **Contacts** — Client contact management linked to companies
- **Pipeline** — Drag-and-drop kanban board for submission stages
- **Placements** — Track placements with salary, fees, and status
- **Search** — Cross-entity search across candidates, jobs, companies, contacts
- **Auth** — Login/register with role-based access (Admin, Manager, Recruiter)
- **Settings** — User profile, workspace config, user management

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Prisma + SQLite (swap to Postgres for production)
- **Auth:** NextAuth v5 (credentials provider, JWT sessions)
- **UI:** Tailwind CSS + shadcn/ui + Radix primitives + Lucide icons
- **Charts:** Recharts
- **Deployment:** Docker + Fly.io

## Quick Start

```bash
git clone https://github.com/abhione/openhorn.git
cd openhorn
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Open [localhost:3000](http://localhost:3000). Login with `admin@openhorn.com` / `admin123`.

## Project Structure

```
src/
├── app/
│   ├── (app)/           # Authenticated routes
│   │   ├── dashboard/   # KPI dashboard
│   │   ├── candidates/  # Candidate list + detail
│   │   ├── jobs/        # Job orders + detail
│   │   ├── companies/   # Company list + detail
│   │   ├── contacts/    # Contact management
│   │   ├── pipeline/    # Kanban board
│   │   ├── placements/  # Placement tracking
│   │   ├── search/      # Global search
│   │   └── settings/    # User + workspace settings
│   ├── api/             # REST API routes (14 groups)
│   ├── login/           # Auth pages
│   └── register/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── sidebar.tsx      # Navigation
│   ├── topbar.tsx       # Header with search + user menu
│   └── add-*-modal.tsx  # Create forms
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── prisma.ts        # Prisma client
│   └── rbac.ts          # Role-based access control
└── prisma/
    ├── schema.prisma    # 16 models
    └── seed.ts          # Realistic demo data (50 candidates, 15 companies, 25 jobs)
```

## Data Model

16 Prisma models: User, Workspace, Team, Candidate, Company, Contact, JobOrder, Submission, Interview, Placement, Activity, Note, Task, Tag + join tables.

## API

All routes under `/api/`:

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/candidates` | GET, POST | List/create candidates |
| `/api/candidates/[id]` | GET, PUT, DELETE | Candidate CRUD |
| `/api/jobs` | GET, POST | List/create job orders |
| `/api/jobs/[id]` | GET, PUT, DELETE | Job order CRUD |
| `/api/companies` | GET, POST | List/create companies |
| `/api/companies/[id]` | GET, PUT, DELETE | Company CRUD |
| `/api/contacts` | GET, POST | List/create contacts |
| `/api/submissions` | GET, POST | List/create submissions |
| `/api/placements` | GET, POST | List/create placements |
| `/api/dashboard/stats` | GET | Dashboard aggregates |
| `/api/search` | GET | Cross-entity search |
| `/api/users` | GET | User management |
| `/api/register` | POST | User registration |

## Docker

```bash
docker build -t openhorn .
docker run -p 3000:3000 -v openhorn_data:/data openhorn
```

## Deploy to Fly.io

```bash
fly launch --name your-app-name
fly deploy
```

## License

MIT
