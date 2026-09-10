import type { SessionData, User } from "@/types";

async function handle(res: Response, fallback: string) {
    const body = await res.json().catch(() => null);
    if (!res.ok) {
        const detail =
            typeof body?.error === "string" ? body.error : JSON.stringify(body?.error ?? fallback);
        throw new Error(detail);
    }
    return body;
}

export async function getMe(): Promise<{ user: User }> {
    const res = await fetch("/api/users/me");
    return handle(res, "Failed to load profile");
}

export async function updateMe(data: {
    displayName?: string;
    username?: string;
    bio?: string | null;
    avatarUrl?: string | null;
    email?: string;
}): Promise<{ user: User }> {
    const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handle(res, "Failed to update profile");
}

export async function deleteMe(): Promise<{ deleted: boolean }> {
    const res = await fetch("/api/users/me", { method: "DELETE" });
    return handle(res, "Failed to delete account");
}

export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
}): Promise<{ updated: boolean }> {
    const res = await fetch("/api/users/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handle(res, "Failed to change password");
}

export interface SessionRow {
    id: string;
    device: string | null;
    browser: string | null;
    os: string | null;
    location: string | null;
    lastActiveAt: Date | null;
    expiresAt: Date;
    createdAt: Date;
}

export async function listSessions(): Promise<{ sessions: SessionRow[] }> {
    const res = await fetch("/api/users/me/sessions");
    return handle(res, "Failed to load sessions");
}

export async function revokeSession(sessionId: string): Promise<{ revoked: boolean }> {
    const res = await fetch(`/api/users/me/sessions?sessionId=${sessionId}`, {
        method: "DELETE",
    });
    return handle(res, "Failed to revoke session");
}

export type { SessionData };
