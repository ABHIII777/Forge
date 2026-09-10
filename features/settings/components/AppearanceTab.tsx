"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { useAppearance, type DensityChoice, type ThemeChoice } from "@/hooks/useAppearance";
import { cn } from "@/lib/utils";

const themes: ThemeChoice[] = ["dark", "light", "system"];
const densities: DensityChoice[] = ["compact", "comfortable", "spacious"];

export function AppearanceTab() {
  const { theme, density, setTheme, setDensity } = useAppearance();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the look and feel — saved automatically on this device</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Theme</label>
          <div className="flex gap-3">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
                className={cn(
                  "flex-1 p-3 border-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors capitalize bg-[var(--color-bg-tertiary)]",
                  theme === t
                    ? "border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]"
                    : "border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-secondary)]",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Density</label>
          <div className="flex gap-3">
            {densities.map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                aria-pressed={density === d}
                className={cn(
                  "flex-1 p-3 border-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors capitalize bg-[var(--color-bg-tertiary)]",
                  density === d
                    ? "border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]"
                    : "border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-secondary)]",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
