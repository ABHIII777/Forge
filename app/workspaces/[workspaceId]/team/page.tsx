"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { AppShell } from "@/components/layout/AppShell";
import { formatDate } from "@/lib/utils";
import { workspaceNav } from "@/lib/constants/navigation";

const roleColors: Record<string, "primary" | "secondary" | "default" | "info"> = {
  owner: "primary",
  admin: "secondary",
  member: "default",
  viewer: "info",
};

interface WorkspaceMemberRow {
  userId: string;
  displayName: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  isOnline: boolean;
  role: "owner" | "admin" | "member" | "viewer";
  joinedAt: string;
}

export default function TeamPage() {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState("member");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [inviteError, setInviteError] = React.useState<string | null>(null);

  const [members, setMembers] = React.useState<WorkspaceMemberRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const loadMembers = React.useCallback(async (signal?: AbortSignal) => {
    if (!workspaceId) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/members`, { signal });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setLoadError((data as { error?: string })?.error ?? "Failed to load members");
        setMembers([]);
        return;
      }
      setMembers(((data as { members?: WorkspaceMemberRow[] })?.members ?? []));
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      console.error(err);
      setLoadError("Failed to load members");
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [workspaceId]);

  React.useEffect(() => {
    const controller = new AbortController();
    loadMembers(controller.signal);
    return () => controller.abort();
  }, [loadMembers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setInviteError(null);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setInviteError((data as { error?: string })?.error ?? "Failed to invite member");
        return;
      }
      setInviteModalOpen(false);
      setInviteEmail("");
      setInviteRole("member");
      loadMembers();
    } catch (err) {
      console.error(err);
      setInviteError("Failed to invite member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setLoadError((data as { error?: string })?.error ?? "Failed to update role");
        return;
      }
      setMembers((prev) =>
        prev.map((m) => (m.userId === userId ? { ...m, role: role as WorkspaceMemberRow["role"] } : m)),
      );
    } catch (err) {
      console.error(err);
      setLoadError("Failed to update role");
    }
  };

  const handleRemove = async (userId: string, displayName: string) => {
    if (!confirm(`Remove ${displayName} from this workspace?`)) return;
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/members/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setLoadError((data as { error?: string })?.error ?? "Failed to remove member");
        return;
      }
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (err) {
      console.error(err);
      setLoadError("Failed to remove member");
    }
  };

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Team</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Manage your workspace members</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => { setInviteError(null); setInviteModalOpen(true); }}><Plus className="h-4 w-4" /> Invite Member</Button>
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

        {loadError && (
          <p className="text-sm text-[var(--color-status-error)] mb-4">{loadError}</p>
        )}

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
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-muted)]">
                      Loading members…
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-muted)]">
                      No members yet
                    </td>
                  </tr>
                ) : (
                  members.map((m) => (
                    <tr key={m.userId} className="border-b border-[var(--color-border-primary)] last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={m.displayName} size="sm" />
                          <div>
                            <p className="font-medium text-[var(--color-text-primary)]">{m.displayName}</p>
                            <p className="text-xs text-[var(--color-text-muted)] font-mono">@{m.username} · {m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={roleColors[m.role] ?? "default"} size="sm">{m.role}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: m.isOnline ? "var(--color-status-success)" : "var(--color-text-muted)" }}
                          />
                          {m.isOnline ? "Online" : "Offline"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">
                        {formatDate(m.joinedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={m.role}
                            onChange={(e) => handleRoleChange(m.userId, e.target.value)}
                            className="input-base !w-auto text-xs"
                            aria-label={`Change role for ${m.displayName}`}
                          >
                            <option value="viewer">Viewer</option>
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            <option value="owner">Owner</option>
                          </select>
                          <Button variant="secondary" size="sm" onClick={() => handleRemove(m.userId, m.displayName)}>
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
              {inviteError && (
                <p className="text-sm text-[var(--color-status-error)]">{inviteError}</p>
              )}
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setInviteModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" variant="primary" loading={isSubmitting}>Send Invitation</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
