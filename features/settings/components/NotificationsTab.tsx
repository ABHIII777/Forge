import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";

interface NotificationsTabProps {
  handleSave: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
}

const notificationItems = [
  { label: "Email Notifications", description: "Receive notifications via email" },
  { label: "Push Notifications", description: "Receive push notifications in browser" },
  { label: "Mentions", description: "When someone mentions you" },
  { label: "Assignments", description: "When an issue is assigned to you" },
  { label: "Comments", description: "When someone comments on your issues" },
  { label: "Workspace Activity", description: "General workspace updates" },
];

export function NotificationsTab({ handleSave, isSaving, saveSuccess }: NotificationsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Configure notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.label}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{item.description}</p>
            </div>
            <Switch defaultChecked />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="primary" onClick={handleSave} loading={isSaving}>
          {saveSuccess ? "Saved!" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
