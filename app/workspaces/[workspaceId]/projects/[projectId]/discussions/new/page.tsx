"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { AppShell } from "@/components/layout/AppShell";
import type { DiscussionCategory } from "@/types";

export default function NewDiscussionPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const projectId = params.projectId as string;

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<DiscussionCategory>("general");
  const [tags, setTags] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/discussion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          workspaceId,
          title,
          content,
          category,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setSubmitError((data as { error?: string })?.error ?? "Failed to create discussion");
        return;
      }
      const id = (data as { discussion?: { id?: string } })?.discussion?.id;
      router.push(
        id
          ? `/workspaces/${workspaceId}/projects/${projectId}/discussions/${id}`
          : `/workspaces/${workspaceId}/projects/${projectId}/discussions`
      );
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to create discussion");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title"
                name="title"
                placeholder="Give your discussion a clear title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <Textarea
                label="Content"
                name="content"
                placeholder="Share context, questions, or proposals with your team..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DiscussionCategory)}
                  className="input-base"
                >
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
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                  Separate tags with commas. Optional.
                </p>
              </div>

              {submitError && (
                <p className="text-sm text-[var(--color-status-error)]">{submitError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Link href="./">
                  <Button type="button" variant="secondary" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Starting…" : "Start Discussion"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
