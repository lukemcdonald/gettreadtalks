import type { MetadataRoute } from 'next';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';

const BASE_URL = 'https://gettreadtalks.com';

const staticRoutes: MetadataRoute.Sitemap = [
  { priority: 1, url: BASE_URL },
  { changeFrequency: 'weekly', url: `${BASE_URL}/talks` },
  { changeFrequency: 'monthly', url: `${BASE_URL}/speakers` },
  { changeFrequency: 'monthly', url: `${BASE_URL}/collections` },
  { changeFrequency: 'weekly', url: `${BASE_URL}/topics` },
  { changeFrequency: 'weekly', url: `${BASE_URL}/clips` },
  { changeFrequency: 'yearly', url: `${BASE_URL}/about` },
  { changeFrequency: 'yearly', url: `${BASE_URL}/beliefs` },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [talkSlugs, speakers, collectionSlugs, topics, clipSlugs] = await Promise.all([
    fetchQuery(api.talks.listTalkSlugsForSitemap, {}),
    fetchQuery(api.speakers.listAllSpeakersRaw, {}),
    fetchQuery(api.collections.listCollectionSlugsForSitemap, {}),
    fetchQuery(api.topics.listTopics, {}),
    fetchQuery(api.clips.listClipSlugsForSitemap, {}),
  ]);

  const talkEntries: MetadataRoute.Sitemap = talkSlugs.map(
    ({ speakerSlug, talkSlug, updatedAt }) => ({
      changeFrequency: 'weekly',
      lastModified: new Date(updatedAt),
      url: `${BASE_URL}/talks/${speakerSlug}/${talkSlug}`,
    }),
  );

  const speakerEntries: MetadataRoute.Sitemap = speakers.map((speaker) => ({
    changeFrequency: 'monthly',
    lastModified: new Date(speaker.updatedAt ?? speaker._creationTime),
    url: `${BASE_URL}/speakers/${speaker.slug}`,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collectionSlugs.map(({ slug, updatedAt }) => ({
    changeFrequency: 'monthly',
    lastModified: new Date(updatedAt),
    url: `${BASE_URL}/collections/${slug}`,
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(topic.updatedAt ?? topic._creationTime),
    url: `${BASE_URL}/topics/${topic.slug}`,
  }));

  const clipEntries: MetadataRoute.Sitemap = clipSlugs.map(({ slug, updatedAt }) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(updatedAt),
    url: `${BASE_URL}/clips/${slug}`,
  }));

  return [
    ...staticRoutes,
    ...talkEntries,
    ...speakerEntries,
    ...collectionEntries,
    ...topicEntries,
    ...clipEntries,
  ];
}
