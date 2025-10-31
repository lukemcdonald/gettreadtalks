'use client';

import type { PreloadedTalks } from '@/lib/features/talks';

import Link from 'next/link';

import { Button, Heading, Text } from '@/components/ui';
import { usePaginatedTalks } from '@/lib/features/talks';

interface TalksListProps {
  preloadedTalks: PreloadedTalks;
}

export function TalksList({ preloadedTalks }: TalksListProps) {
  const { canLoadMore, data: talks, loadMore } = usePaginatedTalks({ preloadedTalks });

  return (
    <div className="space-y-6">
      <Heading as="h1" size="4xl">
        Talks
      </Heading>
      <ul className="space-y-4">
        {talks.map((talk) => (
          <li key={talk._id}>
            <Link href={`/talks/${talk.slug}`} className="hover:underline">
              <Text size="lg" weight="medium">
                {talk.title}
              </Text>
            </Link>
          </li>
        ))}
      </ul>
      {canLoadMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={loadMore} type="button">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
