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

export interface CreateWorkspaceInput {
  name: string;
  slug: string;
  description: string;
}

interface CreateWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (input: CreateWorkspaceInput) => void;
}

export function CreateWorkspaceModal({
  open,
  onOpenChange,
  onCreate,
}: CreateWorkspaceModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onCreate?.({
      name: String(data.get("name") || "").trim(),
      slug: String(data.get("slug") || "").trim(),
      description: String(data.get("description") || "").trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Workspaces group your projects, members, and activity in one place.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            placeholder="My Awesome Workspace"
            defaultValue=""
            required
          />
          <div>
            <Input
              label="Slug"
              name="slug"
              placeholder="my-awesome-workspace"
              defaultValue=""
              className="font-mono lowercase"
              maxLength={50}
              required
            />
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
              Used in URLs, e.g. /workspaces/
              <span className="font-mono">my-awesome-workspace</span>
            </p>
          </div>
          <Textarea
            label="Description"
            name="description"
            placeholder="What is this workspace for?"
            defaultValue=""
            rows={3}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
