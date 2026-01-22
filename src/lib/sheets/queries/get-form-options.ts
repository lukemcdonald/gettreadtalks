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
    speakers: speakersResult.page.map((s) => ({
      _id: s._id,
      firstName: s.firstName,
      lastName: s.lastName,
      imageUrl: s.imageUrl,
      role: s.role,
    })),
    collections: collectionsResult.page.map((item) => ({
      _id: item.collection._id,
      slug: item.collection.slug,
      title: item.collection.title,
    })),
    talks: talksResult.page.map((t) => ({
      _id: t._id,
      title: t.title,
    })),
  };
}
