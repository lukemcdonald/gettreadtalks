import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { getCurrentUser } from '@/services/auth/server';
import { DeleteAccountForm } from './_components/delete-account-form';
import { EmailForm } from './_components/email-form';
import { PasswordForm } from './_components/password-form';

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-4">
      {/* Email settings */}
      <Card>
        <CardHeader>
          <CardTitle>Email settings</CardTitle>
          <CardDescription>Manage the email address associated with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <EmailForm currentEmail={user?.email ?? ''} />
          </div>
        </CardContent>
      </Card>

      {/* Password settings */}
      <Card>
        <CardHeader>
          <CardTitle>Password settings</CardTitle>
          <CardDescription>Update the password associated with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <PasswordForm />
          </div>
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
