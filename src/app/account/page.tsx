import { Card, CardContent, CardHeader, Separator } from '@/components/ui';
import { getUserFavorites } from '@/features/users/queries';
import { getCurrentUser } from '@/services/auth/server';

export default async function AccountPage() {
  const user = await getCurrentUser();
  const favorites = await getUserFavorites();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-3xl text-card-foreground">Account Settings</h1>
          <p className="mt-2 text-muted-foreground">Welcome back, {user?.name || 'User'}!</p>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="px-6 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 font-semibold text-card-foreground text-xl">Profile Information</h2>
            <div className="rounded-lg bg-muted p-4">
              <div className="space-y-3">
                <div>
                  <label
                    className="block font-semibold text-muted-foreground text-sm"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <p className="text-card-foreground">{user?.email}</p>
                </div>
                <div>
                  <label
                    className="block font-semibold text-muted-foreground text-sm"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <p className="text-card-foreground">{user?.name}</p>
                </div>
                <div>
                  <label
                    className="block font-semibold text-muted-foreground text-sm"
                    htmlFor="userId"
                  >
                    User ID
                  </label>
                  <p className="font-mono text-muted-foreground text-sm">{user?._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="px-6 py-8">
        <div className="rounded-lg bg-card p-6 shadow-lg">
          <h2 className="mb-4 font-semibold text-2xl text-card-foreground">Your Favorites</h2>
          {favorites && (
            <div className="grid gap-4">
              {favorites.talks.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold text-card-foreground text-lg">
                    Favorite Talks ({favorites.talks.length})
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    You have {favorites.talks.length} favorite talks saved.
                  </p>
                </div>
              )}
              {favorites.clips.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold text-card-foreground text-lg">
                    Favorite Clips ({favorites.clips.length})
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    You have {favorites.clips.length} favorite clips saved.
                  </p>
                </div>
              )}
              {favorites.speakers.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold text-card-foreground text-lg">
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
    </Card>
  );
}
