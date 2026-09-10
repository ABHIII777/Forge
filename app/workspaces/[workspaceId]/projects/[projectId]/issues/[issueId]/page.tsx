"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LayoutDashboard, Columns3, AlertCircle, MessageSquare, Activity, Settings, ArrowLeft, Clock, User, Tag, Paperclip } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Separator } from "@/components/ui/Separator";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import type { Comment, Issue, Project, User as AppUser } from "@/types";

export default function IssueDetailPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const projectId = params.projectId as string;
  const issueId = params.issueId as string;

  const [comment, setComment] = React.useState("");
  const [showComments, setShowComments] = React.useState<Comment[]>([])

  const [project, setProject] = React.useState<Project | null>(null)
  const [issue, setIssue] = React.useState<Issue | null>(null)

  const [usersById, setUsersById] = React.useState<Record<string, AppUser>>({})
  const [users, setUsers] = React.useState<AppUser[]>([]);

  const [isLoading, setIsLoading] = React.useState(true)

  const [openPanel, setOpenPanel] = React.useState<"status" | "assignee" | "edit" | null>(null);

  const [draftAssigneeId, setDraftAssigneeId] = React.useState<string>("");
  const [draftDueDate, setDraftDueDate] = React.useState("");
  const [draftStatus, setDraftStatus] = React.useState<Issue["status"]>("backlog");
  const [draftTitle, setDraftTitle] = React.useState<string>("");
  const [draftPriority, setDraftPriority] = React.useState<Issue["priority"]>("medium");
  const [draftDescription, setDraftDescription] = React.useState<string>("");
  const [panelError, setPanelError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch(`/api/issues/${issueId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setIssue((data?.issue ?? null) as Issue | null)
      })
      .catch((err) => {
        console.log(err)
        setIssue(null)
      })
  }, [issueId])

  React.useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setProject((data?.project ?? null) as Project | null)
      })
      .catch((err) => {
        console.log(err);
        setProject(null)
      })
      .finally(() => setIsLoading(false));
  }, [projectId])

  React.useEffect(() => {
    fetch("/api/users")
      .then((res) => (res.ok ? res.json() : { users: [] }))
      .then((data) => {
        const rows = (data.users ?? []) as AppUser[];
        setUsers(rows)
        setUsersById(Object.fromEntries(rows.map((u) => [u.id, u])));
      })
      .catch((err) => console.log(err));
  }, [])

  React.useEffect(() => {
    fetch(`/api/issueComments?issueId=${issueId}`)
      .then((res) => (res.ok ? res.json() : { comment: [] }))
      .then((data) => {
        const row = (data?.comments ?? []) as Comment[]
        setShowComments(row)
      })
      .catch((err) => {
        console.log(err)
        setShowComments([])
      })
  }, [issueId])

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-[var(--color-text-muted)]">Loading issues…</p>
        </div>
      </AppShell>
    );
  }

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

  const assignee = null as AppUser | null;
  const reporter = null as AppUser | null;

  const togglePanel = (panel: "status" | "assignee" | "edit") => {
    if (!issue) return;
    setPanelError(null);
    if (openPanel !== panel) {
      setDraftStatus(issue.status);
      setDraftAssigneeId(issue.assigneeId ?? "");
      setDraftTitle(issue.title);
      setDraftDescription(issue.description ?? "");
      setDraftPriority(issue.priority);
      setDraftDueDate("");
    }
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  const handleUpdates = async (patch: Record<string, unknown>) => {
    setPanelError(null);

    const data = await fetch(`/api/issues/${issueId}`, {
      method: "PATCH",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(patch)
    })

    const res = await data.json()

    if (!data.ok) {
      setPanelError(typeof res?.error === "string" ? res.error : "Something went wrong");
      return;
    }

    setIssue(res.issue as Issue);
    setOpenPanel(null);
  }

  const handleIssueComments = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await fetch("/api/issueComments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        issueId: issueId,
        content: comment.trim(),
      })
    })

    const res = await data.json()

    if (data.ok) {
      console.log("looks like everything is fine")
    } else {
      console.log("Something went wrong")
      console.log("Error occured: ", res)
    }
    setComment("")
  }

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
            {(issue.labels ?? []).length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-[var(--color-text-muted)]" />
                <div className="flex flex-wrap gap-2">
                  {(issue.labels ?? []).map((label) => (
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
                    <Button variant="primary" size="sm" disabled={!comment.trim()} onClick={handleIssueComments}>Comment</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mock Comments */}
              <div className="space-y-4">
                {showComments.map((comment) => {
                  const reporter = usersById[comment.authorId]
                  return (
                    <Card key={comment.id}>
                      <CardContent>
                        <div className="flex items-start gap-3">
                          <Avatar name={reporter?.displayName} size="sm" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-[var(--color-text-primary)]">{reporter?.displayName}</span>
                              <span className="text-xs text-[var(--color-text-muted)] font-mono">{formatRelativeTime(issue.createdAt)}</span>
                            </div>
                            <p className="text-sm text-[var(--color-text-secondary)]">{comment.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => togglePanel("status")}
                  >
                    Change Status
                  </Button>
                  {openPanel === "status" && (
                    <div className="mt-2 space-y-1 rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] p-2">
                      {(["backlog", "in_progress", "review", "done"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setDraftStatus(s)}
                          className={`flex w-full items-center justify-between rounded-[var(--radius-sm)] px-2 py-1.5 text-sm transition-colors ${draftStatus === s
                            ? "bg-[var(--color-accent-primary-muted)] text-[var(--color-text-primary)]"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                            }`}
                        >
                          <span className="capitalize">{s.replace("_", " ")}</span>
                          {draftStatus === s && (
                            <Badge
                              variant={s === "done" ? "success" : s === "in_progress" ? "warning" : s === "review" ? "info" : "default"}
                              size="sm"
                            >
                              Current
                            </Badge>
                          )}
                        </button>
                      ))}
                      <div className="flex justify-end gap-2 pt-1">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setOpenPanel(null)}>
                          Cancel
                        </Button>
                        <Button type="button" variant="primary" size="sm" onClick={() => handleUpdates({ status: draftStatus })}>
                          Save
                        </Button>
                      </div>
                      {openPanel === "status" && panelError && (
                        <p className="pt-1 text-xs text-[var(--color-status-error)]" role="alert">
                          {panelError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => togglePanel("assignee")}
                  >
                    Change Assignee
                  </Button>
                  {openPanel === "assignee" && (
                    <div className="mt-2 space-y-1 rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] p-2">
                      <label className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]">
                        <input
                          type="radio"
                          name="detail-assignee"
                          onChange={() => setDraftAssigneeId("")}
                          className="h-4 w-4"
                        />
                        Unassigned
                      </label>
                      {
                        users.map((user) => {
                          return (
                            <div key={user.id}>
                              <label className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]">
                                <input
                                  type="radio"
                                  name="detail-assignee"
                                  onChange={() => setDraftAssigneeId(user.id)}
                                  className="h-4 w-4"
                                />
                                {user.displayName}
                              </label>
                            </div>
                          )
                        })
                      }
                      <div className="flex justify-end gap-2 pt-1">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setOpenPanel(null)}>
                          Cancel
                        </Button>
                        <Button type="button" 
                          variant="primary" 
                          size="sm" 
                          onClick={() => handleUpdates({ assigneeId: draftAssigneeId === "" ? null : draftAssigneeId })}>
                          Save
                        </Button>
                      </div>
                      {openPanel === "assignee" && panelError && (
                        <p className="pt-1 text-xs text-[var(--color-status-error)]" role="alert">
                          {panelError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => togglePanel("edit")}
                  >
                    Edit Issue
                  </Button>
                  {openPanel === "edit" && (
                    <div className="mt-2 space-y-3 rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] p-3">
                      <Input
                        label="Title"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                      />
                      <Textarea
                        label="Description"
                        value={draftDescription}
                        onChange={(e) => setDraftDescription(e.target.value)}
                        rows={3}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                            Priority
                          </label>
                          <select
                            value={draftPriority}
                            onChange={(e) => setDraftPriority(e.target.value as typeof draftPriority)}
                            className="input-base"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
                            Due date
                          </label>
                          <input
                            type="date"
                            value={draftDueDate}
                            onChange={(e) => setDraftDueDate(e.target.value)}
                            className="input-base"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setOpenPanel(null)}>
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdates({
                            title: draftTitle,
                            description: draftDescription,
                            priority: draftPriority,
                            dueDate: draftDueDate,
                          })}
                        >
                          Save
                        </Button>
                      </div>
                      {openPanel === "edit" && panelError && (
                        <p className="pt-1 text-xs text-[var(--color-status-error)]" role="alert">
                          {panelError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Button variant="danger" size="sm" className="w-full justify-start">Delete Issue</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}