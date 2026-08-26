"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, Columns3, AlertCircle, MessageSquare, FileCode, Activity, Settings, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";
import { Separator } from "@/components/ui/Separator";
import { AppShell } from "@/components/layout/AppShell";
import { getIssueCountByStatus } from "@/lib/utils";
import { getProjectById, getIssuesByProject, mockUsers } from "@/mock-data";

const projectNav = [
  { label: "Overview", href: "", icon: LayoutDashboard },
  { label: "Board", href: "/board", icon: Columns3 },
  { label: "Issues", href: "/issues", icon: AlertCircle },
  { label: "Discussions", href: "/discussions", icon: MessageSquare },
  { label: "Files", href: "/files", icon: FileCode },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function ProjectOverviewPage() {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;
  const projectId = params.projectId as string;
  const project = getProjectById(projectId);
  const issues = getIssuesByProject(projectId);

  if (!project) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Project not found</h2>
            <p className="text-[var(--color-text-secondary)] mt-2">The project you are looking for does not exist.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const issuesByStatus = getIssueCountByStatus(issues);

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-[var(--color-text-muted)]">{project.key}</span>
              <Badge variant={project.status === "active" ? "success" : "info"}>{project.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{project.name}</h1>
            <p className="text-[var(--color-text-secondary)] mt-1 max-w-2xl">{project.description}</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 mb-8 overflow-x-auto pb-2" aria-label="Project navigation">
          {projectNav.map((item) => {
            const href = `/workspaces/${workspaceId}/projects/${projectId}${item.href}`;
            const isActive = pathname === href;
            return (
              <Link key={item.label} href={href} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] whitespace-nowrap transition-colors ${isActive ? "bg-[var(--color-accent-primary-muted)] text-[var(--color-accent-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-sm text-[var(--color-text-muted)]">Progress</p>
                <div className="flex items-center gap-3 mt-2">
                  <Progress value={project.progress} className="flex-1" />
                  <span className="text-lg font-bold font-mono text-[var(--color-text-primary)]">{project.progress}%</span>
                </div>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-[var(--color-text-muted)]">Open Issues</p>
                <p className="text-2xl font-bold font-mono text-[var(--color-text-primary)] mt-2">{project.openIssueCount}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-[var(--color-text-muted)]">Total Issues</p>
                <p className="text-2xl font-bold font-mono text-[var(--color-text-primary)] mt-2">{project.issueCount}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-[var(--color-text-muted)]">Members</p>
                <p className="text-2xl font-bold font-mono text-[var(--color-text-primary)] mt-2">{project.memberCount}</p>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Issue Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {(["backlog", "in_progress", "review", "done"] as const).map((status) => (
                    <div key={status} className="text-center p-3 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)]">
                      <p className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">{issuesByStatus[status]}</p>
                      <p className="text-xs text-[var(--color-text-muted)] uppercase mt-1">{status.replace("_", " ")}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Issues</CardTitle>
                <Link href={`/workspaces/${workspaceId}/projects/${projectId}/issues`}>
                  <Button variant="ghost" size="sm">View all <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {issues.slice(0, 5).map((issue) => (
                    <div key={issue.id} className="flex items-center gap-3 p-3 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)]">
                      <span className="text-sm font-mono text-[var(--color-text-muted)]">#{issue.number}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--color-text-primary)] truncate">{issue.title}</p>
                      </div>
                      <Badge variant={issue.status === "done" ? "success" : issue.status === "in_progress" ? "warning" : issue.status === "review" ? "info" : "default"} size="sm">{issue.status.replace("_", " ")}</Badge>
                      <Badge variant={issue.priority === "critical" ? "error" : issue.priority === "high" ? "warning" : "default"} size="sm">{issue.priority}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Project Health</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">Overall Progress</span>
                    <span className="text-sm font-mono text-[var(--color-text-primary)]">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Open Issues</span>
                    <span className="text-sm font-mono text-[var(--color-status-warning)]">{project.openIssueCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">Completed</span>
                    <span className="text-sm font-mono text-[var(--color-status-success)]">{issuesByStatus.done}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">In Review</span>
                    <span className="text-sm font-mono text-[var(--color-status-info)]">{issuesByStatus.review}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Team</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUsers.slice(0, project.memberCount).map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar name={user.displayName} size="sm" />
                        {user.isOnline && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-status-success)] border-2 border-[var(--color-bg-elevated)]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{user.displayName}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}