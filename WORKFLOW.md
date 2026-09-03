# FORGE — PROJECT DEVELOPMENT WORKFLOW

## Current State Assessment

| Area | Status | Completion |
|------|--------|------------|
| Frontend UI | 23 pages, 21+ components, polished dark theme | ~85% |
| Database Schema | 14 tables, 6 enums, proper FKs | ~90% |
| Authentication | Signup/login routes exist but buggy | ~15% |
| API Routes | 3 routes (all buggy), zero CRUD | ~5% |
| Real Data | Zero - all pages use mock data | 0% |
| Testing | None | 0% |
| CI/CD | None | 0% |
| AI/RAG | Not started | 0% |
| Observability | None | 0% |

---

## Adapted Roadmap — Phase Sequencing

The original 20-phase roadmap maps to **8 implementation phases**.

---

### PHASE A — Fix Foundation (Roadmap 0 + partial 1)

**Goal**: Fix bugs, establish working auth, protect routes.

- [ ] Fix signup route (column name `fullname` → `displayName`, use `parsed.data`, status codes)
- [ ] Fix login route (use `parsed.data`, fix optional chaining, status codes)
- [ ] Fix/delete broken dashboard API route
- [ ] Add `lib/auth.ts` — JWT generation/verification (`jose` library)
- [ ] Create `middleware.ts` — session-based route protection
- [ ] Add auth context/provider on client (`AuthProvider`)
- [ ] Wire login/signup to actually create sessions + set cookies
- [ ] Add logout endpoint + clear session
- [ ] Fix dashboard fetch logic in `app/dashboard/page.tsx`

---

### PHASE B — Core CRUD APIs (Roadmap 1 + 3)

**Goal**: Replace all mock data with real database operations.

- [ ] API route structure: `app/api/` with proper middleware pattern
- [ ] **Workspaces**: CRUD + members
- [ ] **Projects**: CRUD + members + ownership
- [ ] **Issues**: CRUD + status changes + assignments + labels
- [ ] **Discussions**: CRUD + replies
- [ ] **Comments**: CRUD (on issues + discussions)
- [ ] **Notifications**: List + mark read + mark all read
- [ ] **Activity**: Auto-generate on mutations
- [ ] **Files**: CRUD metadata (actual upload later)
- [ ] Request validation on all routes (Zod)
- [ ] Consistent error response format
- [ ] Pagination, filtering, sorting on list endpoints

---

### PHASE C — Frontend Integration (Roadmap 3)

**Goal**: Connect all 23 pages to real APIs.

- [ ] Install `@tanstack/react-query` for data fetching
- [ ] Create API client functions per entity
- [ ] Convert each page from mock data → React Query hooks
- [ ] Add loading states (use existing Skeleton components)
- [ ] Add error states (use existing ErrorState component)
- [ ] Add empty states (use existing EmptyState component)
- [ ] Wire CreateIssueModal, invite modals, settings saves to real APIs
- [ ] Add optimistic updates for mutations
- [ ] Fix hardcoded workspace/project IDs → use route params

---

### PHASE D — Database Quality (Roadmap 2)

**Goal**: Proper indexes, constraints, and query optimization.

- [ ] Add database indexes for common query patterns
- [ ] Add check constraints where needed
- [ ] Review and optimize N+1 queries (use Drizzle relations)
- [ ] Add proper pagination cursors
- [ ] Review FK cascade behavior
- [ ] Add updated_at triggers or application-level updates

---

### PHASE E — Security Hardening (Roadmap 10)

**Goal**: Production-ready security.

- [ ] Rate limiting on auth routes (IP-based)
- [ ] Rate limiting on API routes (user-based)
- [ ] CSRF protection
- [ ] Input sanitization
- [ ] Secure cookie settings (httpOnly, secure, sameSite)
- [ ] Password strength validation
- [ ] Session expiry + refresh tokens
- [ ] Authorization checks on every mutation (verify user owns/is member of resource)

---

### PHASE F — Async Processing + Redis (Roadmap 8 + 9)

**Goal**: Background jobs for expensive operations.

- [ ] Add Redis connection (`ioredis`)
- [ ] Simple in-process job queue (or BullMQ if Redis available)
- [ ] Job model in database
- [ ] Move expensive operations to workers:
  - [ ] Activity feed aggregation
  - [ ] Notification delivery
  - [ ] Large query caching
- [ ] Cache frequently accessed data (project details, user profiles)
- [ ] Cache invalidation strategy

---

### PHASE G — Testing (Roadmap 11)

**Goal**: Critical path coverage.

