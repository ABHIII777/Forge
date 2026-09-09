"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { AppShell } from "@/components/layout/AppShell";

// Frontend design only: no routing logic, no backend calls.
// Fields mirror the user-settable columns of the `discussion` table in db/schema.ts.
// Auto/backend-owned columns are intentionally absent:
// id, projectId/workspaceId (page context), authorId,
// repliesCount, viewsCount, isPinned, isLocked, createdAt, updatedAt.
export default function NewDiscussionPage() {
  return (
    <AppShell>
      <div className="p-6 max-w-[800px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">New Discussion</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Start a conversation with your team in this project.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Discussion details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <Input
                label="Title"
                name="title"
                placeholder="Give your discussion a clear title"
                defaultValue=""
                required
              />

              <Textarea
                label="Content"
                name="content"
                placeholder="Share context, questions, or proposals with your team..."
                defaultValue=""
                rows={4}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                  Category
                </label>
                <select name="category" defaultValue="general" className="input-base">
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="proposal">Proposal</option>
                  <option value="announcement">Announcement</option>
                  <option value="question">Question</option>
                </select>
              </div>

              <div>
                <Input
                  label="Tags"
                  name="tags"
                  placeholder="comma, separated, tags"
                  defaultValue=""
                />
                <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                  Separate tags with commas. Optional.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Link href="../">
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" variant="primary">
                  Start Discussion
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
