import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { User } from "@/types";

interface ProfileTabProps {
  user: User;
  handleSave: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
}

export function ProfileTab({ user, handleSave, isSaving, saveSuccess }: ProfileTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Display Name" defaultValue={user.displayName} />
        <Input label="Username" defaultValue={user.username} hint="This is your unique identifier" />
        <Textarea label="Bio" defaultValue={user.bio || ""} rows={3} />
        <Input label="Email" type="email" defaultValue={user.email} />
      </CardContent>
      <CardFooter>
        <Button variant="primary" onClick={handleSave} loading={isSaving}>
          {saveSuccess ? "Saved!" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
