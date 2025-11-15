'use client';

import type { PreloadedTalks } from '@/lib/features/talks';

import Link from 'next/link';

import { usePaginatedTalks } from '@/lib/features/talks/hooks';

type TalksListProps = {
  preloadedTalks: PreloadedTalks;
};

export function TalksList({ preloadedTalks }: TalksListProps) {
  const { canLoadMore, data: talks, loadMore } = usePaginatedTalks({ preloadedTalks });

  return (
    <div>
      <ul>
        {talks.map((talk) => (
          <li key={talk._id}>
            <Link href={`/talks/${talk.slug}`}>{talk.title}</Link>
          </li>
        ))}
      </ul>
      {canLoadMore && (
        <button onClick={loadMore} type="button">
          Load More
        </button>
      )}
    </div>
  );
}
