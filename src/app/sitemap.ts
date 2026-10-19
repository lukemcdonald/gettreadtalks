import type { MetadataRoute } from 'next';

import { fetchQuery } from 'convex/nextjs';

import { site } from '@/configs/site';
import { api } from '@/convex/_generated/api';
import { buildClipPath, buildClipsPath } from '@/features/clips/utils';
import {
  buildCollectionPath,
  buildCollectionsPath,
} from '@/features/collections/utils';
import { buildSpeakerPath, buildSpeakersPath } from '@/features/speakers/utils';
import { buildTalkPath, buildTalksPath } from '@/features/talks/utils';
import { buildTopicPath, buildTopicsPath } from '@/features/topics/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

const staticRoutes: MetadataRoute.Sitemap = [
  { priority: 1, url: site.url },
  { changeFrequency: 'weekly', url: buildAbsoluteUrl(buildTalksPath()) },
  { changeFrequency: 'monthly', url: buildAbsoluteUrl(buildSpeakersPath()) },
  {
    changeFrequency: 'monthly',
    url: buildAbsoluteUrl(buildCollectionsPath()),
  },
  { changeFrequency: 'weekly', url: buildAbsoluteUrl(buildTopicsPath()) },
  { changeFrequency: 'weekly', url: buildAbsoluteUrl(buildClipsPath()) },
  { changeFrequency: 'yearly', url: buildAbsoluteUrl('/about') },
  { changeFrequency: 'yearly', url: buildAbsoluteUrl('/ai') },
  { changeFrequency: 'yearly', url: buildAbsoluteUrl('/beliefs') },
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
    url: buildAbsoluteUrl(
      buildTalkPath({
        speaker: { slug: talk.speakerSlug },
        slug: talk.talkSlug,
      })
    ),
  }));

  const speakerEntries: MetadataRoute.Sitemap = speakers.map((speaker) => ({
    changeFrequency: 'monthly',
    lastModified: new Date(speaker.updatedAt),
    url: buildAbsoluteUrl(buildSpeakerPath(speaker)),
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      changeFrequency: 'monthly',
      lastModified: new Date(collection.updatedAt),
      url: buildAbsoluteUrl(buildCollectionPath(collection)),
    })
  );

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(topic.updatedAt),
    url: buildAbsoluteUrl(buildTopicPath(topic)),
  }));

  const clipEntries: MetadataRoute.Sitemap = clips.map((clip) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(clip.updatedAt),
    url: buildAbsoluteUrl(buildClipPath(clip)),
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
