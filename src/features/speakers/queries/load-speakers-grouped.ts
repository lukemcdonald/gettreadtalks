'use server';

import { PUBLIC_LISTING_PAGE_SIZE } from '@/constants/ui';
import { loadSpeakers } from '@/features/speakers/queries/load-speakers';
import { groupSpeakersByLastName } from '@/features/speakers/utils';

interface GetSpeakersGroupedProps {
  cursor?: string;
  limit?: number;
  role?: string;
  search?: string;
  sort?: string;
}

/**
 * Get one page of speakers grouped alphabetically by last name.
 */
export async function loadSpeakersGrouped(args?: GetSpeakersGroupedProps) {
  const {
    cursor,
    limit = PUBLIC_LISTING_PAGE_SIZE,
    role,
    search,
    sort,
  } = args ?? {};
  const { continueCursor, isDone, speakers } = await loadSpeakers({
    cursor,
    limit,
    role,
    search,
    sort,
  });

  return {
    continueCursor,
    groups: groupSpeakersByLastName(speakers),
    isDone,
  };
}
