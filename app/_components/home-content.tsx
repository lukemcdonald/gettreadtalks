'use client';

import { useState } from 'react';

import {
  Authenticated,
  type Preloaded,
  Unauthenticated,
  usePaginatedQuery,
  usePreloadedQuery,
} from 'convex/react';
import Link from 'next/link';

import { api } from '@/convex/_generated/api';
import { useCurrentUser } from '@/lib/features/users/hooks';

type HomeContentProps = {
  preloadedTalks: Preloaded<typeof api.talks.listTalks>;
};

export function HomeContent({ preloadedTalks }: HomeContentProps) {
  return (
    <>
      <Authenticated>
        <AuthenticatedHomeContent preloadedTalks={preloadedTalks} />
      </Authenticated>

      <Unauthenticated>
        <UnauthenticatedHomeContent />
      </Unauthenticated>
    </>
  );
}

const AuthenticatedHomeContent = ({
  preloadedTalks,
}: {
  preloadedTalks: Preloaded<typeof api.talks.listTalks>;
}) => {
  const { data: user } = useCurrentUser();

  // Use preloaded data for initial render
  const initialTalksResult = usePreloadedQuery(preloadedTalks);
  const initialTalks = initialTalksResult?.page ?? [];

  // Use a separate paginated query for load more functionality
  // This will start fresh and we'll handle the transition
  const { loadMore, results, status } = usePaginatedQuery(
    api.talks.listTalks,
    {},
    { initialNumItems: 12 },
  );

  const canLoadMore = status === 'CanLoadMore';
  const isLoadingMore = status === 'LoadingMore';
  const pageSize = 12;

  // Use either preloaded data (no loading states) or paginated results (with loading states)
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const talks = hasLoadedMore ? (results ?? []) : initialTalks;

  const [loadMoreMarkers, setLoadMoreMarkers] = useState<number[]>([]);
  const [previousCount, setPreviousCount] = useState(0);

  const handleLoadMore = () => {
    // Mark current position before loading
    setLoadMoreMarkers((prev) => [...prev, talks.length]);
    setPreviousCount(talks.length);
    setHasLoadedMore(true); // Switch to using the paginated query results
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

        {/* No loading state needed since we have preloaded data */}
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
                <Link href={`/talks/${talk.slug}`}>{talk.title}</Link>
              </div>
            </li>
          ))}
        </ul>

        {/* Show loading state while fetching more */}
        {isLoadingMore && <p>Loading more talks...</p>}

        {(canLoadMore || (!hasLoadedMore && initialTalksResult && !initialTalksResult.isDone)) &&
          !isLoadingMore && (
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
