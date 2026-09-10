"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { EmptyState } from "@/components/feedback/EmptyState";
import { changePassword, listSessions, revokeSession, type SessionRow } from "@/lib/api/settings";
import { formatRelativeTime } from "@/lib/utils";

export function SecurityTab() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const [sessions, setSessions] = React.useState<SessionRow[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(true);
  const [revoking, setRevoking] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    listSessions()
      .then(({ sessions }) => {
        if (!cancelled) setSessions(sessions);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!cancelled) setSessionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePasswordChange = async () => {
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setIsSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevoke = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      await revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke session");
    } finally {
      setRevoking(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
        <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password (min 8 characters)" />
        <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
        {error && <p className="text-sm text-[var(--color-status-error)]" role="alert">{error}</p>}
        <Separator />
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Active Sessions</p>
          {sessionsLoading ? (
            <p className="text-sm text-[var(--color-text-muted)]">Loading sessions…</p>
          ) : sessions.length === 0 ? (
            <EmptyState title="No active sessions" description="Sessions created at login will appear here." icon="projects" />
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)]">
                  <div>
                    <p className="text-sm text-[var(--color-text-primary)]">
                      {[s.browser, s.os].filter(Boolean).join(" on ") || s.device || "Unknown device"}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {[s.location, s.lastActiveAt ? `active ${formatRelativeTime(s.lastActiveAt)}` : null].filter(Boolean).join(" · ") || "No activity recorded"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRevoke(s.id)} loading={revoking === s.id}>Revoke</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" onClick={handlePasswordChange} loading={isSaving}>
          {saveSuccess ? "Saved!" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
