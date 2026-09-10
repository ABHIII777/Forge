"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ListSkeleton } from "@/components/feedback/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { formatRelativeTime } from "@/lib/utils";
import { activityTypeEnum } from "@/lib/validators";
import { useActivity } from "@/hooks/useActivity";

export default function ActivityPage() {
  const [typeFilter, setTypeFilter] = useState<string>("");
  const { items, nextCursor, loading, loadingMore, error, loadMore } = useActivity(
    typeFilter ? { type: typeFilter, limit: 20 } : { limit: 20 },
  );

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Activity</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Recent activity across your workspaces</p>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-[var(--color-bg-elevated)] border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-[var(--color-text-primary)]"
            aria-label="Filter by event type"
          >
            <option value="">All events</option>
            {activityTypeEnum.options.map((t) => (
              <option key={t} value={t}>{t.replace(".", " · ")}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <ListSkeleton items={6} />
        ) : error ? (
          <ErrorState title="Failed to load activity" message={error} />
        ) : items.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Actions like creating issues, projects, discussions, and comments will show up here."
            icon="notifications"
          />
        ) : (
          <Card>
            <CardContent>
              <div className="space-y-0">
                {items.map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-4 py-4 border-b border-[var(--color-border-primary)] last:border-0">
                    <div className="relative">
                      <Avatar name={activity.user?.displayName} size="md" />
                      {index < items.length - 1 && <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-full bg-[var(--color-border-primary)]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)]">
                        <span className="font-medium">{activity.user?.displayName ?? "Someone"}</span>{" "}
                        {activity.description}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] font-mono mt-1">
                        {formatRelativeTime(activity.createdAt)}
                      </p>
                    </div>
                    <Badge variant="default" size="sm">{activity.type.replace("_", " ")}</Badge>
                  </div>
                ))}
              </div>
              {nextCursor && (
                <div className="flex justify-center pt-4">
                  <Button variant="secondary" size="sm" onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? "Loading…" : "Load more"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
