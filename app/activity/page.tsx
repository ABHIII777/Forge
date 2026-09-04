"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime } from "@/lib/utils";
import type { ActivityEvent, User } from "@/types";

export default function ActivityPage() {
  // TODO(api): load real activity.
  const activities: ActivityEvent[] = [];
  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Activity</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Recent activity across your workspaces</p>
        </div>

        <Card>
          <CardContent>
            <div className="space-y-0">
              {activities.map((activity, index) => {
                const user = null as User | null;
                return (
                  <div key={activity.id} className="flex items-start gap-4 py-4 border-b border-[var(--color-border-primary)] last:border-0">
                    <div className="relative">
                      <Avatar name={user?.displayName} size="md" />
                      {index < activities.length - 1 && <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-full bg-[var(--color-border-primary)]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)]">
                        <span className="font-medium">{user?.displayName}</span>{" "}
                        {activity.description}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] font-mono mt-1">
                        {formatRelativeTime(activity.createdAt)}
                      </p>
                    </div>
                    <Badge variant="default" size="sm">{activity.type.replace("_", " ")}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}