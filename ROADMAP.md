# Forge — Development Roadmap

> A collaborative software-development platform for developers and teams.
> Tech Stack: Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Drizzle ORM · PostgreSQL · Radix UI

---

## Current State

### ✅ Done (Frontend/UI ~80%)
- Landing page with hero, features, stats, CTA, footer
- Auth pages (login, register, forgot-password, reset-password)
- Dashboard with stats grid, projects, activity feed, issues, team online
- Workspace overview with nav, projects, team, activity
- Project pages with issues list, board, discussions, files, settings
- Global issues page with search and filters
- Global projects page with search
- Full UI component library (Button, Card, Badge, Avatar, Dialog, etc.)
- AppShell layout with sidebar, header, search palette
- TypeScript types for all entities
- Mock data covering users, workspaces, projects, issues, discussions, files, notifications, activities
- Utility functions (formatDate, formatRelativeTime, cn, truncate, etc.)
- Database connection setup with Drizzle ORM + PostgreSQL

### ❌ Missing (Backend/Integration ~20%)
| Area | Status |
|------|--------|
| Database schema | Only `user` table exists |
| Auth system | Basic signup/login routes, no sessions/JWT/middleware |
| API routes | Zero CRUD routes for workspaces, projects, issues, discussions, files |
| Real-time | None (presence, collaborative editing, notifications) |
| File uploads | None |
| Search | Client-side only on mock data |
| Email/OAuth | Buttons exist, not functional |
| Tests/CI/CD | None |

---

## 📋 Phase-by-Phase Plan

### Phase 1: Database & Auth Foundation (Week 1)

**Database Schema — extend `db/schema.ts` with:**
```sql
- workspaces
- workspace_members
- projects
- project_members
- issues
- issue_labels
- labels
- discussions
- discussion_replies
- files (with hierarchy)
- notifications
- activities
- sessions (for auth)
```

**Auth System:**
- Implement JWT-based auth with httpOnly cookies
- Add middleware for route protection (`middleware.ts`)
- Create auth context/provider for client-side session
- Implement logout, password reset, email verification flows

**Deliverables:**
- [ ] Full database schema with all tables
- [ ] JWT utility functions (`lib/auth.ts`)
- [ ] Auth middleware for protected routes
- [ ] Auth context/provider for client
- [ ] Logout endpoint
- [ ] Password reset flow
- [ ] Email verification flow

---

### Phase 2: API Layer (Week 2)

**RESTful API Routes:**

| Route | Methods | Features |
|-------|---------|----------|
| `/api/workspaces` | GET, POST | CRUD + members |
| `/api/projects` | GET, POST | CRUD + members + progress |
| `/api/issues` | GET, POST | CRUD + filters + comments + labels |
| `/api/discussions` | GET, POST | CRUD + replies + pins/locks |
| `/api/files` | GET, POST | CRUD + upload + versioning + tree |
| `/api/notifications` | GET, PATCH | list + mark read + preferences |
| `/api/search` | GET | global search across all types |
| `/api/activity` | GET | feed with pagination |

**Deliverables:**
- [ ] `/api/workspaces` routes
- [ ] `/api/projects` routes
- [ ] `/api/issues` routes (with comments, labels)
- [ ] `/api/discussions` routes (with replies)
- [ ] `/api/files` routes (with tree structure)
- [ ] `/api/notifications` routes
- [ ] `/api/search` route
- [ ] `/api/activity` route

---

### Phase 3: Replace Mock Data (Week 2-3)

- Swap all `mock-data` imports with Server Components + API calls
- Add React Query / SWR for client-side caching
- Implement optimistic updates for mutations

**Pages to Convert:**
- [ ] Dashboard (`app/dashboard/page.tsx`)
- [ ] Workspace overview (`app/workspaces/[workspaceId]/page.tsx`)
- [ ] Project overview (`app/workspaces/[workspaceId]/projects/[projectId]/page.tsx`)
- [ ] Issues list (`app/workspaces/[workspaceId]/projects/[projectId]/issues/page.tsx`)
- [ ] Issue detail (`app/workspaces/[workspaceId]/projects/[projectId]/issues/[issueId]/page.tsx`)
- [ ] Discussions (`app/workspaces/[workspaceId]/projects/[projectId]/discussions/page.tsx`)
- [ ] Files (`app/workspaces/[workspaceId]/projects/[projectId]/files/page.tsx`)
- [ ] Board (`app/workspaces/[workspaceId]/projects/[projectId]/board/page.tsx`)
- [ ] Global issues (`app/issues/page.tsx`)
- [ ] Global projects (`app/projects/page.tsx`)
- [ ] Notifications (`app/notifications/page.tsx`)
- [ ] Team (`app/team/page.tsx`)
- [ ] Activity (`app/activity/page.tsx`)
- [ ] Settings (`app/settings/page.tsx`)
- [ ] Profile (`app/profile/page.tsx`)

---

### Phase 4: Real-time Features (Week 3)

**WebSocket Server (Socket.io or native ws):**
- Presence indicators (online/offline/typing)
- Live issue/discussion updates
- Real-time notifications
- Collaborative editing foundation (OT/CRDT for TypeWithMe)

**Deliverables:**
- [ ] WebSocket server setup
- [ ] Presence system (online status, typing indicators)
- [ ] Real-time issue updates
- [ ] Real-time discussion updates
- [ ] Real-time notification push
- [ ] Collaborative editing foundation

