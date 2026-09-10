"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { updateMe } from "@/lib/api/settings";
import type { User } from "@/types";

interface ProfileTabProps {
  user: User | null;
  onSaved: (user: User) => void;
}

export function ProfileTab({ user, onSaved }: ProfileTabProps) {
  const [displayName, setDisplayName] = React.useState<string | undefined>(undefined);
  const [username, setUsername] = React.useState<string | undefined>(undefined);
  const [bio, setBio] = React.useState<string | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const displayNameValue = displayName ?? user?.displayName ?? "";
  const usernameValue = username ?? user?.username ?? "";
  const bioValue = bio ?? user?.bio ?? "";
  const avatarUrlValue = avatarUrl ?? user?.avatarUrl ?? "";

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const { user: updated } = await updateMe({
        displayName: displayNameValue.trim(),
        username: usernameValue.trim(),
        bio: bioValue.trim() === "" ? null : bioValue.trim(),
        avatarUrl: avatarUrlValue.trim() === "" ? null : avatarUrlValue.trim(),
      });
      onSaved(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Display Name" value={displayNameValue} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your display name" />
        <Input label="Username" value={usernameValue} onChange={(e) => setUsername(e.target.value)} placeholder="username" hint="Letters, numbers, and underscores only" />
        <Textarea label="Bio" value={bioValue} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell us about yourself" />
        <Input label="Avatar URL" value={avatarUrlValue} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" />
        {error && <p className="text-sm text-[var(--color-status-error)]" role="alert">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button variant="primary" onClick={handleSave} loading={isSaving}>
          {saveSuccess ? "Saved!" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
