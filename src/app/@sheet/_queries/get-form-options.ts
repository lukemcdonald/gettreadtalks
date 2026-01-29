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

  const [collectionsResult, speakersResult, talksResult] = await Promise.all([
    // TODO: Should these use fetchAuthQuery instead of fetchQuery with a token?
    fetchQuery(api.collections.listAllCollections, { paginationOpts }, { token }),
    fetchQuery(api.speakers.listAllSpeakers, { paginationOpts }, { token }),
    fetchQuery(api.talks.listAllTalks, { paginationOpts, status: 'all' }, { token }),
  ]);

  // TODO: What is teh benefit of returning partial speaker, collection, or talk that we need to map over these and return a subset of properties?
  return {
    // TODO: Why do collections have a collection property on item but speakers and talks do not?
    collections: collectionsResult.page.map((item) => ({
      _id: item.collection._id,
      slug: item.collection.slug,
      title: item.collection.title,
    })),
    speakers: speakersResult.page.map((item) => ({
      _id: item._id,
      firstName: item.firstName,
      lastName: item.lastName,
      imageUrl: item.imageUrl,
      role: item.role,
    })),
    talks: talksResult.page.map((item) => ({
      _id: item._id,
      title: item.title,
    })),
  };
}
