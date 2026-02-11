import { Badge, Card, CardContent, CardHeader, Separator } from '@/components/ui';
import { getUserFavorites } from '@/features/users/queries/get-user-favorites';
import { getUserFinishedTalks } from '@/features/users/queries/get-user-finished-talks';
import { getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';
import { DeleteAccountForm } from './_components/delete-account-form';
import { PasswordForm } from './_components/password-form';
import { ProfileForm } from './_components/profile-form';

export default async function AccountPage() {
  const [user, favorites, finished] = await Promise.all([
    getCurrentUser(),
    getUserFavorites(),
    getUserFinishedTalks(),
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-3xl text-card-foreground">Account Settings</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'User'}!</p>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="px-6 py-8">
        <div className="space-y-10">
          {/* Profile Information */}
          <section>
            <h2 className="mb-4 font-semibold text-card-foreground text-xl">Profile Information</h2>
            <div className="rounded-lg bg-muted p-4">
              <dl className="space-y-3">
                <div>
                  <dt className="font-semibold text-muted-foreground text-sm">Name</dt>
                  <dd className="text-card-foreground">{user?.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted-foreground text-sm">Email</dt>
                  <dd className="text-card-foreground">{user?.email}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted-foreground text-sm">Role</dt>
                  <dd>
                    <Badge variant={isAdmin(user) ? 'default' : 'outline'}>
                      {isAdmin(user) ? 'Admin' : 'User'}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted-foreground text-sm">User ID</dt>
                  <dd className="font-mono text-muted-foreground text-sm">{user?._id}</dd>
                </div>
              </dl>
            </div>
          </section>

          <Separator />

          {/* Update Profile */}
          <section>
            <h2 className="mb-4 font-semibold text-card-foreground text-xl">Update Profile</h2>
            <div className="max-w-sm">
              <ProfileForm currentEmail={user?.email ?? ''} currentName={user?.name ?? ''} />
            </div>
          </section>

          <Separator />

          {/* Change Password */}
          <section>
            <h2 className="mb-4 font-semibold text-card-foreground text-xl">Change Password</h2>
            <div className="max-w-sm">
              <PasswordForm />
            </div>
          </section>

          <Separator />

          {/* Activity */}
          <section>
            <h2 className="mb-4 font-semibold text-card-foreground text-xl">Activity</h2>
            <div className="rounded-lg bg-muted p-4">
              <dl className="space-y-3">
                <div>
                  <dt className="font-semibold text-muted-foreground text-sm">Favorites</dt>
                  <dd className="text-card-foreground text-sm">
                    {favorites?.talks.length ?? 0} talks &middot; {favorites?.clips.length ?? 0}{' '}
                    clips &middot; {favorites?.speakers.length ?? 0} speakers
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted-foreground text-sm">Finished</dt>
                  <dd className="text-card-foreground text-sm">{finished.talks.length} talks</dd>
                </div>
              </dl>
            </div>
          </section>

          <Separator />

          {/* Danger Zone */}
          <section>
            <h2 className="mb-4 font-semibold text-destructive text-xl">Danger Zone</h2>
            <div className="rounded-lg border border-destructive/32 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-card-foreground text-sm">Delete Account</p>
                  <p className="text-muted-foreground text-sm">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <DeleteAccountForm />
              </div>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
