"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Plus, MessageCircle, Paperclip, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { AppShell } from "@/components/layout/AppShell";
import { getProjectById, getIssuesByProject, getUserById } from "@/mock-data";
import type { IssueStatus } from "@/types";
import { projectNav } from "@/lib/constants/navigation";

const columns: { status: IssueStatus; label: string; color: string }[] = [
  { status: "backlog", label: "BACKLOG", color: "var(--color-text-muted)" },
  { status: "in_progress", label: "IN PROGRESS", color: "var(--color-status-warning)" },
  { status: "review", label: "REVIEW", color: "var(--color-status-info)" },
  { status: "done", label: "DONE", color: "var(--color-status-success)" },
];

export default function BoardPage() {
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
          <Button variant="primary" size="sm"><Plus className="h-4 w-4" /> New Issue</Button>
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

        <div className="grid grid-cols-4 gap-4 min-h-[60vh]">
          {columns.map((col) => {
            const colIssues = issues.filter((i) => i.status === col.status);
            return (
              <div key={col.status} className="flex flex-col">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: col.color }} />
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--color-text-muted)]">{col.label}</h3>
                  <span className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">{colIssues.length}</span>
                </div>
                <div className="flex-1 space-y-3 min-h-[100px] p-2 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-primary)] rounded-[var(--radius-lg)]">
                  {colIssues.map((issue) => {
                    const assignee = issue.assigneeId ? getUserById(issue.assigneeId) : null;
                    return (
                      <Card key={issue.id} className="p-3 cursor-pointer hover:border-[var(--color-border-secondary)] transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-[var(--color-text-muted)]">#{issue.number}</span>
                          <Badge variant={issue.priority === "critical" ? "error" : issue.priority === "high" ? "warning" : "default"} size="sm">{issue.priority}</Badge>
                        </div>
                        <p className="text-sm text-[var(--color-text-primary)] font-medium mb-2 line-clamp-2">{issue.title}</p>
                        {issue.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {issue.labels.map((label) => (
                              <span key={label.id} className="px-1.5 py-0.5 text-[10px] font-mono rounded-[var(--radius-sm)] border" style={{ backgroundColor: `${label.color}20`, color: label.color, borderColor: `${label.color}40` }}>{label.name}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                            {issue.commentsCount > 0 && <span className="flex items-center gap-1 text-xs"><MessageCircle className="h-3 w-3" />{issue.commentsCount}</span>}
                            {issue.attachmentsCount > 0 && <span className="flex items-center gap-1 text-xs"><Paperclip className="h-3 w-3" />{issue.attachmentsCount}</span>}
                          </div>
                          {assignee && <Avatar name={assignee.displayName} size="xs" />}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}