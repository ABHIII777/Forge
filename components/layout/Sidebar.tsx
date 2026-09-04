"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  AlertCircle,
  MessageSquare,
  FileCode,
  Users,
  Activity,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { Workspace } from "@/types";
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal";
import { WorkspaceList } from "@/features/workspaces/components/WorkspaceList";
import {
  CreateWorkspaceModal,
  type CreateWorkspaceInput,
} from "@/features/workspaces/components/CreateWorkspaceModal";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/issues", label: "Issues", icon: AlertCircle },
  { href: "/discussions", label: "Discussions", icon: MessageSquare },
  { href: "/files", label: "Files", icon: FileCode },
  { href: "/team", label: "Team", icon: Users },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = React.useState<string | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = React.useState(false);

  const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  React.useEffect(() => {
    fetch("/api/workspaces")
      .then((res) => (res.ok ? res.json() : { workspaces: [] }))
      .then((data) => {
        const rows = (data.workspaces ?? []) as Workspace[];
        setWorkspaces(rows);
        setSelectedWorkspaceId((prev) => prev ?? rows[0]?.id);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleCreateWorkspace = async (input: CreateWorkspaceInput) => {
    // Optimistic draft for instant feedback; swapped for the server row below.
    const now = new Date();
    const draft: Workspace = {
      id: `ws_${Date.now()}`,
      name: input.name,
      slug: input.slug,
      description: input.description,
      ownerId: "",
      memberCount: 1,
      projectCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setWorkspaces((prev) => [...prev, draft]);
    setSelectedWorkspaceId(draft.id);

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Workspace creation failed", data);
        return;
      }
      setWorkspaces((prev) => prev.map((w) => (w.id === draft.id ? data.workspace : w)));
      setSelectedWorkspaceId(data.workspace.id);
    } catch (err) {
      console.error("Workspace creation failed", err);
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r-2 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] transition-all duration-200 flex flex-col",
        collapsed ? "w-[68px]" : "w-64",
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b-2 border-[var(--color-border-primary)] h-14",
          collapsed ? "justify-center px-2" : "px-4",
        )}
      >
        {collapsed ? (
          <Link href="/" className="flex items-center justify-center" aria-label="Forge Home">
            <div className="w-8 h-8 bg-[var(--color-accent-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
              <span className="text-[var(--color-text-inverse)] font-bold font-mono text-sm">
                F
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-3" aria-label="Forge Home">
            <div className="w-8 h-8 bg-[var(--color-accent-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
              <span className="text-[var(--color-text-inverse)] font-bold font-mono text-sm">
                F
              </span>
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
              FORGE
            </span>
          </Link>
        )}
      </div>

      {/* Workspaces */}
      <WorkspaceList
        workspaces={workspaces}
        selectedId={selectedWorkspaceId}
        collapsed={collapsed}
        onSelect={setSelectedWorkspaceId}
        onNew={() => setIsCreateWorkspaceOpen(true)}
      />

      {/* New Project Button */}
      <div className="p-3 border-b-2 border-[var(--color-border-primary)]">
        <Button
          variant="primary"
          size={collapsed ? "sm" : "md"}
          className={cn("w-full", collapsed && "px-2")}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span>New Project</span>}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                isActive ? "sidebar-link-active" : "sidebar-link",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon
                className={cn("h-5 w-5 shrink-0", isActive && "text-[var(--color-accent-primary)]")}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Keyboard shortcut hint */}
      {!collapsed && (
        <div className="px-4 py-2 border-t-2 border-[var(--color-border-primary)]">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Command className="h-3 w-3" />
            <span>⌘K to search</span>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="border-t-2 border-[var(--color-border-primary)] p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn("w-full", collapsed && "justify-center px-2")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </Button>
      </div>
      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        defaultWorkspaceId={selectedWorkspace?.id}
      />
      <CreateWorkspaceModal
        open={isCreateWorkspaceOpen}
        onOpenChange={setIsCreateWorkspaceOpen}
        onCreate={handleCreateWorkspace}
      />
    </aside>
  );
}
