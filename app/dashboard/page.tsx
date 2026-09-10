"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderKanban,
  AlertCircle,
  CheckSquare,
  Users,
  MessageSquare,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { CardSkeleton, ListSkeleton, TableSkeleton } from "@/components/feedback/Skeleton";
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal";
import { formatRelativeTime } from "@/lib/utils";
import { toIssue, type DashboardStats } from "@/lib/api/dashboard";
import { useDashboard } from "@/hooks/useDashboard";
import { useActivity } from "@/hooks/useActivity";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function statItems(stats: DashboardStats) {
  return [
    { label: "Active Projects", value: stats.activeProjects, icon: FolderKanban, color: "var(--color-accent-primary)" },
    { label: "Open Issues", value: stats.openIssues, icon: AlertCircle, color: "var(--color-status-warning)" },
    { label: "Assigned to Me", value: stats.assignedToMe, icon: CheckSquare, color: "var(--color-accent-secondary)" },
    { label: "Team Online", value: stats.teamOnline, icon: Users, color: "var(--color-status-success)" },
    { label: "Pending Reviews", value: stats.pendingReviews, icon: MessageSquare, color: "var(--color-status-info)" },
  ];
}

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();
  const { items: recentActivities } = useActivity({ limit: 8 });
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const firstName = data?.user.displayName.split(" ")[0] ?? "";

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {loading ? "Welcome" : `${getGreeting()}, ${firstName}`}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Here&apos;s what&apos;s happening across your workspaces.
          </p>
        </div>

        {error ? (
          <ErrorState title="Failed to load dashboard" message={error} onRetry={refetch} />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {loading || !data
                ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
                : statItems(data.stats).map((stat) => (
                    <Card key={stat.label} className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)] flex items-center justify-center"
                          style={{ backgroundColor: `${stat.color}15` }}
                        >
                          <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">
                            {stat.value}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Recent Projects</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                      <Plus className="h-4 w-4" /> New Project
                    </Button>
                    <Link href="/projects">
                      <Button variant="ghost" size="sm">
                        View all <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                {loading || !data ? (
                  <ListSkeleton items={3} />
                ) : data.recentProjects.length === 0 ? (
                  <EmptyState
                    title="No projects yet"
                    description="Create your first project to start tracking work."
                    icon="projects"
                    action={{ label: "New Project", onClick: () => setIsCreateModalOpen(true) }}
                  />
                ) : (
                  <div className="space-y-3">
                    {data.recentProjects.map((project) => (
                      <Link key={project.id} href={`/workspaces/${project.workspaceId}/projects/${project.id}`}>
                        <Card variant="hover" className="p-4 cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-[var(--color-text-primary)]">{project.name}</h3>
                                <Badge variant={project.status === "active" ? "success" : project.status === "planning" ? "info" : "default"} size="sm">
                                  {project.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-1 mb-3">
                                {project.description}
                              </p>
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
                )}
              </div>

              {/* Activity Feed */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Activity</h2>
                  <Link href="/activity">
                    <Button variant="ghost" size="sm">
                      View all <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <Card>
                  <div className="divide-y divide-[var(--color-border-primary)]">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-4">
                        <Avatar name={activity.user?.displayName} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--color-text-primary)]">
                            <span className="font-medium">{activity.user?.displayName ?? "Someone"}</span>{" "}
                            {activity.description}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] font-mono mt-1">
                            {formatRelativeTime(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {recentActivities.length === 0 && (
                      <p className="p-4 text-sm text-[var(--color-text-muted)]">No recent activity.</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* My Assigned Issues */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Assigned to Me</h2>
                <Link href="/issues">
                  <Button variant="ghost" size="sm">
                    View all <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              {loading || !data ? (
                <TableSkeleton rows={4} />
              ) : data.assignedIssues.length === 0 ? (
                <EmptyState
                  title="Nothing assigned"
                  description="Issues assigned to you will appear here."
                  icon="issues"
                />
              ) : (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-[var(--color-border-primary)]">
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">ID</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Title</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Status</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Priority</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.assignedIssues.map((row) => {
                          const issue = toIssue(row);
                          return (
                            <tr
                              key={issue.id}
                              className="border-b border-[var(--color-border-primary)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors"
                            >
                              <td className="px-4 py-3 font-mono text-[var(--color-text-muted)]">
                                {row.projectKey}-{issue.number}
                              </td>
                              <td className="px-4 py-3">
                                <Link
                                  href={`/workspaces/${row.workspaceId}/projects/${issue.projectId}/issues/${issue.id}`}
                                  className="text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors"
                                >
                                  {issue.title}
                                </Link>
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant={
                                    issue.status === "done"
                                      ? "success"
                                      : issue.status === "in_progress"
                                      ? "warning"
                                      : issue.status === "review"
                                      ? "info"
                                      : "default"
                                  }
                                  size="sm"
                                >
                                  {issue.status.replace("_", " ")}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant={
                                    issue.priority === "critical"
                                      ? "error"
                                      : issue.priority === "high"
                                      ? "warning"
                                      : issue.priority === "medium"
                                      ? "info"
                                      : "default"
                                  }
                                  size="sm"
                                >
                                  {issue.priority}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">
                                {formatRelativeTime(issue.updatedAt)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>

            {/* Team Online */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Team Online</h2>
                <Badge variant="success" size="sm">
                  {data?.onlineUsers.length ?? 0} online
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                {(data?.onlineUsers ?? []).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-elevated)] border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)]"
                  >
                    <div className="relative">
                      <Avatar name={user.displayName} size="sm" />
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-status-success)] border-2 border-[var(--color-bg-elevated)]" />
                    </div>
                    <span className="text-sm text-[var(--color-text-primary)]">{user.displayName}</span>
                  </div>
                ))}
                {!loading && (data?.onlineUsers.length ?? 0) === 0 && (
                  <p className="text-sm text-[var(--color-text-muted)]">No one online right now.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        defaultWorkspaceId={data?.workspaces[0]?.id}
        workspaces={data?.workspaces}
        onCreated={refetch}
      />
    </AppShell>
  );
}
