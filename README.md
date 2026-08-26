# Forge — Collaborative Developer Platform

A modern, full-stack collaborative software development platform built for developers and teams. Forge provides workspace management, issue tracking, project planning, team discussions, and file management — all in a sleek, performant interface.

## Features

- **Workspaces & Projects** — Organize work across multiple workspaces with projects, each with customizable issue workflows
- **Issue Tracking** — Full-featured issue management with statuses (backlog, in progress, review, done), priorities (critical, high, medium, low), labels, assignees, and due dates
- **Team Collaboration** — Role-based access control (owner, admin, member, viewer), online presence indicators, and activity feeds
- **Discussions** — Threaded discussions with categories (general, technical, proposal, announcement, question), replies, pins, and locks
- **File Management** — Hierarchical file/folder structure with versioning, mime-type detection, and size tracking
- **Notifications** — Real-time notifications for mentions, assignments, comments, invites, and system events
- **Search** — Global search across projects, issues, discussions, files, and users
- **Responsive UI** — Built with Radix UI primitives and Tailwind CSS, supporting dark/light themes

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **UI**: React 19, Radix UI primitives, Tailwind CSS 4
- **Fonts**: Space Grotesk (sans), JetBrains Mono (mono)
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd forge

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Project Structure

```
forge/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages (login)
│   ├── dashboard/         # Main dashboard
│   ├── issues/            # Issue listing & details
│   ├── files/             # File browser
│   ├── notifications/     # Notifications center
│   ├── team/              # Team management
│   ├── workspaces/        # Workspace & project pages
│   ├── globals.css        # Global styles & CSS variables
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── ui/                # Reusable UI primitives (Button, Card, Dialog, etc.)
│   ├── layout/            # Layout components (AppShell, Sidebar, Header)
│   ├── navigation/        # Navigation components (SearchPalette)
│   └── feedback/          # Feedback components (Toast, Skeleton, EmptyState)
├── lib/
│   └── utils.ts           # Utility functions (cn, formatRelativeTime, etc.)
├── mock-data/
│   └── index.ts           # Mock data for development
├── types/
│   └── index.ts           # TypeScript type definitions
└── public/                # Static assets
```

## Key Types

Defined in `types/index.ts`:

- `User`, `Workspace`, `Project`, `Issue`
- `Comment`, `Discussion`, `DiscussionReply`
- `FileItem`, `Notification`, `ActivityEvent`
- `Label`, `SearchResult`
- Enums: `Priority`, `IssueStatus`, `ProjectStatus`, `UserRole`, `NotificationType`, `DiscussionCategory`

## Mock Data

The app uses client-side mock data (`mock-data/index.ts`) for development. Replace with real API calls when integrating a backend.

## Styling

Uses CSS variables for theming (defined in `globals.css`):

- Color palette: primary, secondary, success, warning, error, info accents
- Semantic colors: text, background, border, status colors
- Spacing, radii, shadows, and transitions via Tailwind config

## Deployment

Deploy on [Vercel](https://vercel.com) for the best Next.js experience:

```bash
pnpm build
vercel deploy
```

## License

MIT