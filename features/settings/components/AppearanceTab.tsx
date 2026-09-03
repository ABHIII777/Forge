import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";

interface AppearanceTabProps {
  handleSave: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
}

export function AppearanceTab({ handleSave, isSaving, saveSuccess }: AppearanceTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the look and feel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Theme</label>
          <div className="flex gap-3">
            {["dark", "light", "system"].map((theme) => (
              <button
                key={theme}
                className={`flex-1 p-3 border-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors capitalize ${
                  theme === "dark"
                    ? "bg-[var(--color-bg-tertiary)] border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]"
                    : "bg-[var(--color-bg-tertiary)] border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-secondary)]"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Density</label>
          <div className="flex gap-3">
            {["compact", "comfortable", "spacious"].map((density) => (
              <button
                key={density}
                className="flex-1 p-3 bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-border-secondary)] transition-colors capitalize"
              >
                {density}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Collapsible Sidebar</p>
            <p className="text-xs text-[var(--color-text-muted)]">Allow sidebar to collapse</p>
          </div>
          <Switch defaultChecked />
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
