import type { MetadataRoute } from 'next';

import { fetchQuery } from 'convex/nextjs';

import { SITE_URL } from '@/constants/env';
import { api } from '@/convex/_generated/api';

const staticRoutes: MetadataRoute.Sitemap = [
  { priority: 1, url: SITE_URL },
  { changeFrequency: 'weekly', url: `${SITE_URL}/talks` },
  { changeFrequency: 'monthly', url: `${SITE_URL}/speakers` },
  { changeFrequency: 'monthly', url: `${SITE_URL}/collections` },
  { changeFrequency: 'weekly', url: `${SITE_URL}/topics` },
  { changeFrequency: 'weekly', url: `${SITE_URL}/clips` },
  { changeFrequency: 'yearly', url: `${SITE_URL}/about` },
  { changeFrequency: 'yearly', url: `${SITE_URL}/beliefs` },
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
      url: `${SITE_URL}/talks/${speakerSlug}/${talkSlug}`,
    }),
  );

  const speakerEntries: MetadataRoute.Sitemap = speakers.map((speaker) => ({
    changeFrequency: 'monthly',
    lastModified: new Date(speaker.updatedAt ?? speaker._creationTime),
    url: `${SITE_URL}/speakers/${speaker.slug}`,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collectionSlugs.map(({ slug, updatedAt }) => ({
    changeFrequency: 'monthly',
    lastModified: new Date(updatedAt),
    url: `${SITE_URL}/collections/${slug}`,
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(topic.updatedAt ?? topic._creationTime),
    url: `${SITE_URL}/topics/${topic.slug}`,
  }));

  const clipEntries: MetadataRoute.Sitemap = clipSlugs.map(({ slug, updatedAt }) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(updatedAt),
    url: `${SITE_URL}/clips/${slug}`,
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
