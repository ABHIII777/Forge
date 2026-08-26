"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, Columns3, AlertCircle, MessageSquare, FileCode, Activity, Settings, Plus, Search, Filter, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime } from "@/lib/utils";
import { getProjectById, getIssuesByProject, getUserById } from "@/mock-data";
import { CreateIssueModal } from "@/features/issues/components/CreateIssueModal";

const projectNav = [
  { label: "Overview", href: "", icon: LayoutDashboard },
  { label: "Board", href: "/board", icon: Columns3 },
  { label: "Issues", href: "/issues", icon: AlertCircle },
  { label: "Discussions", href: "/discussions", icon: MessageSquare },
  { label: "Files", href: "/files", icon: FileCode },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function IssuesPage() {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;
  const projectId = params.projectId as string;
  const project = getProjectById(projectId);
  const allIssues = getIssuesByProject(projectId);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

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

  const filteredIssues = allIssues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
          </div>
          <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}><Plus className="h-4 w-4" /> New Issue</Button>
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

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search issues..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-base pl-10" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] px-3 py-2 text-sm font-mono">
            <option value="all">All Status</option>
            <option value="backlog">Backlog</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] px-3 py-2 text-sm font-mono">
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Issues List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--color-border-primary)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Priority</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Assignee</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Labels</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => {
                  const assignee = issue.assigneeId ? getUserById(issue.assigneeId) : null;
                  return (
                    <tr key={issue.id} className="border-b border-[var(--color-border-primary)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors">
                      <td className="px-4 py-3 font-mono text-[var(--color-text-muted)]">#{issue.number}</td>
                      <td className="px-4 py-3">
                        <Link href={`/workspaces/${workspaceId}/projects/${projectId}/issues/${issue.id}`} className="text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors">
                          {issue.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={issue.status === "done" ? "success" : issue.status === "in_progress" ? "warning" : issue.status === "review" ? "info" : "default"} size="sm">{issue.status.replace("_", " ")}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={issue.priority === "critical" ? "error" : issue.priority === "high" ? "warning" : issue.priority === "medium" ? "info" : "default"} size="sm">{issue.priority}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={assignee.displayName} size="xs" />
                            <span className="text-[var(--color-text-secondary)]">{assignee.displayName}</span>
                          </div>
                        ) : (
                          <span className="text-[var(--color-text-muted)]">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {issue.labels.slice(0, 2).map((label) => (
                            <span key={label.id} className="px-1.5 py-0.5 text-[10px] font-mono rounded-[var(--radius-sm)] border" style={{ backgroundColor: `${label.color}20`, color: label.color, borderColor: `${label.color}40` }}>{label.name}</span>
                          ))}
                          {issue.labels.length > 2 && <span className="text-xs text-[var(--color-text-muted)]">+{issue.labels.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">{formatRelativeTime(issue.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredIssues.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-muted)]">No issues found</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Try changing your filters</p>
            </div>
          )}
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[var(--color-text-muted)]">Showing {filteredIssues.length} of {allIssues.length} issues</p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" disabled>Previous</Button>
            <Button variant="secondary" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>

      <CreateIssueModal open={createModalOpen} onOpenChange={setCreateModalOpen} projectId={projectId} />
    </AppShell>
  );
}