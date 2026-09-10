"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { AppShell } from "@/components/layout/AppShell";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";
import type { Workspace } from "@/types";

const roleColors: Record<string, "primary" | "secondary" | "default" | "info"> = {
  owner: "primary", admin: "secondary", member: "default", viewer: "info",
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

export default function GlobalTeamPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [membersByWorkspace, setMembersByWorkspace] = React.useState<
    { workspace: Workspace; members: WorkspaceMemberRow[] }[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    fetch("/api/workspaces", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load workspaces");
        return res.json();
      })
      .then(async (data) => {
        const workspaces = (data.workspaces ?? []) as Workspace[];
        const grouped = await Promise.all(
          workspaces.map(async (workspace) => {
            try {
              const res = await fetch(`/api/workspaces/${workspace.id}/members`, {
                signal: controller.signal,
              });
              const payload = await res.json().catch(() => null);
              return {
                workspace,
                members: (res.ok ? (payload?.members ?? []) : []) as WorkspaceMemberRow[],
              };
            } catch (err) {
              if ((err as { name?: string })?.name === "AbortError") throw err;
              console.error(err);
              return { workspace, members: [] as WorkspaceMemberRow[] };
            }
          }),
        );
        setMembersByWorkspace(grouped);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error(err);
        setError("Failed to load team members");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  const q = searchQuery.toLowerCase();
  const filtered = membersByWorkspace
    .map(({ workspace, members }) => ({
      workspace,
      members: members.filter(
        (m) =>
          m.displayName.toLowerCase().includes(q) ||
          m.username.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q),
      ),
    }))
    .filter(({ members }) => members.length > 0);

  const totalMembers = membersByWorkspace.reduce((n, g) => n + g.members.length, 0);

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Team</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              {isLoading ? "All team members across your workspaces" : `${totalMembers} member${totalMembers === 1 ? "" : "s"} across ${membersByWorkspace.length} workspace${membersByWorkspace.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-base pl-10" />
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading team members…</p>
        ) : error ? (
          <p className="text-sm text-[var(--color-status-error)]">{error}</p>
        ) : filtered.length === 0 ? (
          <Card>
            <div className="px-4 py-12 text-center text-[var(--color-text-muted)] text-sm">
              No members yet — invite people from a workspace team page.
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            {filtered.map(({ workspace, members }) => (
              <section key={workspace.id}>
                <div className="flex items-center gap-3 mb-3">
                  <Link
                    href={`/workspaces/${workspace.id}/team`}
                    className="text-base font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors"
                  >
                    {workspace.name}
                  </Link>
                  <span className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                    {members.length}
                  </span>
                </div>
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-[var(--color-border-primary)]">
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Member</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Role</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Status</th>
                          <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => (
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
