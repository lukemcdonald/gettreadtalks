import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/components/ui';
import { DeleteAccountForm } from '@/features/users/components/delete-account-form';
import { EmailForm } from '@/features/users/components/email-form';
import { PasswordForm } from '@/features/users/components/password-form';
import { ProfileForm } from '@/features/users/components/profile-form';
import { getCurrentUser } from '@/services/auth/server';

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-4">
      {/* Profile + Email + Password settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile settings</CardTitle>
          <CardDescription>Update the name and email associated with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm currentName={user?.name ?? ''} />
        </CardContent>

        <Separator />

        <CardHeader>
          <CardTitle>Email settings</CardTitle>
          <CardDescription>Manage the email address associated with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailForm currentEmail={user?.email ?? ''} />
        </CardContent>

        <Separator />

        <CardHeader>
          <CardTitle>Password settings</CardTitle>
          <CardDescription>Update the password associated with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      {/* Delete account */}
      <Card>
        <CardHeader>
          <CardTitle>Delete your account</CardTitle>
          <CardDescription>
            Once you delete your account, you will lose all data associated with it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountForm />
        </CardContent>
      </Card>
    </div>
  );
}
