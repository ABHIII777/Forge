"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/Badge";
import { mockWorkspaces, mockUsers } from "@/mock-data";
import type { ProjectStatus, Priority } from "@/types";
import { Check, X } from "lucide-react";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultWorkspaceId?: string;
}

interface FormErrors {
  name?: string;
  key?: string;
  workspaceId?: string;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  defaultWorkspaceId,
}: CreateProjectModalProps) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [key, setKey] = React.useState("");
  const [workspaceId, setWorkspaceId] = React.useState(defaultWorkspaceId || mockWorkspaces[0].id);
  const [visibility, setVisibility] = React.useState<"public" | "private">("public");
  const [status, setStatus] = React.useState<ProjectStatus>("planning");
  const [priority, setPriority] = React.useState<Priority | "none">("none");
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [createdProject, setCreatedProject] = React.useState<{
    id: string;
    key: string;
    name: string;
  } | null>(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setKey("");
    setWorkspaceId(defaultWorkspaceId || mockWorkspaces[0].id);
    setVisibility("public");
    setStatus("planning");
    setPriority("none");
    setTags([]);
    setTagInput("");
    setSelectedMembers([]);
    setErrors({});
    setCreatedProject(null);
  };

  const generateKey = (projectName: string) => {
    return projectName
      .split(/\s+/)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 6);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!key || key === generateKey(name)) {
      setKey(generateKey(newName));
    }
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    setKey(newKey);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (name.trim().length > 50) {
      newErrors.name = "Name must be 50 characters or less";
    }
    if (!key.trim() || key.trim().length < 2) {
      newErrors.key = "Key must be at least 2 characters";
    } else if (key.trim().length > 6) {
      newErrors.key = "Key must be 6 characters or less";
    }
    if (!workspaceId) {
      newErrors.workspaceId = "Please select a workspace";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setCreatedProject({
      id: `proj_${Date.now()}`,
      key: key,
      name: name.trim(),
    });
  };

  const handleCreateAnother = () => {
    resetForm();
  };

  const handleViewProject = () => {
    if (createdProject) {
      onOpenChange(false);
      router.push(`/workspaces/${workspaceId}/projects/${createdProject.id}`);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  if (createdProject) {
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
            <DialogDescription>
              Your new project is ready to go.
            </DialogDescription>
          </DialogHeader>
          <div className="border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] p-4 bg-[var(--color-bg-tertiary)]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[var(--color-text-muted)]">{createdProject.key}</span>
              <Badge variant="success" size="sm">{status}</Badge>
            </div>
            <h3 className="font-semibold text-[var(--color-text-primary)]">{createdProject.name}</h3>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCreateAnother}>
              Create Another
            </Button>
            <Button type="button" variant="primary" onClick={handleViewProject}>
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
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Set up a new project in your workspace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-[1fr_120px] gap-4">
            <Input
              label="Name"
              placeholder="My Awesome Project"
              value={name}
              onChange={handleNameChange}
              error={errors.name}
              required
            />
            <Input
              label="Key"
              placeholder="KEY"
              value={key}
              onChange={handleKeyChange}
              error={errors.key}
              className="font-mono uppercase"
              maxLength={6}
              required
            />
          </div>
          <Textarea
            label="Description"
            placeholder="What is this project about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                Workspace
              </label>
              <select
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                className="input-base"
                required
              >
                {mockWorkspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as "public" | "private")}
                className="input-base"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="input-base"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority | "none")}
                className="input-base"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Tags
            </label>
            <div className="input-base flex flex-wrap items-center gap-1.5 min-h-[42px] px-3 py-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="default" size="sm" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {tags.length < 5 && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "Add tags (comma separated)" : ""}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] min-w-[120px]"
                />
              )}
            </div>
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">Press Enter or comma to add. Max 5 tags.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Invite Members
            </label>
            <div className="grid grid-cols-2 gap-2 p-3 border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)]">
              {mockUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-2 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-secondary)] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user.id)}
                    onChange={() => toggleMember(user.id)}
                    className="rounded border-2 border-[var(--color-border-primary)] text-[var(--color-accent-primary)] focus:ring-[var(--color-border-focus)]"
                  />
                  <span className="text-sm text-[var(--color-text-primary)]">{user.displayName}</span>
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
              {selectedMembers.length} member{selectedMembers.length !== 1 ? "s" : ""} selected
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
