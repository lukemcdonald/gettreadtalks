'use client';

import { useRouter } from 'next/navigation';

import MainLayout from '@/components/layout/main-layout';
import { useAuthUser, useFavorites } from '@/lib/features/users/hooks';
import { routes } from '@/lib/routes';
import { signOut } from '@/lib/services/auth/client';

export function AccountContent() {
  const router = useRouter();
  const { data: user } = useAuthUser();
  const { data: favorites, isLoading: favoritesLoading } = useFavorites();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push(routes.home);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
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
                    <p className="text-gray-900 dark:text-white">{user?.email || 'Loading...'}</p>
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Name
                    </label>
                    <p className="text-gray-900 dark:text-white">{user?.name || 'Loading...'}</p>
                  </div>
                  <div>
                    <label
                      htmlFor="userId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      User ID
                    </label>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                      {user?._id || 'Loading...'}
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
          {favoritesLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <p className="text-gray-500 dark:text-gray-400">Loading favorites...</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </MainLayout>
  );
}
