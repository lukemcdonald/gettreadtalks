'use server';

import { cache } from 'react';
import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get topics for filter dropdowns.
 * Wrapped with cache() to ensure it's only called once per request,
 * even if the filter component is rendered multiple times.
 */
export const getTopicsForFilter = cache(async () => {
  const token = await getAuthToken();

  return await fetchQuery(api.topics.listTopics, { limit: 1000 }, { token });
});
