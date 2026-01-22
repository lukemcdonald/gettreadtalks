'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getFormOptions() {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: 1000,
  };

  const [speakersResult, collectionsResult, talksResult] = await Promise.all([
    fetchQuery(api.speakers.listAllSpeakers, { paginationOpts }, { token }),
    fetchQuery(api.collections.listAllCollections, { paginationOpts }, { token }),
    fetchQuery(api.talks.listAllTalks, { paginationOpts, status: 'all' }, { token }),
  ]);

  return {
    speakers: speakersResult.page,
    collections: collectionsResult.page.map((item) => item.collection),
    talks: talksResult.page,
  };
}
