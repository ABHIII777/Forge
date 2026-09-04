"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Folder, AlertCircle, MessageSquare, User, ArrowRight, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";

interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchResultType = "project" | "issue" | "discussion" | "file" | "user";

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  url: string;
}

const typeIcons: Record<SearchResultType, React.ComponentType<{ className?: string }>> = {
  project: Folder,
  issue: AlertCircle,
  discussion: MessageSquare,
  file: FileText,
  user: User,
};

const typeLabels: Record<SearchResultType, string> = {
  project: "Project",
  issue: "Issue",
  discussion: "Discussion",
  file: "File",
  user: "User",
};

export function SearchPalette({ open, onOpenChange }: SearchPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const results = React.useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    // TODO(api): search real projects, issues, discussions, files, users.
    return [];
  }, [query]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      router.push(results[selectedIndex].url);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b-2 border-[var(--color-border-primary)]">
          <Search className="h-5 w-5 text-[var(--color-text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search projects, issues, discussions, files, users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent py-4 text-sm font-mono text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
            aria-label="Search"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded-[var(--radius-sm)] border-2 border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] px-1.5 font-mono text-[10px] font-medium text-[var(--color-text-muted)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 text-[var(--color-text-muted)] animate-spin" />
            </div>
          ) : query.trim() === "" ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">Type to search across your workspace</p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">No results found for &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="py-2" role="listbox">
              {results.map((result, index) => {
                const Icon = typeIcons[result.type];
                return (
                  <button
                    key={result.id}
                    role="option"
                    aria-selected={index === selectedIndex}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors",
                      index === selectedIndex ? "bg-[var(--color-bg-tertiary)]" : "hover:bg-[var(--color-bg-tertiary)]"
                    )}
                    onClick={() => {
                      router.push(result.url);
                      onOpenChange(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-primary)] flex items-center justify-center">
                      <Icon className="h-4 w-4 text-[var(--color-text-muted)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                          {result.title}
                        </span>
                        <Badge variant="default" size="sm">
                          {typeLabels[result.type]}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                        {result.subtitle}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--color-text-muted)] flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t-2 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] font-mono">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] font-mono">↵</kbd>
              Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] font-mono">ESC</kbd>
              Close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}