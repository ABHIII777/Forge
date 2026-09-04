"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Separator } from "@/components/ui/Separator";
import { AppShell } from "@/components/layout/AppShell";
import { formatDate } from "@/lib/utils";
import type { Project, User } from "@/types";
import { ExternalLink, Globe, MapPin, Calendar } from "lucide-react";

export default function ProfilePage() {
  // TODO(api): load real user and projects.
  const user = null as User | null;
  const userProjects: Project[] = [];

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="text-center">
                <Avatar name={user?.displayName} size="xl" className="mx-auto" />
                <h1 className="text-xl font-bold text-[var(--color-text-primary)] mt-4">{user?.displayName ?? "Not signed in"}</h1>
                <p className="text-sm text-[var(--color-text-muted)] font-mono">@{user?.username ?? "-"}</p>
                {user?.bio && <p className="text-sm text-[var(--color-text-secondary)] mt-2">{user.bio}</p>}
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />San Francisco</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Joined {user ? formatDate(user.createdAt) : "-"}</span>
                </div>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button variant="ghost" size="sm" aria-label="GitHub"><ExternalLink className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" aria-label="Social"><ExternalLink className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" aria-label="Website"><Globe className="h-4 w-4" /></Button>
                </div>
                <Button variant="secondary" className="w-full mt-4">Edit Profile</Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">12</p>
                <p className="text-xs text-[var(--color-text-muted)]">Projects</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">47</p>
                <p className="text-xs text-[var(--color-text-muted)]">Issues Closed</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">89</p>
                <p className="text-xs text-[var(--color-text-muted)]">Comments</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">156</p>
                <p className="text-xs text-[var(--color-text-muted)]">Contributions</p>
              </Card>
            </div>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userProjects.map((project) => (
                    <div key={project.id} className="flex items-center gap-4 p-3 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)]">
                      <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-accent-primary-muted)] flex items-center justify-center">
                        <span className="text-sm font-bold font-mono text-[var(--color-accent-primary)]">{project.key}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{project.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{project.openIssueCount} open issues</p>
                      </div>
                      <Badge variant={project.status === "active" ? "success" : "info"} size="sm">{project.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-status-success)]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[var(--color-status-success)]">+</span>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-primary)]">Created Issue #42</p>
                      <p className="text-xs text-[var(--color-text-muted)] font-mono">3 days ago</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-status-info)]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[var(--color-status-info)]">~</span>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-primary)]">Commented on Discussion</p>
                      <p className="text-xs text-[var(--color-text-muted)] font-mono">5 days ago</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent-primary)]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[var(--color-accent-primary)]">*</span>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-primary)]">Created project Auth Overhaul</p>
                      <p className="text-xs text-[var(--color-text-muted)] font-mono">30 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}