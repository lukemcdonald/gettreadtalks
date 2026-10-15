import type { MetadataRoute } from 'next';

import { fetchQuery } from 'convex/nextjs';

import { site } from '@/configs/site';
import { api } from '@/convex/_generated/api';
import { getClipUrl } from '@/features/clips/utils';
import { getTalkUrl } from '@/features/talks/utils';

const staticRoutes: MetadataRoute.Sitemap = [
  { priority: 1, url: site.url },
  { changeFrequency: 'weekly', url: `${site.url}/talks` },
  { changeFrequency: 'monthly', url: `${site.url}/speakers` },
  { changeFrequency: 'monthly', url: `${site.url}/collections` },
  { changeFrequency: 'weekly', url: `${site.url}/topics` },
  { changeFrequency: 'weekly', url: `${site.url}/clips` },
  { changeFrequency: 'yearly', url: `${site.url}/about` },
  { changeFrequency: 'yearly', url: `${site.url}/ai` },
  { changeFrequency: 'yearly', url: `${site.url}/beliefs` },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [talks, speakers, collections, topics, clips] = await Promise.all([
    fetchQuery(api.talks.listTalkSlugs, {}),
    fetchQuery(api.speakers.listSpeakerSlugs, {}),
    fetchQuery(api.collections.listCollectionSlugs, {}),
    fetchQuery(api.topics.listTopicSlugs, {}),
    fetchQuery(api.clips.listClipSlugs, {}),
  ]);

  const talkEntries: MetadataRoute.Sitemap = talks.map((talk) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(talk.updatedAt),
    url: `${site.url}${getTalkUrl(talk.speakerSlug, talk.talkSlug)}`,
  }));

  const speakerEntries: MetadataRoute.Sitemap = speakers.map((speaker) => ({
    changeFrequency: 'monthly',
    lastModified: new Date(speaker.updatedAt),
    url: `${site.url}/speakers/${speaker.slug}`,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      changeFrequency: 'monthly',
      lastModified: new Date(collection.updatedAt),
      url: `${site.url}/collections/${collection.slug}`,
    })
  );

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(topic.updatedAt),
    url: `${site.url}/topics/${topic.slug}`,
  }));

  const clipEntries: MetadataRoute.Sitemap = clips.map((clip) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(clip.updatedAt),
    url: `${site.url}${getClipUrl(clip.slug)}`,
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
