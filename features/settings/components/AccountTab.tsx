"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { deleteMe, updateMe } from "@/lib/api/settings";
import type { User } from "@/types";

interface AccountTabProps {
  user: User | null;
  onSaved: (user: User) => void;
}

export function AccountTab({ user, onSaved }: AccountTabProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const emailValue = email ?? user?.email ?? "";

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const { user: updated } = await updateMe({ email: emailValue.trim() });
      onSaved(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save account");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteMe();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Email" type="email" value={emailValue} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        {error && <p className="text-sm text-[var(--color-status-error)]" role="alert">{error}</p>}
        <Separator />
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Danger Zone</p>
          <Button variant="danger" size="sm" onClick={handleDelete} loading={isDeleting}>Delete Account</Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" onClick={handleSave} loading={isSaving}>
          {saveSuccess ? "Saved!" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
