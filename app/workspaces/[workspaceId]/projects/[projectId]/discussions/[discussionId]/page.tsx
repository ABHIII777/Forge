"use client";

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

// Frontend design only: no routing logic, no backend calls.
// All content below is static placeholder to establish layout and styling.
// TODO(api): fetch GET /api/discussions/[id] ({ discussion, replies }),
// render real rows, loading + not-found states.
export default function DiscussionDetailPage() {

  const params = useParams()
  const workspaceId = params.workspaceId as string
  const projectId = params.projectId as string
  const discussionId = params.discussionId as string

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-[var(--color-text-muted)]">
          <Link href="../" className="hover:text-[var(--color-text-primary)] transition-colors">
            Project
          </Link>
          <span>/</span>
          <Link href="./" className="hover:text-[var(--color-text-primary)] transition-colors">
            Discussions
          </Link>
          <span>/</span>
          <span className="text-[var(--color-text-primary)]">Discussion title</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Discussion Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Pin className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />
                <Badge variant="info" size="sm">technical</Badge>
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Discussion title
              </h1>
            </div>

            {/* Content */}
            <Card>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap">
                    Discussion content goes here. This placeholder establishes
                    the layout until real data is wired.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs font-mono rounded-[var(--radius-sm)] border border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]">
                  example-tag
                </span>
              </div>
            </div>

            <Separator />

            {/* Replies */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                Replies (0)
              </h2>

              {/* Reply Input */}
              <Card className="mb-4">
                <CardContent>
                  <Textarea placeholder="Write a reply..." defaultValue="" rows={3} />
                  <div className="flex justify-end mt-3">
                    <Button variant="primary" size="sm">
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardContent>
                    <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
                      No replies yet. Start the conversation above.
                    </p>
                  </CardContent>
                </Card>
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
                    <Avatar size="xs" />
                    <span className="text-sm text-[var(--color-text-primary)]">—</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Created
                  </span>
                  <span className="text-sm text-[var(--color-text-muted)] font-mono">—</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> Replies
                  </span>
                  <span className="text-sm font-mono text-[var(--color-text-primary)]">0</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Views
                  </span>
                  <span className="text-sm font-mono text-[var(--color-text-primary)]">0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
