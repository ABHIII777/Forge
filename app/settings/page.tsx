"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { mockUsers } from "@/mock-data";
import { ProfileTab } from "@/features/settings/components/ProfileTab";
import { AccountTab } from "@/features/settings/components/AccountTab";
import { AppearanceTab } from "@/features/settings/components/AppearanceTab";
import { NotificationsTab } from "@/features/settings/components/NotificationsTab";
import { SecurityTab } from "@/features/settings/components/SecurityTab";

type SettingsTab = "profile" | "account" | "appearance" | "notifications" | "security";

const tabs: { id: SettingsTab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "appearance", label: "Appearance" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
];

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
