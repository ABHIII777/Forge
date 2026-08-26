"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime } from "@/lib/utils";
import { mockProjects, mockWorkspaces } from "@/mock-data";
import { Plus, Search } from "lucide-react";
import * as React from "react";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredProjects = mockProjects.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Projects</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">All projects across your workspaces</p>
          </div>
          <Button variant="primary" size="sm"><Plus className="h-4 w-4" /> New Project</Button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-base pl-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const workspace = mockWorkspaces.find((w) => w.id === project.workspaceId);
            return (
              <Link key={project.id} href={`/workspaces/${project.workspaceId}/projects/${project.id}`}>
                <Card variant="hover" className="p-5 cursor-pointer h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">{project.key}</span>
                    <Badge variant={project.status === "active" ? "success" : project.status === "planning" ? "info" : "default"} size="sm">{project.status}</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">{project.name}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <Progress value={project.progress} className="flex-1 mr-3" />
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">{project.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span>{project.openIssueCount} open issues</span>
                    <span>{workspace?.name}</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}