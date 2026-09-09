"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime } from "@/lib/utils";
import type { Discussion, User } from "@/types";
import { Search, MessageCircle, Eye, Pin, MessageSquare } from "lucide-react";

const categoryColors: Record<string, "info" | "warning" | "default" | "success" | "secondary"> = {
  technical: "info", proposal: "warning", general: "default", announcement: "success", question: "secondary",
};

export default function GlobalDiscussionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [discussions, setDiscussions] = React.useState<Discussion[]>([]);
  const [usersById, setUsersById] = React.useState<Record<string, User>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    fetch("/api/discussion", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load discussions");
        return res.json();
      })
      .then((data) => {
        setDiscussions(((data?.discussions ?? []) as Discussion[]));
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error(err);
        setError("Failed to load discussions");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch("/api/users", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { users: [] }))
      .then((data) => {
        const rows = (data.users ?? []) as User[];
        setUsersById(Object.fromEntries(rows.map((u) => [u.id, u])));
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error(err);
      });
    return () => controller.abort();
  }, []);

  const filteredDiscussions = discussions.filter((d) =>
    (d.title ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Discussions</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Technical discussions across your workspaces</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search discussions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-base pl-10" />
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading discussions…</p>
        ) : error ? (
          <p className="text-sm text-[var(--color-status-error)]">{error}</p>
        ) : (
          <div className="space-y-3">
            {filteredDiscussions.map((discussion) => {
              const author = usersById[discussion.authorId] ?? null;
              const tags = discussion.tags ?? [];
              const lastActivity =
                (discussion as unknown as { lastActivityAt?: Date | string }).lastActivityAt ??
                discussion.updatedAt;
              const href = discussion.projectId
                ? `/workspaces/${discussion.workspaceId}/projects/${discussion.projectId}/discussions/${discussion.id}`
                : null;
              const card = (
                <Card variant="hover" className="p-4 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <Avatar name={author?.displayName} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {discussion.isPinned && <Pin className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />}
                          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{discussion.title}</h3>
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1 mb-2">{discussion.content}</p>
                        <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                          <Badge variant={categoryColors[discussion.category] ?? "default"} size="sm">{discussion.category}</Badge>
                          <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{discussion.repliesCount} replies</span>
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{discussion.viewsCount} views</span>
                          <span className="font-mono">{formatRelativeTime(lastActivity)}</span>
                        </div>
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tags.map((tag) => (
                              <span key={tag} className="px-1.5 py-0.5 text-[10px] font-mono bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] rounded-[var(--radius-sm)] border border-[var(--color-border-primary)]">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
              );
              return href ? (
                <Link key={discussion.id} href={href} className="block">
                  {card}
                </Link>
              ) : (
                <div key={discussion.id}>{card}</div>
              );
            })}
            {filteredDiscussions.length === 0 && (
              <Card className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
                <p className="text-[var(--color-text-muted)]">No discussions yet</p>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Start a conversation from a project</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
