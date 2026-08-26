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
import { Avatar } from "@/components/ui/Avatar";
import { mockWorkspaces } from "@/mock-data";

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
  const [selectedWorkspace, setSelectedWorkspace] = React.useState(mockWorkspaces[0]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r-2 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] transition-all duration-200 flex flex-col",
        collapsed ? "w-[68px]" : "w-64"
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={cn("flex items-center border-b-2 border-[var(--color-border-primary)] h-14", collapsed ? "justify-center px-2" : "px-4")}>
        {collapsed ? (
          <Link href="/dashboard" className="flex items-center justify-center" aria-label="Forge Home">
            <div className="w-8 h-8 bg-[var(--color-accent-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
              <span className="text-[var(--color-text-inverse)] font-bold font-mono text-sm">F</span>
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="flex items-center gap-3" aria-label="Forge Home">
            <div className="w-8 h-8 bg-[var(--color-accent-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
              <span className="text-[var(--color-text-inverse)] font-bold font-mono text-sm">F</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">FORGE</span>
          </Link>
        )}
      </div>

      {/* Workspace Selector */}
      {!collapsed && (
        <div className="p-3 border-b-2 border-[var(--color-border-primary)]">
          <div className="relative">
            <select
              value={selectedWorkspace.id}
              onChange={(e) => {
                const ws = mockWorkspaces.find((w) => w.id === e.target.value);
                if (ws) setSelectedWorkspace(ws);
              }}
              className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] px-3 py-2 text-sm font-mono appearance-none cursor-pointer focus:border-[var(--color-border-focus)] focus:outline-none"
              aria-label="Select workspace"
            >
              {mockWorkspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
          </div>
        </div>
      )}

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
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-[var(--color-accent-primary)]")} />
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
    </aside>
  );
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}