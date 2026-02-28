import type { MetadataRoute } from 'next';

import { fetchQuery } from 'convex/nextjs';

import { site } from '@/configs/site';
import { api } from '@/convex/_generated/api';

const staticRoutes: MetadataRoute.Sitemap = [
  { priority: 1, url: site.url },
  { changeFrequency: 'weekly', url: `${site.url}/talks` },
  { changeFrequency: 'monthly', url: `${site.url}/speakers` },
  { changeFrequency: 'monthly', url: `${site.url}/collections` },
  { changeFrequency: 'weekly', url: `${site.url}/topics` },
  { changeFrequency: 'weekly', url: `${site.url}/clips` },
  { changeFrequency: 'yearly', url: `${site.url}/about` },
  { changeFrequency: 'yearly', url: `${site.url}/beliefs` },
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
      url: `${site.url}/talks/${speakerSlug}/${talkSlug}`,
    }),
  );

  const speakerEntries: MetadataRoute.Sitemap = speakers.map((speaker) => ({
    changeFrequency: 'monthly',
    lastModified: new Date(speaker.updatedAt ?? speaker._creationTime),
    url: `${site.url}/speakers/${speaker.slug}`,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collectionSlugs.map(({ slug, updatedAt }) => ({
    changeFrequency: 'monthly',
    lastModified: new Date(updatedAt),
    url: `${site.url}/collections/${slug}`,
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(topic.updatedAt ?? topic._creationTime),
    url: `${site.url}/topics/${topic.slug}`,
  }));

  const clipEntries: MetadataRoute.Sitemap = clipSlugs.map(({ slug, updatedAt }) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(updatedAt),
    url: `${site.url}/clips/${slug}`,
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
