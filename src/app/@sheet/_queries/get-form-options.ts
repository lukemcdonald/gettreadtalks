'use cache: private';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

/**
 * Fetches form options for admin forms (collections, speakers, talks, topics).
 * Cached per-user since fetchAuthQuery reads cookies.
 */
export async function getFormOptions() {
  cacheLife('hours');
  cacheTag('form-options');

  const paginationOpts = {
    cursor: null,
    numItems: 1000,
  };

  const [collectionsResult, speakersResult, talksResult, topicsResult] =
    await Promise.all([
      fetchAuthQuery(api.collections.listAllCollections, { paginationOpts }),
      fetchAuthQuery(api.speakers.listAllSpeakers, { paginationOpts }),
      fetchAuthQuery(api.talks.listAllTalks, { paginationOpts, status: 'all' }),
      fetchAuthQuery(api.topics.listAllTopics, {}),
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
      imageUrl: item.imageUrl,
      lastName: item.lastName,
      role: item.role,
    })),
    talks: talksResult.page.map((item) => ({
      _id: item._id,
      title: item.title,
    })),
    topics: topicsResult.map((item) => ({
      _id: item.topic._id,
      slug: item.topic.slug,
      title: item.topic.title,
    })),
  };
}
