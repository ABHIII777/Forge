import type { ActivityEvent } from "@/types";

export interface ActivityWithUser extends ActivityEvent {
    user: { id: string; displayName: string; avatarUrl: string | null } | null;
}

export interface ActivityFilters {
    workspaceId?: string;
    projectId?: string;
    userId?: string;
    type?: string;
    limit?: number;
    cursor?: string;
}

export interface ActivityPage {
    activities: ActivityWithUser[];
    nextCursor: string | null;
}

export async function fetchActivity(filters: ActivityFilters = {}): Promise<ActivityPage> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== "") params.set(key, String(value));
    }
    const res = await fetch(`/api/activity?${params.toString()}`);
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to load activity");
    }
    return res.json();
}

export async function postActivity(data: {
    workspaceId: string;
    projectId?: string | null;
    type: string;
    description: string;
    metadata?: Record<string, unknown>;
}): Promise<{ activity: ActivityEvent }> {
    const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to create activity");
    }
    return res.json();
}
