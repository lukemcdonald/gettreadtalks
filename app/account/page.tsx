// app/account/page.tsx

import { MainLayout } from '@/components/main-layout';
import { getUserFavorites } from '@/lib/features/users/server';
import { getCurrentUser } from '@/lib/services/auth/server';

export default async function AccountPage() {
  const user = await getCurrentUser();
  const favorites = await getUserFavorites();

  return (
    <MainLayout>
      <div className="bg-card shadow-xl rounded-lg">
        <div className="px-6 py-8 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">Account Dashboard</h1>
              <p className="text-muted-foreground mt-2">Welcome back, {user?.name || 'User'}!</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">
                Profile Information
              </h2>
              <div className="bg-muted p-4 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Email
                    </label>
                    <p className="text-card-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Name
                    </label>
                    <p className="text-card-foreground">{user?.name}</p>
                  </div>
                  <div>
                    <label
                      htmlFor="userId"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      User ID
                    </label>
                    <p className="text-muted-foreground font-mono text-sm">{user?._id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Account Status</h2>
              <div className="bg-success/8 text-success-foreground p-4 rounded-lg">
                <p className="font-semibold">Account Active</p>
                <p>Your authentication is working correctly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Your Favorites</h2>
            {favorites && (
              <div className="grid gap-4">
                {favorites.talks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-card-foreground">
                      Favorite Talks ({favorites.talks.length})
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You have {favorites.talks.length} favorite talks saved.
                    </p>
                  </div>
                )}
                {favorites.clips.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-card-foreground">
                      Favorite Clips ({favorites.clips.length})
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You have {favorites.clips.length} favorite clips saved.
                    </p>
                  </div>
                )}
                {favorites.speakers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-card-foreground">
                      Favorite Speakers ({favorites.speakers.length})
                    </h3>
                    <p className="text-sm text-muted-foreground">
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
