'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { PUBLIC_LISTING_PAGE_SIZE } from '@/constants/ui';
import { api } from '@/convex/_generated/api';
import { loadFullPage } from '@/convex/lib/utils';

interface GetClipsProps {
  cursor?: string;
  limit?: number;
  search?: string;
  speakerSlugs?: string[];
}

/**
 * Get published clips with speakers.
 * Returns published clips with no parent talk, or a published parent talk.
 * Defaults to one public listing page, sorted by most recent.
 */
export async function loadClips(args?: GetClipsProps) {
  cacheLife('hours');
  cacheTag('clips');

  const {
    cursor,
    limit = PUBLIC_LISTING_PAGE_SIZE,
    search,
    speakerSlugs,
  } = args ?? {};
  const result = await loadFullPage(
    (paginationOpts) =>
      fetchQuery(api.clips.listClips, {
        paginationOpts,
        search,
        sort: 'recent',
        speakerSlugs,
      }),
    (clips) => clips,
    {
      cursor: cursor ?? null,
      numItems: limit,
    }
  );

  return {
    clips: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
