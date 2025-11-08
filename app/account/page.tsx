// app/account/page.tsx

import { MainLayout } from '@/components/main-layout';
import { getUserFavorites } from '@/lib/features/users/server';
import { getCurrentUser } from '@/lib/services/auth/server';

export default async function AccountPage() {
  const user = await getCurrentUser();
  const favorites = await getUserFavorites();

  return (
    <MainLayout>
      <div className="rounded-lg bg-card shadow-xl">
        <div className="border-border border-b px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-3xl text-card-foreground">Account Dashboard</h1>
              <p className="mt-2 text-muted-foreground">Welcome back, {user?.name || 'User'}!</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 font-semibold text-card-foreground text-xl">
                Profile Information
              </h2>
              <div className="rounded-lg bg-muted p-4">
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-medium text-muted-foreground text-sm"
                    >
                      Email
                    </label>
                    <p className="text-card-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-medium text-muted-foreground text-sm"
                    >
                      Name
                    </label>
                    <p className="text-card-foreground">{user?.name}</p>
                  </div>
                  <div>
                    <label
                      htmlFor="userId"
                      className="block font-medium text-muted-foreground text-sm"
                    >
                      User ID
                    </label>
                    <p className="font-mono text-muted-foreground text-sm">{user?._id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 font-semibold text-card-foreground text-xl">Account Status</h2>
              <div className="rounded-lg bg-success/8 p-4 text-success-foreground">
                <p className="font-semibold">Account Active</p>
                <p>Your authentication is working correctly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="rounded-lg bg-card p-6 shadow-lg">
            <h2 className="mb-4 font-semibold text-2xl text-card-foreground">Your Favorites</h2>
            {favorites && (
              <div className="grid gap-4">
                {favorites.talks.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium text-card-foreground text-lg">
                      Favorite Talks ({favorites.talks.length})
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      You have {favorites.talks.length} favorite talks saved.
                    </p>
                  </div>
                )}
                {favorites.clips.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium text-card-foreground text-lg">
                      Favorite Clips ({favorites.clips.length})
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      You have {favorites.clips.length} favorite clips saved.
                    </p>
                  </div>
                )}
                {favorites.speakers.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium text-card-foreground text-lg">
                      Favorite Speakers ({favorites.speakers.length})
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      You have {favorites.speakers.length} favorite speakers saved.
                    </p>
                  </div>
                )}
                {favorites.talks.length === 0 &&
                  favorites.clips.length === 0 &&
                  favorites.speakers.length === 0 && (
                    <p className="text-muted-foreground">
                      No favorites yet. Start exploring talks and clips to build your collection!
                    </p>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
