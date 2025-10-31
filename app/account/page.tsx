import MainLayout from '@/components/layout/main-layout';
import { Badge, Card, CardHeader, Heading, Text } from '@/components/ui';
import { getUserFavorites } from '@/lib/features/users/server';
import { getAuthUser } from '@/lib/services/auth/server';

export default async function AccountPage() {
  const user = await getAuthUser();
  const favorites = await getUserFavorites();

  return (
    <MainLayout>
      <div className="space-y-6">
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <Heading as="h1" size="4xl">
              Account Dashboard
            </Heading>
            <Text size="lg" color="neutral" className="mt-2">
              Welcome back, {user?.name || 'User'}!
            </Text>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card variant="outlined" padding="lg">
            <div className="space-y-4">
              <Heading as="h2" size="2xl">
                Profile Information
              </Heading>
              <div className="space-y-3 rounded-lg bg-base-200 p-4">
                <div>
                  <Text as="label" size="sm" weight="medium" color="neutral">
                    Email
                  </Text>
                  <Text>{user?.email}</Text>
                </div>
                <div>
                  <Text as="label" size="sm" weight="medium" color="neutral">
                    Name
                  </Text>
                  <Text>{user?.name}</Text>
                </div>
                <div>
                  <Text as="label" size="sm" weight="medium" color="neutral">
                    User ID
                  </Text>
                  <Text size="sm" className="font-mono">
                    {user?._id}
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="outlined" padding="lg">
            <div className="space-y-4">
              <Heading as="h2" size="2xl">
                Account Status
              </Heading>
              <div className="space-y-2 rounded-lg bg-success/10 p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Active</Badge>
                </div>
                <Text size="sm">Your authentication is working correctly</Text>
              </div>
            </div>
          </Card>
        </div>

        <Card variant="elevated" padding="lg">
          <div className="space-y-4">
            <Heading as="h2" size="3xl">
              Your Favorites
            </Heading>
            {favorites && (
              <div className="grid gap-4">
                {favorites.talks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heading as="h3" size="xl">
                        Favorite Talks
                      </Heading>
                      <Badge variant="neutral" size="sm">
                        {favorites.talks.length}
                      </Badge>
                    </div>
                    <Text size="sm" color="neutral">
                      You have {favorites.talks.length} favorite talks saved.
                    </Text>
                  </div>
                )}
                {favorites.clips.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heading as="h3" size="xl">
                        Favorite Clips
                      </Heading>
                      <Badge variant="neutral" size="sm">
                        {favorites.clips.length}
                      </Badge>
                    </div>
                    <Text size="sm" color="neutral">
                      You have {favorites.clips.length} favorite clips saved.
                    </Text>
                  </div>
                )}
                {favorites.speakers.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heading as="h3" size="xl">
                        Favorite Speakers
                      </Heading>
                      <Badge variant="neutral" size="sm">
                        {favorites.speakers.length}
                      </Badge>
                    </div>
                    <Text size="sm" color="neutral">
                      You have {favorites.speakers.length} favorite speakers saved.
                    </Text>
                  </div>
                )}
                {favorites.talks.length === 0 &&
                  favorites.clips.length === 0 &&
                  favorites.speakers.length === 0 && (
                    <Text color="neutral">
                      No favorites yet. Start exploring talks and clips to build your collection!
                    </Text>
                  )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
