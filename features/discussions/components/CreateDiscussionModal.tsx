"use client";

import * as React from "react"
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
import { DiscussionCategory } from "@/types";
import { useRouter } from "next/navigation";
import { workspace } from "@/db/schema";

interface CreateDiscussionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  workspaceId: string;
  onCreated?: () => void;
}

type CreateDiscussionFormData = {
  title: string;
  content: string;
  category: DiscussionCategory;
  tags: string;
  projectId: string;
  workspaceId: string;
}

const initialFormData = () : CreateDiscussionFormData => ({
  title: "",
  content: "",
  category: "general",
  tags: "",
  projectId: "",
  workspaceId: "",
})

export function CreateDiscussionModal({
  open,
  onOpenChange,
  projectId,
  workspaceId,
  onCreated,
}: CreateDiscussionModalProps) {

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [createdDiscussion, setCreatedDiscussion] = React.useState<{
    title: string,
    content: string,
    category: DiscussionCategory,
    tags: string,
    projectId: string,
    workspaceId: string
  } | null>(null)
  const [formData, setFormData] = React.useState<CreateDiscussionFormData>(() => initialFormData())
  const router = useRouter();

  const updateField = <K extends keyof CreateDiscussionFormData>(
    field: K,
    value: CreateDiscussionFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev, [field] : value
    }))
  }

  const resetFormData = () => {
    setFormData(initialFormData())
  }

  const handleNewDiscussion = async(e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    let res: unknown = null;
    try {
      const data = await fetch("/api/discussion", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          projectId: projectId,
          workspaceId: workspaceId,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        })
      })

      res = await data.json().catch(() => null)

      if (!data.ok) {
        setSubmitError((res as { error?: string })?.error ?? "Something went wrong")
        return;
      }
    } catch (err) {
      console.error(err)
      setSubmitError("Something went wrong")
      return;
    } finally {
      setIsSubmitting(false)
    }

    const newCreatedDiscussion = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
      projectId: projectId,
      workspaceId: workspaceId
    }

    setCreatedDiscussion(newCreatedDiscussion)
    resetFormData()
    onOpenChange(false)
    onCreated?.()
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Start New Discussion</DialogTitle>
          <DialogDescription>
            Discussions are conversations within projects. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleNewDiscussion} className="space-y-4">
          <Input
            label="Title"
            name="title"
            placeholder="Give your discussion a clear title"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
          />
          <Textarea
            label="Content"
            name="content"
            placeholder="Share context, questions, or proposals with your team..."
            value={formData.content}
            onChange={(e) => updateField("content", e.target.value)}
            rows={4}
            required
          />
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Category
            </label>
            <select name="category" className="input-base" value={formData.category} onChange={(e) => updateField("category", e.target.value as DiscussionCategory)}>
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
              value={formData.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              required
            />
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
              Separate tags with commas. Optional.
            </p>
          </div>
          <DialogFooter>
            <div className="flex-1">
              {submitError && (
                <p className="text-sm text-[var(--color-status-error)] text-left">{submitError}</p>
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Starting…" : "Start Discussion"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
