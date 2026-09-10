"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileTab } from "@/features/settings/components/ProfileTab";
import { AccountTab } from "@/features/settings/components/AccountTab";
import { AppearanceTab } from "@/features/settings/components/AppearanceTab";
import { SecurityTab } from "@/features/settings/components/SecurityTab";
import { ListSkeleton } from "@/components/feedback/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { getMe } from "@/lib/api/settings";
import type { User } from "@/types";

type SettingsTab = "profile" | "account" | "appearance" | "security";

const tabs: { id: SettingsTab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "appearance", label: "Appearance" },
  { id: "security", label: "Security" },
];

export default function SettingsPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("profile");

  React.useEffect(() => {
    let cancelled = false;
    getMe()
      .then(({ user }) => {
        if (!cancelled) setUser(user);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Settings</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your account settings</p>
        </div>
        {loading ? (
          <ListSkeleton items={3} />
        ) : error ? (
          <ErrorState title="Failed to load settings" message={error} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-colors ${
                      activeTab === tab.id
                        ? "bg-[var(--color-accent-primary-muted)] text-[var(--color-accent-primary)]"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="lg:col-span-3">
              {activeTab === "profile" && <ProfileTab user={user} onSaved={setUser} />}
              {activeTab === "account" && <AccountTab user={user} onSaved={setUser} />}
              {activeTab === "appearance" && <AppearanceTab />}
              {activeTab === "security" && <SecurityTab />}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
