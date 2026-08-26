"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime } from "@/lib/utils";
import { mockDiscussions, getUserById } from "@/mock-data";
import { Search, Plus, MessageCircle, Eye, Pin } from "lucide-react";

const categoryColors: Record<string, "info" | "warning" | "default" | "success" | "secondary"> = {
  technical: "info", proposal: "warning", general: "default", announcement: "success", question: "secondary",
};

export default function GlobalDiscussionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredDiscussions = mockDiscussions.filter((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Discussions</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Technical discussions across your workspaces</p>
          </div>
          <Button variant="primary" size="sm"><Plus className="h-4 w-4" /> New Discussion</Button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search discussions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-base pl-10" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredDiscussions.map((discussion) => {
            const author = getUserById(discussion.authorId);
            return (
              <Card key={discussion.id} variant="hover" className="p-4 cursor-pointer">
                <div className="flex items-start gap-4">
                  <Avatar name={author?.displayName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {discussion.isPinned && <Pin className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />}
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{discussion.title}</h3>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1 mb-2">{discussion.content}</p>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                      <Badge variant={categoryColors[discussion.category]} size="sm">{discussion.category}</Badge>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{discussion.repliesCount}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{discussion.viewsCount}</span>
                      <span className="font-mono">{formatRelativeTime(discussion.lastActivityAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}