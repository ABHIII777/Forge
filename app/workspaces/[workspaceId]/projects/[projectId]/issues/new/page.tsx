"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { AppShell } from "@/components/layout/AppShell";

// Frontend design only: no routing logic, no backend calls.
// Fields mirror the user-settable columns of the `issue` table in db/schema.ts.
// Auto/backend-owned columns are intentionally absent:
// id, projectId (page context), number (sequenced), reporterId,
// commentsCount, attachmentsCount, createdAt, updatedAt.
export default function NewIssuePage() {
  return (
    <AppShell>
      <div className="p-6 max-w-[800px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">New Issue</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Track a new piece of work in this project.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Issue details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <Input
                label="Title"
                name="title"
                placeholder="Brief description of the issue"
                defaultValue=""
                required
              />

              <Textarea
                label="Description"
                name="description"
                placeholder="Provide more details about this issue..."
                defaultValue=""
                rows={4}
              />

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                  Priority
                </label>
                <select name="priority" defaultValue="medium" className="input-base">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                  Assignee
                </label>
                <select name="assigneeId" defaultValue="" className="input-base">
                  <option value="">Unassigned</option>
                  <option value="" disabled>
                    No members yet
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                  Due date
                </label>
                <input type="date" name="dueDate" defaultValue="" className="input-base" />
                <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                  Optional. Start and completion dates are set automatically as the issue moves.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Link href="../">
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" variant="primary">
                  Create Issue
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
