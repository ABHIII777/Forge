"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, Columns3, AlertCircle, MessageSquare, FileCode, Activity, Settings, Users, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { AppShell } from "@/components/layout/AppShell";
import { formatDate } from "@/lib/utils";
import { mockUsers } from "@/mock-data";

const workspaceNav = [
  { label: "Overview", href: "", icon: Activity },
  { label: "Projects", href: "/projects", icon: Columns3 },
  { label: "Issues", href: "/issues", icon: AlertCircle },
  { label: "Discussions", href: "/discussions", icon: MessageSquare },
  { label: "Files", href: "/files", icon: FileCode },
  { label: "Team", href: "/team", icon: Users },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

const roleColors: Record<string, "primary" | "secondary" | "default" | "info"> = {
  owner: "primary",
  admin: "secondary",
  member: "default",
  viewer: "info",
};

export default function TeamPage() {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState("member");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setInviteModalOpen(false);
    setInviteEmail("");
    setInviteRole("member");
  };

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Team</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Manage your workspace members</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setInviteModalOpen(true)}><Plus className="h-4 w-4" /> Invite Member</Button>
        </div>

        <nav className="flex items-center gap-1 mb-8 overflow-x-auto pb-2" aria-label="Workspace navigation">
          {workspaceNav.map((item) => {
            const href = `/workspaces/${workspaceId}${item.href}`;
            const isActive = pathname === href;
            return (
              <Link key={item.label} href={href} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] whitespace-nowrap transition-colors ${isActive ? "bg-[var(--color-accent-primary-muted)] text-[var(--color-accent-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--color-border-primary)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Member</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Joined</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-text-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--color-border-primary)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar name={user.displayName} size="md" />
                          {user.isOnline && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-status-success)] border-2 border-[var(--color-bg-elevated)]" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">{user.displayName}</p>
                          <p className="text-xs text-[var(--color-text-muted)] font-mono">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={roleColors[user.role]} size="sm">{user.role}</Badge></td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-sm">
                        <span className={`h-2 w-2 rounded-full ${user.isOnline ? "bg-[var(--color-status-success)]" : "bg-[var(--color-text-muted)]"}`} />
                        {user.isOnline ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
          <DialogContent size="md">
            <DialogHeader>
              <DialogTitle>Invite Member</DialogTitle>
              <DialogDescription>Send an invitation to join this workspace</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4">
              <Input label="Email" type="email" placeholder="colleague@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required />
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Role</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="input-base">
                  <option value="viewer">Viewer - Can view projects and issues</option>
                  <option value="member">Member - Can create and edit</option>
                  <option value="admin">Admin - Full workspace access</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setInviteModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" loading={isSubmitting}>Send Invitation</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}