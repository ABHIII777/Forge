"use client";

import * as React from "react"
import Link from "next/link";
import { MessageCircle, Eye, Pin, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Separator } from "@/components/ui/Separator";
import { Textarea } from "@/components/ui/Textarea";
import { AppShell } from "@/components/layout/AppShell";
import { useParams } from "next/navigation";
import { Discussion, DiscussionReply, Project, User as AppUser } from "@/types";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";

const categoryVariants: Record<string, "info" | "warning" | "default" | "success" | "secondary"> = {
  technical: "info",
  proposal: "warning",
  general: "default",
  announcement: "success",
  question: "secondary",
};

export default function DiscussionDetailPage() {

  const params = useParams()
  const workspaceId = params.workspaceId as string
  const projectId = params.projectId as string
  const discussionId = params.discussionId as string

  const [project, setProject] = React.useState<Project | null>(null)
  const [discussion, setDiscussion] = React.useState<Discussion | null>(null)
  const [replies, setReplies] = React.useState<DiscussionReply[]>([])
  const [usersById, setUsersById] = React.useState<Record<string, AppUser>>({})

  const [isLoading, setIsLoading] = React.useState(false)
  const [notFound, setNotFound] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [replyContent, setReplyContent] = React.useState("")
  const [isReplying, setIsReplying] = React.useState(false)
  const [replyError, setReplyError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!discussionId) return;
    const controller = new AbortController();
    setIsLoading(true);
    setNotFound(false);
    setError(null);
    fetch(`/api/discussion/${discussionId}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!res.ok) throw new Error("Failed to load discussion");
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setDiscussion((data?.discussion ?? null) as Discussion | null)
        setReplies(((data?.replies ?? []) as DiscussionReply[]))
        if (!data?.discussion) setNotFound(true);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error(err)
        setError("Failed to load discussion");
        setDiscussion(null)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      })
    return () => controller.abort();
  }, [discussionId])

  React.useEffect(() => {
    if (!projectId) return;
    const controller = new AbortController();
    fetch(`/api/projects/${projectId}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setProject((data?.project ?? null) as Project | null)
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error(err)
        setProject(null)
      })
    return () => controller.abort();
  }, [projectId])

  React.useEffect(() => {
    const controller = new AbortController();
    fetch("/api/users", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { users: [] }))
      .then((data) => {
        const rows = (data.users ?? []) as AppUser[];
        setUsersById(Object.fromEntries(rows.map((u) => [u.id, u])));
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error(err);
      });
    return () => controller.abort();
  }, [])

  const author = discussion ? usersById[discussion.authorId] : undefined;
  const discussionTags = discussion?.tags ?? [];

  const handleReply = async () => {
    const content = replyContent.trim();
    if (!content || !discussionId || isReplying) return;
    setIsReplying(true);
    setReplyError(null);
    try {
      const res = await fetch(`/api/discussion/${discussionId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setReplyError((data as { error?: string })?.error ?? "Failed to post reply");
        return;
      }
      const reply = (data as { reply?: DiscussionReply })?.reply;
      if (reply) setReplies((prev) => [...prev, reply]);
      setReplyContent("");
    } catch (err) {
      console.error(err);
      setReplyError("Failed to post reply");
    } finally {
      setIsReplying(false);
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-sm text-[var(--color-text-muted)]">Loading discussion…</p>
        </div>
      </AppShell>
    );
  }

  if (notFound || error || !discussion) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              {error ?? "Discussion not found"}
            </h2>
            <Link
              href={`/workspaces/${workspaceId}/projects/${projectId}/discussions`}
              className="text-sm text-[var(--color-accent-primary)] hover:underline mt-2 inline-block"
            >
              Back to discussions
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-[var(--color-text-muted)]">
          <Link href={`/workspaces/${workspaceId}/projects/${projectId}`} className="hover:text-[var(--color-text-primary)] transition-colors">
            {project?.name ?? "Project"}
          </Link>
          <span>/</span>
          <Link href={`/workspaces/${workspaceId}/projects/${projectId}/discussions`} className="hover:text-[var(--color-text-primary)] transition-colors">
            Discussions
          </Link>
          <span>/</span>
          <span className="text-[var(--color-text-primary)] truncate">{discussion.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Discussion Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                {discussion.isPinned && <Pin className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />}
                <Badge variant={categoryVariants[discussion.category] ?? "default"} size="sm">{discussion.category}</Badge>
                {discussion.isLocked && <Badge variant="secondary" size="sm">locked</Badge>}
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {discussion.title}
              </h1>
            </div>

            {/* Content */}
            <Card>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap">
                    {discussion.content}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {discussionTags.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-2">
                  {discussionTags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs font-mono rounded-[var(--radius-sm)] border border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Replies */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                Replies ({replies.length})
              </h2>

              {/* Reply Input */}
              <Card className="mb-4">
                <CardContent>
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={3}
                    disabled={discussion.isLocked || isReplying}
                  />
                  {replyError && (
                    <p className="text-sm text-[var(--color-status-error)] mt-2">{replyError}</p>
                  )}
                  <div className="flex justify-end mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={discussion.isLocked || isReplying || !replyContent.trim()}
                      onClick={handleReply}
                    >
                      {isReplying ? "Posting…" : "Reply"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {replies.map((reply) => {
                  const replyAuthor = usersById[reply.authorId];
                  return (
                    <Card key={reply.id}>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar name={replyAuthor?.displayName} size="xs" />
                          <span className="text-sm text-[var(--color-text-primary)]">
                            {replyAuthor?.displayName ?? "Unknown"}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)] font-mono">
                            {formatRelativeTime(reply.createdAt)}
                            {reply.isEdited ? " (edited)" : ""}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
                {replies.length === 0 && (
                  <Card>
                    <CardContent>
                      <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
                        No replies yet. Start the conversation above.
                      </p>
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
                  <span className="text-sm text-[var(--color-text-secondary)]">Author</span>
                  <div className="flex items-center gap-2">
                    <Avatar name={author?.displayName} size="xs" />
                    <span className="text-sm text-[var(--color-text-primary)]">{author?.displayName ?? "—"}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Created
                  </span>
                  <span className="text-sm text-[var(--color-text-muted)] font-mono" title={formatDateTime(discussion.createdAt)}>
                    {formatRelativeTime(discussion.createdAt)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> Replies
                  </span>
                  <span className="text-sm font-mono text-[var(--color-text-primary)]">{replies.length}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Views
                  </span>
                  <span className="text-sm font-mono text-[var(--color-text-primary)]">{discussion.viewsCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
