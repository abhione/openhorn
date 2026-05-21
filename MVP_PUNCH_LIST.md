# OpenHorn MVP Punch List

_Generated: 2026-05-20_
_Assessment of what needs polishing for MVP quality_

---

## P0 — CRITICAL (App is broken without these)

### 1. Auth Flow is Completely Broken
**Files:** `src/lib/auth.ts`, `prisma/schema.prisma`, `prisma/seed.ts`, `.env`

- **Status casing mismatch:** Auth checks `status: "ACTIVE"` (uppercase) but schema defaults to `status: "active"` (lowercase). No user can ever log in.
- **Seed has no passwords:** `prisma/seed.ts` creates users without any password field. Credentials auth requires a password to compare against.
- **Demo credentials are wrong:** Login page shows `admin@openhorn.com / admin123` but seed uses `admin@openhorn.dev` emails.
- **Missing AUTH_SECRET:** `.env` only has `DATABASE_URL`. NextAuth v5 requires `AUTH_SECRET` — auth will fail in production without it.
- **Fix:** Set seed passwords (hashed), fix status casing to match, add AUTH_SECRET to .env, update demo credential hints.

### 2. `brand-*` Tailwind Colors Not Defined
**Files:** `src/app/login/page.tsx`, `src/app/register/page.tsx`, `tailwind.config.ts`

- Login and Register pages use `brand-50`, `brand-500`, `brand-600`, `brand-700` extensively (gradient bg, headings, buttons, links, focus rings).
- These colors are NOT defined in `tailwind.config.ts`. 
- **Result:** Login/Register buttons are invisible (white-on-white), branded text is unstyled, focus rings missing. The first thing a user sees is broken.
- **Fix:** Add `brand` color palette to tailwind.config.ts (map to indigo to match the rest of the app).

### 3. Duplicate next.config Files
**Files:** `next.config.js`, `next.config.mjs`

- Both exist with different configs. Only one should be used. `next.config.mjs` has `ignoreBuildErrors: true` which masks real issues.
- **Fix:** Delete one (keep .mjs if using ESM), merge configs.

---

## P1 — HIGH (Core functionality gaps)

### 4. Frontend Uses 100% Mock Data — Not Connected to APIs
**Files:** All pages in `src/app/(app)/`

- Dashboard, Candidates, Jobs, Companies, Pipeline, Search pages ALL import from `@/lib/mock-data` (hardcoded static arrays).
- API routes exist with full CRUD + Prisma DB queries, but **zero frontend pages call them**.
- The UI is a static demo. Creating/editing data is impossible.
- **Fix:** Refactor pages to fetch from API routes. This is the biggest effort item.

### 5. SessionProvider Missing from Root Layout
**Files:** `src/app/layout.tsx`, `src/components/providers/session-provider.tsx`

- `SessionProvider` component exists but is never used in any layout.
- `useSession()` calls (in `header.tsx`) will return null since there's no provider.
- Client-side auth state is broken.
- **Fix:** Wrap `{children}` in `SessionProvider` in root layout.

### 6. Topbar Shows Hardcoded User — No Sign Out
**Files:** `src/components/topbar.tsx`

- Topbar always shows "Sarah Chen / Senior Recruiter" regardless of who's logged in.
- Sign out menu item does nothing (no `signOut()` call).
- A separate `header.tsx` exists with real auth but is **never used** — the app uses `topbar.tsx` instead.
- **Fix:** Either integrate real session data into topbar, or swap to header.tsx. Wire up signOut.

### 7. No Company Detail Page
**Files:** `src/app/(app)/companies/`

- Companies list page exists but rows are **not clickable** (no `<Link>` to detail page).
- There is no `companies/[id]/page.tsx` file.
- **Fix:** Create company detail page with contacts list, job orders, notes.

### 8. No Contacts Page
- Schema has Contact model, API route exists (`/api/contacts`), but **no frontend page**.
- A recruiter needs to manage client contacts.
- **Fix:** Create `/contacts` page or embed contacts in company detail pages.

---

## P2 — MEDIUM (Polish & UX issues)

### 9. All "Add" / "Edit" / Action Buttons Are Non-Functional
**Files:** All list and detail pages

- "Add Candidate", "Add Job", "Add Company" buttons → no form, no modal, no action.
- Candidate detail "Edit", "Add Note", "Submit to Job", "Schedule" buttons → decorative only.
- Job detail "Edit", "Submit Candidate" buttons → decorative only.
- **Fix:** At minimum, create modal forms for the Add actions. Edit can be a follow-up.