---

### Phase 5: File Uploads & Search (Week 3-4)

**File Storage (S3/R2/local):**
- File upload handling with progress
- Drag-and-drop uploads
- File versioning
- Mime-type detection
- Hierarchical file browser

**Search (PostgreSQL FTS or Meilisearch):**
- Global search across projects, issues, discussions, files, users
- Keyboard shortcuts (Cmd+K)
- Search filters and categories

**Deliverables:**
- [ ] File upload API with S3/R2 integration
- [ ] Drag-and-drop upload component
- [ ] File versioning system
- [ ] Mime-type detection
- [ ] Full-text search implementation
- [ ] Search palette integration

---

### Phase 6: Polish & Production (Week 4)

**Authentication Providers:**
- [ ] GitHub OAuth
- [ ] Google OAuth

**Email Service (Resend/SendGrid):**
- [ ] Welcome email
- [ ] Password reset email
- [ ] Email verification
- [ ] Workspace invite emails
- [ ] Notification emails

**Testing:**
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] API integration tests

**CI/CD:**
- [ ] GitHub Actions pipeline
- [ ] Vercel/Docker deployment
- [ ] Environment variable management

**Observability:**
- [ ] Sentry error tracking
- [ ] Logging system
- [ ] Performance metrics

**Performance:**
- [ ] React Server Components optimization
- [ ] Bundle analysis and optimization
- [ ] Caching headers
- [ ] Image optimization

---

## 🔑 Critical Decisions

| Decision | Options | Recommendation |
|----------|---------|----------------|
| **Auth** | NextAuth.js vs custom JWT | Custom JWT (simpler, full control) |
| **Real-time** | Socket.io vs Pusher vs Supabase Realtime | Socket.io (self-hosted, free) |
| **Search** | PostgreSQL FTS vs Meilisearch vs Typesense | Meilisearch (easy, fast, typo-tolerant) |
| **File Storage** | S3/R2 vs Cloudinary vs local | R2 (cheap, S3-compatible) |
| **Email** | Resend vs SendGrid vs Nodemailer | Resend (dev-friendly, React emails) |
| **Deployment** | Vercel vs Docker (Railway/Fly/Render) | Docker + Fly.io (full control, websockets) |

---

## 🚀 Immediate Next Steps (Do This First)

1. **Extend `db/schema.ts`** with all tables
2. **Run `pnpm drizzle-kit generate && pnpm drizzle-kit migrate`**
3. **Build auth middleware + JWT utilities** in `lib/auth.ts`
4. **Create first real API route** (e.g., `/api/workspaces` GET/POST)
5. **Convert one page** (e.g., dashboard) to use real data

---

## Project Structure

```
forge/
├── app/
│   ├── auth/                    # Auth pages + API routes
│   │   ├── api/login/route.ts
│   │   ├── api/signup/route.ts
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── workspaces/[workspaceId]/
│   │   ├── page.tsx             # Workspace overview
│   │   ├── projects/[projectId]/
│   │   │   ├── page.tsx         # Project overview
│   │   │   ├── board/page.tsx   # Kanban board
│   │   │   ├── issues/
│   │   │   │   ├── page.tsx     # Issues list
│   │   │   │   └── [issueId]/page.tsx  # Issue detail
│   │   │   ├── discussions/page.tsx
│   │   │   ├── files/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── team/page.tsx
│   ├── dashboard/page.tsx
│   ├── issues/page.tsx          # Global issues
│   ├── projects/page.tsx        # Global projects
│   ├── notifications/page.tsx
│   ├── activity/page.tsx
│   ├── team/page.tsx
│   ├── settings/page.tsx
│   ├── profile/page.tsx
│   ├── layout.tsx
│   └── page.tsx                 # Landing page
├── components/
│   ├── feedback/                # EmptyState, ErrorState, Skeleton
│   ├── layout/                  # AppShell, Sidebar, Header
│   ├── navigation/              # SearchPalette
│   └── ui/                      # Button, Card, Badge, Dialog, etc.
├── db/
│   └── schema.ts                # Drizzle schema (extend this)
├── drizzle/                     # Migration files
├── features/
│   └── issues/components/       # Feature-specific components
├── hooks/                       # Custom React hooks
├── lib/
│   ├── auth.ts                  # JWT utilities (create this)
│   ├── db.ts                    # Database connection
│   ├── utils.ts                 # Utility functions
│   └── validators.ts            # Zod schemas
├── mock-data/
│   └── index.ts                 # Mock data (replace with real data)
├── types/
│   └── index.ts                 # TypeScript types
├── .env                         # Environment variables
├── docker-compose.yml           # PostgreSQL setup
├── drizzle.config.ts            # Drizzle config
├── next.config.ts               # Next.js config
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Tech Stack Reference

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.3.2 | React framework |
| React | 19.2.8 | UI library |
| TypeScript | 6.0.3 | Type safety |
| Tailwind CSS | 4.x | Styling |
| Drizzle ORM | 0.45.2 | Database ORM |
| PostgreSQL | - | Database |
| Radix UI | - | Component primitives |
| Zod | 4.5.4 | Schema validation |
| bcrypt | 6.0.0 | Password hashing |
| Lucide React | 1.33.0 | Icons |

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/forge

# Auth
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

*Last Updated: August 31, 2026*
