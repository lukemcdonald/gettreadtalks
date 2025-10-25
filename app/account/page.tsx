// app/account/page.tsx

import MainLayout from '@/components/layout/main-layout';
import { getUserFavorites } from '@/lib/features/users/server';
import { getAuthUser } from '@/lib/services/auth/server';

export default async function AccountPage() {
  const user = await getAuthUser();
  const favorites = await getUserFavorites();

  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg">
        <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Account Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Welcome back, {user?.name || 'User'}!
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Profile Information
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white">{user?.email}</p>
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Name
                    </label>
                    <p className="text-gray-900 dark:text-white">{user?.name}</p>
                  </div>
                  <div>
                    <label
                      htmlFor="userId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      User ID
                    </label>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                      {user?._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Account Status
              </h2>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <p className="font-semibold">Account Active</p>
                <p>Your authentication is working correctly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Your Favorites
            </h2>
            {favorites && (
              <div className="grid gap-4">
                {favorites.talks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Favorite Talks ({favorites.talks.length})
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You have {favorites.talks.length} favorite talks saved.
                    </p>
                  </div>
                )}
                {favorites.clips.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Favorite Clips ({favorites.clips.length})
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You have {favorites.clips.length} favorite clips saved.
                    </p>
                  </div>
                )}
                {favorites.speakers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Favorite Speakers ({favorites.speakers.length})
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You have {favorites.speakers.length} favorite speakers saved.
                    </p>
                  </div>
                )}
                {favorites.talks.length === 0 &&
                  favorites.clips.length === 0 &&
                  favorites.speakers.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400">
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