### 10. Settings Page is Static/Hardcoded
**File:** `src/app/(app)/settings/page.tsx`

- Profile shows hardcoded "Sarah" / "Chen" / "sarah.chen@openhorn.io".
- "Save Changes" button does nothing.
- Doesn't read from user session or API.
- **Fix:** Fetch user profile from session/API, wire save to PATCH endpoint.

### 11. User Management Page Issues
**File:** `src/app/(app)/settings/users/page.tsx`

- Uses plain HTML table instead of shadcn `<Table>` (inconsistent styling).
- API returns flat array but code expects `data.users` → will show empty table.
- No "Invite User" / "Add User" button.
- No role change or deactivation UI.
- **Fix:** Fix API response parsing, use shadcn components, add user management actions.

### 12. Dashboard Chart SSR Warning
**File:** `src/app/(app)/dashboard/page.tsx`

- Build logs: "The width(-1) and height(-1) of chart should be greater than 0"
- Recharts ResponsiveContainer may not render correctly during static generation.
- **Fix:** Add dynamic import with `ssr: false` for chart components, or add explicit minHeight.

### 13. API Routes Have No Auth Guards
**Files:** All API routes except `/api/users` and `/api/register`

- `/api/candidates`, `/api/jobs`, `/api/companies`, `/api/submissions`, etc. have **no session check**.
- Anyone can read/write all data without authentication.
- `/api/users` correctly checks auth — others should follow the pattern.
- **Fix:** Add `auth()` check to all API routes. Filter by workspaceId from session.

### 14. No Workspace Scoping on API Queries
**Files:** All API routes

- GET queries don't filter by `workspaceId`. In a multi-tenant app, users would see ALL data across workspaces.
- POST creates require `workspaceId` in the body (client must know it) instead of reading from session.
- **Fix:** Read workspaceId from session, auto-scope all queries.

---

## P3 — LOW (Nice-to-have for MVP)

### 15. No Placements Page
- Schema has Placement model with full fields. API exists.
- No frontend page to view/manage placements.
- Critical for staffing agencies that track revenue.

### 16. No Document Upload
- Candidate detail has "Documents" tab with "Upload Document" button — non-functional.
- Schema has `CandidateDocument` model.
- Need file storage (local or S3) + upload flow.

### 17. Notifications Bell is Decorative
- Bell icon in topbar has a red dot but no notification system behind it.
- No notification model in schema.

### 18. No Reporting/Analytics
- Dashboard shows mock metrics only.
- No revenue tracking, placement reports, recruiter performance, or pipeline velocity.

### 19. No Activity Logging from Frontend
- Schema has Activity model. API works.
- But no frontend actions create activities. Activity feed shows mock data.

### 20. Missing Standard ATS Features
- No email integration or templates
- No calendar/scheduling integration
- No bulk actions (status change, assign owner)
- No CSV import/export
- No candidate parsing (resume upload → auto-fill)
- No job board posting integration

---

## Build & Code Quality Notes

| Item | Status |
|------|--------|
| `npm run build` | ✅ Succeeds (warnings only) |
| TypeScript errors | ✅ None (but `ignoreBuildErrors: true` is set — may be masking issues) |
| ESLint | ⚠️ Not configured (no .eslintrc) |
| Search API static gen | ⚠️ Non-breaking error during build (works dynamically) |
| `@types/bcryptjs` in deps | ⚠️ Should be in devDependencies |
| Two next.config files | ❌ Conflicting configs |

---

## Summary: Minimum Fixes for Credible MVP Demo

If the goal is "a recruiter can sign up, log in, and actually use this," the **absolute minimum** is:

1. **Fix auth** (P0-1): Status casing, seed passwords, AUTH_SECRET, correct demo credentials
2. **Fix brand colors** (P0-2): Add to tailwind config so login/register look right
3. **Fix next.config** (P0-3): Remove duplicate
4. **Wire 2-3 key pages to real data** (P1-4): At minimum, candidates list + detail fetching from API
5. **Add SessionProvider + fix topbar** (P1-5, P1-6): Show real user, enable sign out
6. **Add modal forms for "Add" actions** (P2-9): At least Add Candidate

Everything else can ship as "coming soon" for an MVP.
