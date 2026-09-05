"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime } from "@/lib/utils";
import type { Issue, Project, User } from "@/types";
import { Search, Plus } from "lucide-react";

export default function GlobalIssuesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>("");
  const allIssues: Issue[] = [];

  React.useEffect(() => {
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : { projects: [] }))
      .then((data) => {
        const rows = (data.projects ?? []) as Project[];
        setProjects(rows);
        setSelectedProjectId((prev) => prev || rows[0]?.id || "");
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredIssues = allIssues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const newIssueHref = selectedProject
    ? `/workspaces/${selectedProject.workspaceId}/projects/${selectedProject.id}/issues/new`
    : "#";

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Issues</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">All issues across your workspaces</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] px-3 py-2 text-sm font-mono"
              aria-label="Select project"
            >
              {projects.length === 0 && <option value="">No projects yet</option>}
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.key} — {p.name}
                </option>
              ))}
            </select>
            <Link href={newIssueHref} aria-disabled={!selectedProject}>
              <Button variant="primary" size="sm" disabled={!selectedProject}>
                <Plus className="h-4 w-4" /> New Issue
              </Button>
            </Link>
          </div>
        </div>

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
        </div>

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
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => {
                  const assignee = null as User | null;
                  const ownerProject = projects.find((p) => p.id === issue.projectId);
                  return (
                    <tr key={issue.id} className="border-b border-[var(--color-border-primary)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors">
                      <td className="px-4 py-3 font-mono text-[var(--color-text-muted)]">#{issue.number}</td>
                      <td className="px-4 py-3">
                        <Link href={ownerProject ? `/workspaces/${ownerProject.workspaceId}/projects/${issue.projectId}/issues/${issue.id}` : "#"} className="text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors">{issue.title}</Link>
                      </td>
                      <td className="px-4 py-3"><Badge variant={issue.status === "done" ? "success" : issue.status === "in_progress" ? "warning" : issue.status === "review" ? "info" : "default"} size="sm">{issue.status.replace("_", " ")}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={issue.priority === "critical" ? "error" : issue.priority === "high" ? "warning" : "default"} size="sm">{issue.priority}</Badge></td>
                      <td className="px-4 py-3">{assignee ? <div className="flex items-center gap-2"><Avatar name={assignee.displayName} size="xs" /><span className="text-[var(--color-text-secondary)]">{assignee.displayName}</span></div> : <span className="text-[var(--color-text-muted)]">Unassigned</span>}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">{formatRelativeTime(issue.updatedAt)}</td>
                    </tr>
                  );
                })}
                {filteredIssues.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-[var(--color-text-muted)]">
                      No issues yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}