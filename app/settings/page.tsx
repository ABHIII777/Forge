"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Separator } from "@/components/ui/Separator";
import { Badge } from "@/components/ui/Badge";
import { AppShell } from "@/components/layout/AppShell";
import { mockUsers } from "@/mock-data";

type SettingsTab = "profile" | "account" | "appearance" | "notifications" | "security";

const tabs: { id: SettingsTab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "appearance", label: "Appearance" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
];

import type { User } from "@/types";

function ProfileTab({ user, handleSave, isSaving, saveSuccess }: { user: User; handleSave: () => void; isSaving: boolean; saveSuccess: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your personal information</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <Input label="Display Name" defaultValue={user.displayName} />
        <Input label="Username" defaultValue={user.username} hint="This is your unique identifier" />
        <Textarea label="Bio" defaultValue={user.bio || ""} rows={3} />
        <Input label="Email" type="email" defaultValue={user.email} />
      </CardContent>
      <CardFooter>
        <Button variant="primary" onClick={handleSave} loading={isSaving}>{saveSuccess ? "Saved!" : "Save Changes"}</Button>
      </CardFooter>
    </Card>
  );
}

function AccountTab({ handleSave, isSaving, saveSuccess }: { handleSave: () => void; isSaving: boolean; saveSuccess: boolean }) {
  const user = mockUsers[0];
  return (
    <Card>
      <CardHeader><CardTitle>Account</CardTitle><CardDescription>Manage your account settings</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <Input label="Email" type="email" defaultValue={user.email} />
        <Input label="Username" defaultValue={user.username} />
        <Separator />
        <div><p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Danger Zone</p><Button variant="danger" size="sm">Delete Account</Button></div>
      </CardContent>
      <CardFooter><Button variant="primary" onClick={handleSave} loading={isSaving}>{saveSuccess ? "Saved!" : "Save Changes"}</Button></CardFooter>
    </Card>
  );
}

function AppearanceTab({ handleSave, isSaving, saveSuccess }: { handleSave: () => void; isSaving: boolean; saveSuccess: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Customize the look and feel</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Theme</label>
          <div className="flex gap-3">
            {["dark", "light", "system"].map((theme) => (
              <button key={theme} className={`flex-1 p-3 border-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors capitalize ${theme === "dark" ? "bg-[var(--color-bg-tertiary)] border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]" : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-secondary)]"}`}>{theme}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Density</label>
          <div className="flex gap-3">
            {["compact", "comfortable", "spacious"].map((density) => (
              <button key={density} className="flex-1 p-3 bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-border-secondary)] transition-colors capitalize">{density}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium text-[var(--color-text-primary)]">Collapsible Sidebar</p><p className="text-xs text-[var(--color-text-muted)]">Allow sidebar to collapse</p></div>
          <Switch defaultChecked />
        </div>
      </CardContent>
      <CardFooter><Button variant="primary" onClick={handleSave} loading={isSaving}>{saveSuccess ? "Saved!" : "Save Changes"}</Button></CardFooter>
    </Card>
  );
}

function NotificationsTab({ handleSave, isSaving, saveSuccess }: { handleSave: () => void; isSaving: boolean; saveSuccess: boolean }) {
  const items = [
    { label: "Email Notifications", description: "Receive notifications via email" },
    { label: "Push Notifications", description: "Receive push notifications in browser" },
    { label: "Mentions", description: "When someone mentions you" },
    { label: "Assignments", description: "When an issue is assigned to you" },
    { label: "Comments", description: "When someone comments on your issues" },
    { label: "Workspace Activity", description: "General workspace updates" },
  ];
  return (
    <Card>
      <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Configure notification preferences</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-[var(--color-text-primary)]">{item.label}</p><p className="text-xs text-[var(--color-text-muted)]">{item.description}</p></div>
            <Switch defaultChecked />
          </div>
        ))}
      </CardContent>
      <CardFooter><Button variant="primary" onClick={handleSave} loading={isSaving}>{saveSuccess ? "Saved!" : "Save Changes"}</Button></CardFooter>
    </Card>
  );
}

function SecurityTab({ handleSave, isSaving, saveSuccess }: { handleSave: () => void; isSaving: boolean; saveSuccess: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle>Security</CardTitle><CardDescription>Manage your security settings</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <Input label="Current Password" type="password" placeholder="Enter current password" />
        <Input label="New Password" type="password" placeholder="Enter new password" />
        <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
        <Separator />
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Active Sessions</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)]">
              <div><p className="text-sm text-[var(--color-text-primary)]">Chrome on macOS</p><p className="text-xs text-[var(--color-text-muted)]">San Francisco, CA</p></div>
              <Badge variant="success" size="sm">Current</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)]">
              <div><p className="text-sm text-[var(--color-text-primary)]">Firefox on Windows</p><p className="text-xs text-[var(--color-text-muted)]">New York, NY</p></div>
              <Button variant="ghost" size="sm">Revoke</Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter><Button variant="primary" onClick={handleSave} loading={isSaving}>{saveSuccess ? "Saved!" : "Save Changes"}</Button></CardFooter>
    </Card>
  );
}

export default function SettingsPage() {
  const user = mockUsers[0];
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("profile");
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Settings</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your account settings</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-colors ${activeTab === tab.id ? "bg-[var(--color-accent-primary-muted)] text-[var(--color-accent-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"}`}>{tab.label}</button>
              ))}
            </nav>
          </div>
          <div className="lg:col-span-3">
            {activeTab === "profile" && <ProfileTab user={user} handleSave={handleSave} isSaving={isSaving} saveSuccess={saveSuccess} />}
            {activeTab === "account" && <AccountTab handleSave={handleSave} isSaving={isSaving} saveSuccess={saveSuccess} />}
            {activeTab === "appearance" && <AppearanceTab handleSave={handleSave} isSaving={isSaving} saveSuccess={saveSuccess} />}
            {activeTab === "notifications" && <NotificationsTab handleSave={handleSave} isSaving={isSaving} saveSuccess={saveSuccess} />}
            {activeTab === "security" && <SecurityTab handleSave={handleSave} isSaving={isSaving} saveSuccess={saveSuccess} />}
          </div>
        </div>
      </div>
    </AppShell>
  );
}