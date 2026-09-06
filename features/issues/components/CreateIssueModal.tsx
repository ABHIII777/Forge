"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Label, Priority, User } from "@/types";
import { useRouter } from "next/navigation";
import { Badge, Check } from "lucide-react";

interface CreateIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

type CreateIssueFormData = {
  title: string;
  description: string;
  priority: Priority;
  assigneeId: string;
  projectId: string;
}

const initialFormData = () : CreateIssueFormData => ({
  title: "",
  description: "",
  priority: "critical",
  assigneeId: "",
  projectId: "",
})

export function CreateIssueModal({ open, onOpenChange, projectId }: CreateIssueModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [labels, setLabels] = React.useState<Label[]>([]);
  const [selectedLabelIds, setSelectedLabelIds] = React.useState<string[]>([]);
  const [newLabelName, setNewLabelName] = React.useState("");
  const [newLabelColor, setNewLabelColor] = React.useState("#6366f1");
  const [createdIssue, setCreatedIssue] = React.useState<{
    id: string,
    title: string,
    description: string,
    priority: Priority,
    assigneeId: string,
    projectId: string,
  } | null>(null)

  const [formData, setFormData] = React.useState<CreateIssueFormData>(() => initialFormData())
  const router = useRouter();

  const updateField = <K extends keyof CreateIssueFormData>(
    field: K,
    value: CreateIssueFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev, [field] : value,
    }))
  }

  const resetIssueForm = () => {
    setFormData(initialFormData())
    setSelectedLabelIds([])
    setNewLabelName("")
    setCreatedIssue(null)
  }

  React.useEffect(() => {
    if (!open || !projectId) return;
    fetch(`/api/labels?projectId=${projectId}`)
      .then((res) => (res.ok ? res.json() : { labels: [] }))
      .then((data) => setLabels((data.labels ?? []) as Label[]))
      .catch((err) => console.log(err));
  }, [open, projectId]);

  const toggleLabel = (id: string) => {
    setSelectedLabelIds((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleAddLabel = async () => {
    const name = newLabelName.trim();
    if (!name || !projectId) return;
    try {
      const res = await fetch("/api/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, name, color: newLabelColor }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Label creation failed", data);
        return;
      }
      setLabels((prev) => [...prev, data.label as Label]);
      setSelectedLabelIds((prev) => [...prev, (data.label as Label).id]);
      setNewLabelName("");
    } catch (err) {
      console.error("Label creation failed", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log(formData)

    const data = await fetch("/api/issues", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        projectId: projectId,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        assigneeId: formData.assigneeId,
        labelIds: selectedLabelIds,
      })
    })

    const res = await data.json()

    if (data.ok) {
      console.log("Looks like everything worked fine", res)
    } else {
      console.log("Something went wrong")
      console.error(res)
    }

    const newCreatedIssue = {
      id: `iss_${Date.now()}`,
      projectId: projectId,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      assigneeId: formData.assigneeId
    }

    setCreatedIssue(newCreatedIssue);

    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleCreateAnotherIssue = () => {
    resetIssueForm()
  }

  const handleOpenChange = (newOpen : boolean) => {
    if (!newOpen) resetIssueForm()

      onOpenChange(newOpen)
  }

  const handleViewIssue = () => {
    if (createdIssue) {
      onOpenChange(false)
      router.push(`/issues/${createdIssue.projectId}/projects/${createdIssue.id}`)
    }
  }

  if (createdIssue) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-status-success)] text-white">
                <Check className="h-4 w-4" />
              </span>
              Project Created
            </DialogTitle>
            <DialogDescription>Your new project is ready to go.</DialogDescription>
          </DialogHeader>
          <div className="border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] p-4 bg-[var(--color-bg-tertiary)]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                {createdIssue.projectId}
              </span>
            </div>
            <h3 className="font-semibold text-[var(--color-text-primary)]">
              {createdIssue.title}
            </h3>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCreateAnotherIssue}>
              Create Another
            </Button>
            <Button type="button" variant="primary" onClick={handleViewIssue}>
              View Project <span className="ml-1">→</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogDescription>Issues are tracked within projects. Fill in the details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" placeholder="Brief description of the issue" value={formData.title} onChange={(e) => updateField("title", e.target.value)} required />
          <Textarea label="Description" placeholder="Provide more details about this issue..." value={formData.description} onChange={(e) => updateField("description", e.target.value)} rows={4} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Priority</label>
              <select value={formData.priority} onChange={(e) => updateField("priority", e.target.value as Priority)} className="input-base">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Assignee</label>
              <select value={formData.assigneeId} onChange={(e) => updateField("assigneeId", e.target.value)} className="input-base">
                <option value="">Unassigned</option>
                <option value="" disabled>No members yet</option>
              </select>
            </div>
          </div>
          <div>
            <span className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Labels</span>
            <div className="space-y-1.5">
              {labels.map((label) => (
                <label key={label.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLabelIds.includes(label.id)}
                    onChange={() => toggleLabel(label.id)}
                    className="h-4 w-4"
                  />
                  <span
                    className="px-1.5 py-0.5 text-[10px] font-mono rounded-[var(--radius-sm)] border"
                    style={{ backgroundColor: `${label.color}20`, color: label.color, borderColor: `${label.color}40` }}
                  >
                    {label.name}
                  </span>
                </label>
              ))}
              {labels.length === 0 && (
                <p className="text-xs text-[var(--color-text-muted)]">No labels yet</p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="New label name"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  maxLength={50}
                  className="input-base flex-1"
                />
                <input
                  type="color"
                  value={newLabelColor}
                  onChange={(e) => setNewLabelColor(e.target.value)}
                  className="h-9 w-10 cursor-pointer bg-transparent"
                  aria-label="Label color"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddLabel}>
                  Add
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>Create Issue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}