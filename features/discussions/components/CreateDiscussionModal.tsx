"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

// Frontend design only: no state, no routing, no backend calls.
// Fields mirror the user-settable columns of the `discussion` table in db/schema.ts.
// Auto/backend-owned columns are intentionally absent:
// id, projectId/workspaceId (page context), authorId,
// repliesCount, viewsCount, isPinned, isLocked, createdAt, updatedAt.
interface CreateDiscussionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDiscussionModal({
  open,
  onOpenChange,
}: CreateDiscussionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Start New Discussion</DialogTitle>
          <DialogDescription>
            Discussions are conversations within projects. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
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
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Start Discussion
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
