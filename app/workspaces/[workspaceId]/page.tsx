"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Users, FolderKanban } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime } from "@/lib/utils";
import type { ActivityEvent, Project, User, Workspace } from "@/types";
import { workspaceNav } from "@/lib/constants/navigation";

export default function WorkspaceOverviewPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  // TODO(api): load real workspace, projects, activities, members.
  const workspace = undefined as Workspace | undefined;
  const projects: Project[] = [];
  const activities: ActivityEvent[] = [];
  const members: User[] = [];

  if (!workspace) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Workspace not found</h2>
            <p className="text-[var(--color-text-secondary)] mt-2">The workspace you are looking for does not exist.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{workspace.name}</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">{workspace.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5 font-mono"><Users className="h-4 w-4" />{workspace.memberCount} members</span>
              <span className="flex items-center gap-1.5 font-mono"><FolderKanban className="h-4 w-4" />{workspace.projectCount} projects</span>
            </div>
          </div>
          <Button variant="primary" size="sm"><Plus className="h-4 w-4" /> New Project</Button>
        </div>

        <nav className="flex items-center gap-1 mb-8 overflow-x-auto pb-2" aria-label="Workspace navigation">
          {workspaceNav.map((item) => {
            const href = `/workspaces/${workspaceId}${item.href}`;
            const isActive = item.href === "";
            return (
              <Link key={item.label} href={href} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] whitespace-nowrap transition-colors ${isActive ? "bg-[var(--color-accent-primary-muted)] text-[var(--color-accent-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Projects</h2>
            </div>
            <div className="space-y-3">
              {projects.map((project) => (
                <Link key={project.id} href={`/workspaces/${workspaceId}/projects/${project.id}`}>
                  <Card variant="hover" className="p-4 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[var(--color-text-primary)]">{project.name}</h3>
                          <Badge variant={project.status === "active" ? "success" : "info"} size="sm">{project.status}</Badge>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-1 mb-3">{project.description}</p>
                        <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                          <span className="font-mono">{project.key}</span>
                          <span>{project.openIssueCount} open issues</span>
                          <span>{project.memberCount} members</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Progress value={project.progress} className="w-24" />
                        <span className="text-xs font-mono text-[var(--color-text-muted)]">{project.progress}%</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Team</h2>
              </div>
              <Card>
                <div className="divide-y divide-[var(--color-border-primary)]">
                  {members.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-3">
                      <div className="relative">
                        <Avatar name={user.displayName} size="sm" />
                        {user.isOnline && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-status-success)] border-2 border-[var(--color-bg-elevated)]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{user.displayName}</p>
                        <p className="text-xs text-[var(--color-text-muted)] capitalize">{user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Recent Activity</h2>
              </div>
              <Card>
                <div className="divide-y divide-[var(--color-border-primary)]">
                  {activities.slice(0, 5).map((activity) => {
                    const user = null as User | null;
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3">
                        <Avatar name={user?.displayName} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--color-text-primary)]">
                            <span className="font-medium">{user?.displayName}</span> {activity.description}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] font-mono mt-1">{formatRelativeTime(activity.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}