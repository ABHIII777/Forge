"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";

interface WorkspaceListProps {
  workspaces: Workspace[];
  selectedId?: string;
  collapsed?: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function WorkspaceList({
  workspaces,
  selectedId,
  collapsed = false,
  onSelect,
  onNew,
}: WorkspaceListProps) {
  return (
    <div className="border-b-2 border-[var(--color-border-primary)]">
      {!collapsed && (
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
            Workspaces
          </span>
          <button
            type="button"
            onClick={onNew}
            className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
            aria-label="New workspace"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div className={cn("py-2 px-2 space-y-0.5", collapsed && "px-2")}>
        {workspaces.map((ws) => {
          const isActive = ws.id === selectedId;
          return (
            <button
              key={ws.id}
              type="button"
              onClick={() => onSelect(ws.id)}
              title={collapsed ? ws.name : undefined}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex items-center gap-2.5 w-full rounded-[var(--radius-md)] text-left transition-colors",
                collapsed ? "justify-center p-2" : "px-2.5 py-2",
                isActive
                  ? "bg-[var(--color-accent-primary-muted)]"
                  : "hover:bg-[var(--color-bg-tertiary)]",
              )}
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-[var(--radius-md)] bg-[var(--color-accent-primary)] flex items-center justify-center">
                <span className="text-[var(--color-text-inverse)] font-bold font-mono text-xs">
                  {ws.name.charAt(0).toUpperCase()}
                </span>
              </span>
              {!collapsed && (
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {ws.name}
                  </span>
                  <span className="block text-xs text-[var(--color-text-muted)] font-mono truncate">
                    {ws.slug}
                  </span>
                </span>
              )}
            </button>
          );
        })}
        {workspaces.length === 0 && !collapsed && (
          <p className="px-2.5 py-2 text-xs text-[var(--color-text-muted)]">
            No workspaces yet
          </p>
        )}
        <button
          type="button"
          onClick={onNew}
          className={cn(
            "flex items-center gap-2.5 w-full rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors",
            collapsed ? "justify-center p-2" : "px-2.5 py-2",
          )}
          title={collapsed ? "New workspace" : undefined}
          aria-label="New workspace"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="text-sm">New workspace</span>}
        </button>
      </div>
    </div>
  );
}
