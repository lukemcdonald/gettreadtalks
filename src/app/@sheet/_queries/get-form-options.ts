import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

/**
 * Fetches form options for admin forms (collections, speakers, talks).
 * Cached per-user with 'use cache: private' since fetchAuthQuery reads cookies.
 */
export async function getFormOptions() {
  'use cache: private';
  cacheLife('hours');
  cacheTag('form-options');

  const paginationOpts = {
    cursor: null,
    numItems: 1000,
  };

  const [collectionsResult, speakersResult, talksResult] = await Promise.all([
    fetchAuthQuery(api.collections.listAllCollections, { paginationOpts }),
    fetchAuthQuery(api.speakers.listAllSpeakers, { paginationOpts }),
    fetchAuthQuery(api.talks.listAllTalks, { paginationOpts, status: 'all' }),
  ]);

  return {
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
