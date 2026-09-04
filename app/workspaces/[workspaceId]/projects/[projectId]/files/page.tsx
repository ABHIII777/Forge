"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Upload, Folder, File, Search, Download, Trash2, Eye, FileCode } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime, formatFileSize } from "@/lib/utils";
import type { FileItem, Project, User } from "@/types";
import { projectNav } from "@/lib/constants/navigation";

function getFileIcon(type: string) {
  return type === "folder" ? Folder : File;
}

export default function FilesPage() {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;
  const projectId = params.projectId as string;
  // TODO(api): load real project and files.
  const project = undefined as Project | undefined;
  const files: FileItem[] = [];
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);

  if (!project) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Project not found</h2>
          </div>
        </div>
      </AppShell>
    );
  }

  const filteredFiles = files.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-[var(--color-text-muted)]">{project.key}</span>
              <Badge variant={project.status === "active" ? "success" : "info"}>{project.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{project.name}</h1>
          </div>
          <Button variant="primary" size="sm"><Upload className="h-4 w-4" /> Upload File</Button>
        </div>

        <nav className="flex items-center gap-1 mb-8 overflow-x-auto pb-2" aria-label="Project navigation">
          {projectNav.map((item) => {
            const href = `/workspaces/${workspaceId}/projects/${projectId}${item.href}`;
            const isActive = pathname === href;
            return (
              <Link key={item.label} href={href} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] whitespace-nowrap transition-colors ${isActive ? "bg-[var(--color-accent-primary-muted)] text-[var(--color-accent-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Upload Area */}
        <Card
          className={`p-8 mb-6 border-2 border-dashed text-center transition-colors ${isDragging ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary-muted)]" : "border-[var(--color-border-primary)]"}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
        >
          <Upload className="h-10 w-10 text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-secondary)]">Drag and drop files here, or click to browse</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Max file size: 50MB</p>
        </Card>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input type="text" placeholder="Search files..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-base pl-10" />
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--color-border-primary)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Size</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Uploaded by</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Version</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">Updated</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-text-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => {
                  const uploader = null as User | null;
                  const Icon = getFileIcon(file.type);
                  return (
                    <tr key={file.id} className="border-b border-[var(--color-border-primary)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-[var(--color-text-muted)]" />
                          <span className="text-[var(--color-text-primary)]">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">{file.type === "folder" ? "-" : formatFileSize(file.size)}</td>
                      <td className="px-4 py-3 text-[var(--color-text-secondary)]">{uploader?.displayName}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">v{file.version}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">{formatRelativeTime(file.updatedAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" aria-label="View"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" aria-label="Download"><Download className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <FileCode className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-[var(--color-text-muted)]">No files found</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Upload files to get started</p>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}