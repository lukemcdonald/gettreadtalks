'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

/** Whether published talks use enough formats to show the public filter. */
export async function loadTalkFormatFilter() {
  cacheLife('hours');
  cacheTag('talks');

  return await fetchQuery(api.talks.getTalkFormatFilter, {});
}
