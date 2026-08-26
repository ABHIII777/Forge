"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LayoutDashboard, Columns3, AlertCircle, MessageSquare, FileCode, Activity, Settings, ArrowLeft, Clock, User, Tag, Paperclip } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Separator } from "@/components/ui/Separator";
import { Textarea } from "@/components/ui/Textarea";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { getIssueById, getProjectById, getUserById, mockUsers } from "@/mock-data";

export default function IssueDetailPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const projectId = params.projectId as string;
  const issueId = params.issueId as string;
  const project = getProjectById(projectId);
  const issue = getIssueById(issueId);
  const [comment, setComment] = React.useState("");

  if (!project || !issue) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Issue not found</h2>
            <p className="text-[var(--color-text-secondary)] mt-2">The issue you are looking for does not exist.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const assignee = issue.assigneeId ? getUserById(issue.assigneeId) : null;
  const reporter = getUserById(issue.reporterId);

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-[var(--color-text-muted)]">
          <Link href={`/workspaces/${workspaceId}/projects/${projectId}`} className="hover:text-[var(--color-text-primary)] transition-colors">{project.name}</Link>
          <span>/</span>
          <Link href={`/workspaces/${workspaceId}/projects/${projectId}/issues`} className="hover:text-[var(--color-text-primary)] transition-colors">Issues</Link>
          <span>/</span>
          <span className="text-[var(--color-text-primary)]">#{issue.number}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-[var(--color-text-muted)]">#{issue.number}</span>
                <Badge variant={issue.status === "done" ? "success" : issue.status === "in_progress" ? "warning" : issue.status === "review" ? "info" : "default"}>{issue.status.replace("_", " ")}</Badge>
                <Badge variant={issue.priority === "critical" ? "error" : issue.priority === "high" ? "warning" : issue.priority === "medium" ? "info" : "default"}>{issue.priority}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{issue.title}</h1>
            </div>

            {/* Description */}
            <Card>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap">{issue.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Labels */}
            {issue.labels.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-[var(--color-text-muted)]" />
                <div className="flex flex-wrap gap-2">
                  {issue.labels.map((label) => (
                    <span key={label.id} className="px-2 py-1 text-xs font-mono rounded-[var(--radius-sm)] border" style={{ backgroundColor: `${label.color}20`, color: label.color, borderColor: `${label.color}40` }}>{label.name}</span>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Comments */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Comments ({issue.commentsCount})</h2>
              
              {/* Comment Input */}
              <Card className="mb-4">
                <CardContent>
                  <Textarea placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
                  <div className="flex justify-end mt-3">
                    <Button variant="primary" size="sm" disabled={!comment.trim()}>Comment</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mock Comments */}
              <div className="space-y-4">
                <Card>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <Avatar name={reporter?.displayName} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">{reporter?.displayName}</span>
                          <span className="text-xs text-[var(--color-text-muted)] font-mono">{formatRelativeTime(issue.createdAt)}</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)]">I can reproduce this issue consistently. The WebSocket connection drops and never recovers.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {assignee && (
                  <Card>
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <Avatar name={assignee.displayName} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[var(--color-text-primary)]">{assignee.displayName}</span>
                            <Badge variant="primary" size="sm">Assignee</Badge>
                            <span className="text-xs text-[var(--color-text-muted)] font-mono">{formatRelativeTime(issue.updatedAt)}</span>
                          </div>
                          <p className="text-sm text-[var(--color-text-secondary)]">Working on a fix. The issue is in the reconnection logic - it does not properly handle the exponential backoff reset.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2"><User className="h-4 w-4" /> Assignee</span>
                  {assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={assignee.displayName} size="xs" />
                      <span className="text-sm text-[var(--color-text-primary)]">{assignee.displayName}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-[var(--color-text-muted)]">Unassigned</span>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)]">Reporter</span>
                  <span className="text-sm text-[var(--color-text-primary)]">{reporter?.displayName}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2"><Clock className="h-4 w-4" /> Created</span>
                  <span className="text-sm text-[var(--color-text-muted)] font-mono">{formatDate(issue.createdAt)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)]">Updated</span>
                  <span className="text-sm text-[var(--color-text-muted)] font-mono">{formatRelativeTime(issue.updatedAt)}</span>
                </div>
                {issue.dueDate && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">Due Date</span>
                      <span className="text-sm text-[var(--color-text-muted)] font-mono">{formatDate(issue.dueDate)}</span>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2"><Paperclip className="h-4 w-4" /> Attachments</span>
                  <span className="text-sm text-[var(--color-text-primary)] font-mono">{issue.attachmentsCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button variant="secondary" size="sm" className="w-full justify-start">Change Status</Button>
                <Button variant="secondary" size="sm" className="w-full justify-start">Change Assignee</Button>
                <Button variant="secondary" size="sm" className="w-full justify-start">Edit Issue</Button>
                <Button variant="danger" size="sm" className="w-full justify-start">Delete Issue</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}