- [ ] Install Vitest
- [ ] Unit tests: validators, auth utils, helper functions
- [ ] Integration tests: auth flows, CRUD operations
- [ ] API route tests
- [ ] Test error scenarios (unauthorized, invalid input, duplicate)

---

### PHASE H — AI Foundation (Roadmap 4 + 5 + 6 + 7)

**Goal**: Basic AI integration with project context.

- [ ] AI conversation model in database
- [ ] Basic chat endpoint
- [ ] Project context retrieval (task summaries, descriptions)
- [ ] Simple RAG: embed project docs → similarity search → LLM
- [ ] AI-powered task generation from descriptions
- [ ] Project summarization
- [ ] Streaming responses
- [ ] Human-in-the-loop for AI actions

---

## Implementation Order

```
Phase A (Foundation)     ← START HERE (1-2 days)
    ↓
Phase B (CRUD APIs)      ← Core backend (3-4 days)
    ↓
Phase C (Frontend)       ← Connect everything (2-3 days)
    ↓
Phase D (DB Quality)     ← Optimize (1 day)
    ↓
Phase E (Security)       ← Harden (1-2 days)
    ↓
Phase F (Async/Redis)    ← Scale (2-3 days)
    ↓
Phase G (Testing)        ← Validate (2-3 days)
    ↓
Phase H (AI)             ← Intelligence (3-5 days)
```

**Total estimated effort: ~15-23 days**

---

## Key Decisions Needed

1. **Auth library**: Roll custom JWT with `jose` (lightweight) or use `next-auth` (more features but heavier)? Recommendation: custom JWT — simpler, more control, matches the roadmap's emphasis on understanding every component.

2. **State management**: Add `@tanstack/react-query` for server state, or keep it simple with `useState` + `useEffect`? Recommendation: React Query — it solves caching, refetching, optimistic updates, and loading/error states.

3. **Redis**: Add now or defer to Phase F? Recommendation: defer until async processing is actually needed.

4. **AI provider**: Which LLM API? OpenAI, Anthropic, or open-source? This affects Phase H significantly.

5. **File storage**: Local filesystem, S3/R2, or defer? This affects the Files feature.

---

## Known Bugs to Fix

### Critical

1. **`app/auth/api/signup/route.ts:17`**: Uses `const { fullName, email, username, password } = body` instead of `parsed.data` — raw body is used after validation, bypassing Zod's type narrowing.

2. **`app/auth/api/signup/route.ts:23`**: `fullname: fullName` doesn't match the schema column `displayName` (mapped to `display_name`).

3. **`app/auth/api/signup/route.ts:14`**: Returns `status: 500` for validation errors (should be 400/422).

4. **`app/auth/api/login/route.ts:14`**: Returns `status: 500` for validation errors (should be 400/422).

5. **`app/auth/api/login/route.ts:20`**: `eq(user?.email, email)` — unnecessary optional chaining on the table reference.

