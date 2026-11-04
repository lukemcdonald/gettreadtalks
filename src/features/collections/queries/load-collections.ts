'use cache';

import type { CollectionSortOption } from '@/convex/lib/sort';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { getCollectionComparator } from '@/convex/lib/sort';
import { sortSpeakersByName } from '@/features/speakers/utils';
import { loadAllPages } from '@/lib/load-all-pages';

interface GetCollectionsProps {
  limit?: number;
  sort?: string;
  speakerSlug?: string;
}

export async function loadCollections(args?: GetCollectionsProps) {
  cacheLife('hours');
  cacheTag('collections');

  const { limit, sort, speakerSlug } = args ?? {};

  const numItems = limit ?? 1000;
  const listPage = (cursor: string | null) =>
    fetchQuery(api.collections.listCollections, {
      paginationOpts: {
        cursor,
        numItems,
      },
    });
  const result =
    limit === undefined ? await loadAllPages(listPage) : await listPage(null);

  const allCollections = result.page;

  const filtered = speakerSlug
    ? allCollections.filter((item) =>
        item.speakers.some((s) => s.slug === speakerSlug)
      )
    : allCollections;

  const collections = filtered.toSorted(
    getCollectionComparator(sort as CollectionSortOption)
  );

  const speakersMap = new Map(
    allCollections.flatMap((item) => item.speakers.map((s) => [s.slug, s]))
  );
  const speakers = sortSpeakersByName([...speakersMap.values()]);

  return {
    collections,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    speakers,
  };
}
