import { FolderOpen, AlertCircle, MessageSquare, Bell, FileCode, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: "projects" | "issues" | "discussions" | "notifications" | "files";
  action?: { label: string; onClick: () => void };
}

const iconMap = {
  projects: FolderOpen,
  issues: AlertCircle,
  discussions: MessageSquare,
  notifications: Bell,
  files: FileCode,
};

export function EmptyState({ title, description, icon = "projects", action }: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <Card className="p-12 text-center">
      <Icon className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{title}</h3>
      {description && <p className="text-sm text-[var(--color-text-secondary)] mb-4 max-w-md mx-auto">{description}</p>}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          <Plus className="h-4 w-4" /> {action.label}
        </Button>
      )}
    </Card>
  );
}