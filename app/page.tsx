'use client';

import { Authenticated, Unauthenticated } from 'convex/react';
import Link from 'next/link';

import MainLayout from '@/components/layout/main-layout';
import { useCurrentUser } from '@/lib/features/users/hooks';
import { useTalks } from '@/lib/features/talks';

export default function Home() {
  return (
    <MainLayout>
      <Authenticated>
        <AuthenticatedHomeContent />
      </Authenticated>

      <Unauthenticated>
        <UnauthenticatedHomeContent />
      </Unauthenticated>
    </MainLayout>
  );
}

const AuthenticatedHomeContent = () => {
  const { data: user } = useCurrentUser();
  const { data: talks, canLoadMore, isLoading, loadMore, pageSize } = useTalks({ pageSize: 10 });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover inspiring talks and clips from TREAD Talks
        </p>
      </div>

      <div className="text-center">
        <Link
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          href="/account"
        >
          View Account
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Latest Talks</h2>

        {isLoading ? (
          <div className="text-center py-8">Loading talks...</div>
        ) : (
          <>
            <ul className="flex flex-col gap-4">
              {talks.map((talk) => (
                <li key={talk._id} className="border rounded-lg p-4">
                  <a href={`/talks/${talk.slug}`}>
                    <h3 className="font-semibold">{talk.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{talk.description}</p>
                  </a>
                </li>
              ))}
            </ul>

            {canLoadMore && (
              <div className="text-center mt-6">
                <button
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => loadMore(pageSize)}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const UnauthenticatedHomeContent = () => (
  <div className="text-center space-y-8">
    <div>
      <h1 className="text-4xl font-bold mb-4">Greetings!</h1>
      <Link href="/login">Login</Link>
    </div>
  </div>
);
