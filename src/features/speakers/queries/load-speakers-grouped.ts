'use server';

import { loadSpeakers } from '@/features/speakers/queries/load-speakers';
import { groupSpeakersByLastName } from '@/features/speakers/utils';

interface GetSpeakersGroupedProps {
  limit?: number;
  role?: string;
  search?: string;
  sort?: string;
}

/**
 * Get speakers grouped alphabetically by last name.
 */
export async function loadSpeakersGrouped(args?: GetSpeakersGroupedProps) {
  const { limit, role, search, sort } = args ?? {};
  const { speakers } = await loadSpeakers({
    limit,
    role,
    search,
    sort,
  });

  return groupSpeakersByLastName(speakers);
}
