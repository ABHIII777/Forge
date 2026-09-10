"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Plus, Search, Pin, Lock, Eye, MessageCircle, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime } from "@/lib/utils";
import type { Discussion, Project, User } from "@/types";
import { projectNav } from "@/lib/constants/navigation";
import { CreateDiscussionModal } from "@/features/discussions/components/CreateDiscussionModal";

const categoryColors: Record<string, string> = {
  technical: "info",
  proposal: "warning",
  general: "default",
  announcement: "success",
  question: "secondary",
};

interface ProjectDetail {
  project: Project;
  discussions: Discussion[];
  counts: { open: number; total: number; members: number };
}

export default function DiscussionsPage() {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;
  const projectId = params.projectId as string;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [project, setProject] = React.useState<Project | null>(null);
  const [discussions, setDiscussions] = React.useState<Discussion[]>([]);
  const [createModalOpen, setCreateModalOpen] = React.useState(false)

  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [tagsFilter, setTagsFilter] = React.useState<string>("all")
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)
  const [discussionsVersion, setDiscussionsVersion] = React.useState(0)

  React.useEffect(() => {
    if (!projectId) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    setIsLoading(true);
    setNotFound(false);
    fetch(`/api/projects/${projectId}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!res.ok) throw new Error("Failed to load project");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setProject((data?.project ?? null) as Project | null)
          if (!data?.project) setNotFound(true);
        }
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error(err);
        setProject(null)
        setNotFound(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [projectId])

  React.useEffect(() => {
    if (!projectId) return;
    const controller = new AbortController();
    const query = new URLSearchParams({ projectId });
    if (workspaceId) query.set("workspaceId", workspaceId);
    fetch(`/api/discussion?${query.toString()}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const rows = (data?.discussions ?? []) as Discussion[]
        setDiscussions(rows)
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.log(err)
      })
    return () => controller.abort();
  }, [projectId, workspaceId, discussionsVersion])

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-sm text-[var(--color-text-muted)]">Loading project…</p>
        </div>
      </AppShell>
    );
  }

  if (notFound || !project) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Project not found</h2>
            <Link
              href={`/workspaces/${workspaceId}/projects`}
              className="text-sm text-[var(--color-accent-primary)] hover:underline mt-2 inline-block"
            >
              Back to projects
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const filteredDiscussions = discussions.filter((d) =>
    (d.title ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4" /> New Discussion
          </Button>
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

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search discussions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-base pl-10" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredDiscussions.map((discussion) => {
            const author = null as User | null;
            const tags = discussion.tags ?? [];
            const lastActivity =
              (discussion as unknown as { lastActivityAt?: Date | string }).lastActivityAt ??
              discussion.updatedAt;
            return (
              <Link
                key={discussion.id}
                href={`/workspaces/${workspaceId}/projects/${projectId}/discussions/${discussion.id}`}
                className="block"
              >
              <Card variant="hover" className="p-4 cursor-pointer">
                <div className="flex items-start gap-4">
                  <Avatar name={author?.displayName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {discussion.isPinned && <Pin className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />}
                      {discussion.isLocked && <Lock className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />}
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{discussion.title}</h3>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1 mb-2">{discussion.content}</p>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                      <Badge variant={categoryColors[discussion.category] as "info" | "warning" | "default" | "success" | "secondary"} size="sm">{discussion.category}</Badge>
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
              </Link>
            );
          })}
          {filteredDiscussions.length === 0 && (
            <Card className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-[var(--color-text-muted)]">No discussions yet</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Start a conversation with your team</p>
            </Card>
          )}
        </div>
      </div>
      <CreateDiscussionModal workspaceId={workspaceId} projectId={projectId} onOpenChange={setCreateModalOpen} open={createModalOpen} onCreated={() => setDiscussionsVersion((v) => v + 1)} />
    </AppShell>
  );
}