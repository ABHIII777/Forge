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
import type { ProjectStatus } from "@/types";
import { Check } from "lucide-react";

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

type CreateProjectFormData = {
  name: string;
  description: string;
  key: string;
  workspaceId: string;
  status: ProjectStatus;
};

const initialFormData = (defaultWorkspaceId?: string): CreateProjectFormData => ({
  name: "",
  description: "",
  key: "",
  workspaceId: defaultWorkspaceId || "",
  status: "planning",
});

export function CreateProjectModal({
  open,
  onOpenChange,
  defaultWorkspaceId,
}: CreateProjectModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [createdProject, setCreatedProject] = React.useState<{
    id: string;
    key: string;
    name: string;
    workspaceId: string;
    status: ProjectStatus;
  } | null>(null);

  const [formData, setFormData] = React.useState<CreateProjectFormData>(() => initialFormData(defaultWorkspaceId));

  const [lastDefaultWs, setLastDefaultWs] = React.useState(defaultWorkspaceId);
  if (defaultWorkspaceId && defaultWorkspaceId !== lastDefaultWs) {
    setLastDefaultWs(defaultWorkspaceId);
    setFormData((prev) => ({ ...prev, workspaceId: defaultWorkspaceId }));
  }

  const updateField = <K extends keyof CreateProjectFormData>(
    field: K,
    value: CreateProjectFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData(defaultWorkspaceId));
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

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      key: prev.key === "" || prev.key === generateKey(prev.name) ? generateKey(value) : prev.key,
    }));
  };

  const handleKeyChange = (value: string) => {
    updateField("key", value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (formData.name.trim().length < 3) {
      next.name = "Name must be at least 3 characters.";
    }
    if (!/^[A-Z0-9]{2,6}$/.test(formData.key)) {
      next.key = "Key must be 2-6 uppercase letters/numbers.";
    }
    if (!formData.workspaceId) {
      next.workspaceId = "Workspace is required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const data = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(formData)
    })

    const res = await data.json()

    if (data.ok) {
      console.log("looks like everything worked fine: ", data)
      setIsSubmitting(false)
    } else {
      console.log("Something went wrong")
      console.error("The error occured", res)
    }

    const newCreatedProject = {
      id: `proj_${Date.now()}`,
      key: formData.key,
      name: formData.name,
      description: formData.description,
      workspaceId: formData.workspaceId,
      status: formData.status
    }
    setCreatedProject(newCreatedProject)
    
    setIsSubmitting(false);
  };

  const handleViewProject = () => {
    if (createdProject) {
      onOpenChange(false);
      router.push(`/workspaces/${createdProject.workspaceId}/projects/${createdProject.id}`);
    }
  };

  const handleCreateAnother = () => {
    resetForm();
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
            <DialogDescription>Your new project is ready to go.</DialogDescription>
          </DialogHeader>
          <div className="border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] p-4 bg-[var(--color-bg-tertiary)]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                {createdProject.key}
              </span>
              <Badge variant="success" size="sm">
                {createdProject.status}
              </Badge>
            </div>
            <h3 className="font-semibold text-[var(--color-text-primary)]">
              {createdProject.name}
            </h3>
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
          <DialogDescription>Set up a new project in your workspace.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-[1fr_120px] gap-4">
            <Input
              label="Name"
              placeholder="My Awesome Project"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              error={errors.name}
              required
            />
            <Input
              label="Key"
              placeholder="MAP"
              value={formData.key}
              onChange={(e) => handleKeyChange(e.target.value)}
              error={errors.key}
              className="font-mono uppercase"
              maxLength={6}
              required
            />
          </div>
          <Textarea
            label="Description"
            placeholder="What is this project about?"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                Workspace
              </label>
              <select
                value={formData.workspaceId}
                onChange={(e) => updateField("workspaceId", e.target.value)}
                className="input-base"
                required
                disabled
              >
                {formData.workspaceId ? (
                  <option value={formData.workspaceId}>
                    {formData.workspaceId}
                  </option>
                ) : (
                  <option value="">No workspaces yet</option>
                )}
              </select>
              {errors.workspaceId && (
                <p className="mt-1.5 text-sm text-[var(--color-status-error)]" role="alert">
                  {errors.workspaceId}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => updateField("status", e.target.value as ProjectStatus)}
                className="input-base"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
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
