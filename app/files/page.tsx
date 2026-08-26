"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime, formatFileSize } from "@/lib/utils";
import { mockFiles, getUserById } from "@/mock-data";
import { Search, Upload, Folder, File, Download, Eye, Trash2 } from "lucide-react";

export default function GlobalFilesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredFiles = mockFiles.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Files</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">All files across your workspaces</p>
          </div>
          <Button variant="primary" size="sm"><Upload className="h-4 w-4" /> Upload</Button>
        </div>

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
                  const uploader = getUserById(file.uploadedById);
                  const Icon = file.type === "folder" ? Folder : File;
                  return (
                    <tr key={file.id} className="border-b border-[var(--color-border-primary)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors">
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><Icon className="h-5 w-5 text-[var(--color-text-muted)]" /><span className="text-[var(--color-text-primary)]">{file.name}</span></div></td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">{file.type === "folder" ? "-" : formatFileSize(file.size)}</td>
                      <td className="px-4 py-3 text-[var(--color-text-secondary)]">{uploader?.displayName}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">v{file.version}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">{formatRelativeTime(file.updatedAt)}</td>
                      <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}