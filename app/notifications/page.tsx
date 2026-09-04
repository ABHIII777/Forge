"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck, Filter, MessageSquare, AlertCircle, Users, FolderKanban, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { AppShell } from "@/components/layout/AppShell";
import { formatRelativeTime } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types";

const typeIcons: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  mention: MessageSquare,
  assignment: AlertCircle,
  comment: MessageSquare,
  workspace_invite: Users,
  project_activity: FolderKanban,
  system: Settings,
};

const typeLabels: Record<NotificationType, string> = {
  mention: "Mention",
  assignment: "Assignment",
  comment: "Comment",
  workspace_invite: "Invitation",
  project_activity: "Activity",
  system: "System",
};

export default function NotificationsPage() {
  // TODO(api): load real notifications.
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Notifications</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You are all caught up"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setFilter(filter === "all" ? "unread" : "all")}>
              <Filter className="h-4 w-4" /> {filter === "all" ? "Show Unread" : "Show All"}
            </Button>
            {unreadCount > 0 && (
              <Button variant="primary" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4" /> Mark All Read
              </Button>
            )}
          </div>
        </div>

        <Card>
          <div className="divide-y divide-[var(--color-border-primary)]">
            {filteredNotifications.map((notification) => {
              const Icon = typeIcons[notification.type];
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 transition-colors ${!notification.isRead ? "bg-[var(--color-accent-primary-muted)]/30" : ""}`}
                >
                  <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-primary)] flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-[var(--color-text-muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{notification.title}</p>
                      {!notification.isRead && <span className="h-2 w-2 rounded-full bg-[var(--color-accent-primary)]" />}
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">{notification.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="default" size="sm">{typeLabels[notification.type]}</Badge>
                      <span className="text-xs text-[var(--color-text-muted)] font-mono">{formatRelativeTime(notification.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.isRead && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} aria-label="Mark as read">
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {notification.actionUrl && (
                      <Link href={notification.actionUrl}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
                <p className="text-[var(--color-text-muted)]">No notifications</p>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">You are all caught up</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}