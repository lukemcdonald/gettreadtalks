'use client';

import { useState } from 'react';

import { Authenticated, Unauthenticated } from 'convex/react';
import Link from 'next/link';

import MainLayout from '@/components/layout/main-layout';
import { useTalks } from '@/lib/features/talks';
import { useCurrentUser } from '@/lib/features/users/hooks';

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
  const {
    canLoadMore,
    data: talks,
    isLoading,
    isLoadingMore,
    loadMore,
    pageSize,
  } = useTalks({
    pageSize: 12,
  });

  const [loadMoreMarkers, setLoadMoreMarkers] = useState<number[]>([]);
  const [previousCount, setPreviousCount] = useState(0);

  const handleLoadMore = () => {
    // Mark current position before loading
    setLoadMoreMarkers((prev) => [...prev, talks.length]);
    setPreviousCount(talks.length);
    loadMore(pageSize);
  };

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
          <div>Loading talks...</div>
        ) : (
          <>
            <ul>
              {talks.map((talk, index) => (
                <li key={talk._id}>
                  {/* Show divider at load points */}
                  {loadMoreMarkers.includes(index) && (
                    <div className="my-6">
                      <span className="text-sm">Loaded {pageSize} more</span>
                    </div>
                  )}

                  {/* Animate newly loaded items */}
                  <div
                    className={`
                      transition-all duration-500
                      ${index >= previousCount && previousCount > 0 ? 'animate-fade-in-up' : ''}
                    `}
                  >
                    <a href={`/talks/${talk.slug}`}>{talk.title}</a>
                  </div>
                </li>
              ))}
            </ul>

            {/* Show loading state while fetching more */}
            {isLoadingMore && <p>Loading more talks...</p>}

            {canLoadMore && !isLoadingMore && (
              <div className="text-center mt-6">
                <button
                  type="button"
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleLoadMore}
                >
                  Load {pageSize} More
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
