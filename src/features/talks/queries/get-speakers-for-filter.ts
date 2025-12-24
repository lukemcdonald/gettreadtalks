'use server';

import { cache } from 'react';
import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get speakers for filter dropdowns.
 * Wrapped with cache() to ensure it's only called once per request,
 * even if the filter component is rendered multiple times.
 */
export const getSpeakersForFilter = cache(async () => {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: 1000,
  };

  const result = await fetchQuery(api.speakers.listSpeakers, { paginationOpts }, { token });

  return result.page;
});
