import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { Badge } from "@/components/ui/Badge";

interface SecurityTabProps {
  handleSave: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
}

export function SecurityTab({ handleSave, isSaving, saveSuccess }: SecurityTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Current Password" type="password" placeholder="Enter current password" />
        <Input label="New Password" type="password" placeholder="Enter new password" />
        <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
        <Separator />
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Active Sessions</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)]">
              <div>
                <p className="text-sm text-[var(--color-text-primary)]">Chrome on macOS</p>
                <p className="text-xs text-[var(--color-text-muted)]">San Francisco, CA</p>
              </div>
              <Badge variant="success" size="sm">Current</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-md)] border-2 border-[var(--color-border-primary)]">
              <div>
                <p className="text-sm text-[var(--color-text-primary)]">Firefox on Windows</p>
                <p className="text-xs text-[var(--color-text-muted)]">New York, NY</p>
              </div>
              <Button variant="ghost" size="sm">Revoke</Button>
            </div>
          </div>
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
