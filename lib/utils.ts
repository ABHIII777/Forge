import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length - 1) + "…";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(prefix: string = ""): string {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`;
}

export function getIssueCountByStatus(issues: Array<{ status: string }>): Record<string, number> {
  const counts: Record<string, number> = { backlog: 0, in_progress: 0, review: 0, done: 0 };
  issues.forEach((issue) => {
    if (issue.status in counts) {
      counts[issue.status]++;
    }
  });
  return counts;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    backlog: "var(--color-text-muted)",
    in_progress: "var(--color-status-warning)",
    review: "var(--color-status-info)",
    done: "var(--color-status-success)",
  };
  return colors[status] || "var(--color-text-muted)";
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    critical: "var(--color-priority-critical)",
    high: "var(--color-priority-high)",
    medium: "var(--color-priority-medium)",
    low: "var(--color-priority-low)",
  };
  return colors[priority] || "var(--color-text-muted)";
}