6. **`app/auth/api/dashboard/route.ts`**: Queries with `with: { user: true }` which tries to follow a `user` relation on the `user` table (self-referential, doesn't exist). Also has no `return` statement and no `NextResponse`.

7. **`app/dashboard/page.tsx:57-64`**: Broken fetch logic — `data.json` is a function reference, not a call (`.json()`); `setUser(res)` receives a Promise, not the actual data; `useEffect` has no dependency array (runs every render, infinite loop).

### Architectural

1. **Every page is `"use client"`** — 23 out of 23 pages use client-side rendering. This negates Next.js App Router benefits (SSR, streaming, RSC).

2. **No route protection** — All pages are accessible without authentication. No middleware, no auth checks.

3. **No server-side data fetching** — All data comes from client-side mock imports. No Server Actions, no API calls from server components.

4. **Duplicated navigation arrays** — `projectNav` and `workspaceNav` are defined identically in 6+ files instead of being centralized.

5. **Hardcoded workspace/project IDs** — Many URLs hardcode `ws_01` instead of using dynamic params.

6. **No error boundaries** — No error.tsx or not-found.tsx files exist.

7. **No loading states** — Skeleton components exist but are never used by any page.

---

## Project Structure Reference

```
forge/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── api/
│   │       ├── login/route.ts
│   │       ├── signup/route.ts
│   │       └── dashboard/route.ts
│   ├── dashboard/page.tsx
│   ├── issues/page.tsx
│   ├── projects/page.tsx
│   ├── discussions/page.tsx
│   ├── files/page.tsx
│   ├── notifications/page.tsx
│   ├── team/page.tsx
│   ├── activity/page.tsx
│   ├── settings/page.tsx
│   ├── profile/page.tsx
│   └── workspaces/
│       └── [workspaceId]/
│           ├── page.tsx
│           ├── team/page.tsx
│           └── projects/
│               └── [projectId]/
│                   ├── page.tsx
│                   ├── board/page.tsx
│                   ├── issues/
│                   │   ├── page.tsx
│                   │   └── [issueId]/page.tsx
│                   ├── discussions/page.tsx
│                   └── files/page.tsx
├── components/
│   ├── ui/                          # 21 reusable primitives
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── navigation/
│   │   └── SearchPalette.tsx
│   └── feedback/
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       └── Skeleton.tsx
├── db/
│   └── schema.ts                    # 14 tables, 6 enums
├── drizzle/                         # SQL migrations
├── features/
│   └── issues/
│       └── components/
│           └── CreateIssueModal.tsx
├── hooks/                           # Empty
├── lib/
│   ├── db.ts                        # Drizzle + postgres.js
│   ├── utils.ts                     # cn, formatDate, etc.
│   └── validators.ts               # Zod schemas
├── mock-data/
│   └── index.ts                     # 708 lines of mock data
├── types/
│   └── index.ts                     # TypeScript interfaces
├── docker-compose.yml               # PostgreSQL 17
├── drizzle.config.ts
├── package.json
├── .env
└── tsconfig.json
```

---

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | 16.3.2 | React framework (App Router, Turbopack) |
| Language | TypeScript | 6.0.3 | Type safety |
| UI Library | React | 19.2.8 | UI rendering |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Components | Radix UI | Various | Accessible primitives (20+ packages) |
| ORM | Drizzle ORM | 0.45.2 | Database access |
| Database | PostgreSQL | 17 (Docker) | Persistent storage |
| DB Client | postgres.js | 3.4.9 | PostgreSQL driver |
| Validation | Zod | 4.5.4 | Schema validation |
| Password | bcrypt | 6.0.0 | Secure hashing |
| Icons | Lucide React | 1.33.0 | Icon library |
| Utils | clsx + tailwind-merge | Latest | Class composition |
| Package Mgr | pnpm | 9+ | Package management |
| Linting | ESLint 9 | 16.3.2 | Code quality |

---

## Database Schema (14 Tables)

| Table | Purpose | Status |
|-------|---------|--------|
| `user` | User accounts | Used by signup/login |
| `session` | Auth sessions | Schema exists, unused |
| `workspace` | Workspaces | Schema exists, unused |
| `workspace_member` | Workspace memberships | Schema exists, unused |
| `project` | Projects | Schema exists, unused |
| `project_member` | Project memberships | Schema exists, unused |
| `label` | Issue labels | Schema exists, unused |
| `issue` | Issues/tasks | Schema exists, unused |
| `issue_label` | Issue-label junction | Schema exists, unused |
| `comment` | Comments on issues/discussions | Schema exists, unused |
| `discussion` | Discussions | Schema exists, unused |
| `discussion_reply` | Discussion replies | Schema exists, unused |
| `file` | File metadata (hierarchical) | Schema exists, unused |
| `notification` | User notifications | Schema exists, unused |
| `activity` | Activity events | Schema exists, unused |

---

## Definition of Done

Forge is complete when:

- [ ] It is a functioning SaaS product
- [ ] Users can securely authenticate
- [ ] Authorization is enforced
- [ ] Projects and tasks work end-to-end
- [ ] PostgreSQL is properly designed
- [ ] APIs are clean and validated
- [ ] AI provides meaningful project-specific functionality
- [ ] RAG works with project context
- [ ] AI can perform controlled actions
- [ ] At least one expensive workflow is asynchronous
- [ ] Redis is used where justified
- [ ] Critical security issues are addressed
- [ ] Critical functionality is tested
- [ ] Failure scenarios are handled
- [ ] Application is deployed
- [ ] CI/CD is functional
- [ ] Observability exists
- [ ] Performance has been measured
- [ ] Architecture is documented
- [ ] Engineering decisions are documented
- [ ] The project is polished enough for public demonstration
- [ ] Every technology used has a clear reason
- [ ] The entire system can be understood and maintained

---

## Final Principle

**Do not build Forge to maximize the number of technologies.**

Build Forge to maximize:

> **Engineering depth + AI capability + product completeness + reliability + scalability + demonstrable real-world value.**

A smaller system that is genuinely production-quality and deeply understood is more valuable than a giant collection of half-implemented technologies.
