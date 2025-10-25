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

const PAGE_SIZE = 12;

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
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  // Use preloaded data initially
  const initialData = usePreloadedQuery(preloadedTalks);

  // Paginated query for "Load More" functionality
  const { loadMore, results, status } = usePaginatedQuery(
    api.talks.listTalks,
    {},
    { initialNumItems: PAGE_SIZE },
  );

  // Switch to paginated results after first load more
  const talks = hasLoadedMore ? results : initialData?.page;
  const canLoadMore = hasLoadedMore ? status === 'CanLoadMore' : !initialData?.isDone;

  const handleLoadMore = () => {
    setHasLoadedMore(true);
    loadMore(PAGE_SIZE);
  };

  return (
    <div>
      <ul>
        {talks?.map((talk) => (
          <li key={talk._id}>
            <Link href={`/talks/${talk.slug}`}>{talk.title}</Link>
          </li>
        ))}
      </ul>
      <hr />
      {canLoadMore && (
        <button type="button" onClick={handleLoadMore}>
          Load More
        </button>
      )}
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
