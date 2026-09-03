import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { mockUsers } from "@/mock-data";

interface AccountTabProps {
  handleSave: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
}

export function AccountTab({ handleSave, isSaving, saveSuccess }: AccountTabProps) {
  const user = mockUsers[0];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Email" type="email" defaultValue={user.email} />
        <Input label="Username" defaultValue={user.username} />
        <Separator />
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Danger Zone</p>
          <Button variant="danger" size="sm">Delete Account</Button>
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
