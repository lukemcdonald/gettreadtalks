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

function lastModified(timestamp: number | undefined, createdAt: number) {
  return new Date(timestamp ?? createdAt);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [talks, speakers, collections, topics, clips] = await Promise.all([
    fetchQuery(api.talks.listPublishedTalks, {}),
    fetchQuery(api.speakers.listPublishedSpeakers, {}),
    fetchQuery(api.collections.listPublishedCollections, {}),
    fetchQuery(api.topics.listTopics, {}),
    fetchQuery(api.clips.listPublishedClips, {}),
  ]);

  const speakerById = new Map(
    speakers.map((speaker) => [speaker._id, speaker])
  );

  const talkEntries: MetadataRoute.Sitemap = talks.flatMap((talk) => {
    const speaker = speakerById.get(talk.speakerId);
    if (!speaker) {
      return [];
    }

    return [
      {
        changeFrequency: 'weekly',
        lastModified: lastModified(talk.updatedAt, talk._creationTime),
        url: `${site.url}${getTalkUrl(speaker.slug, talk.slug)}`,
      },
    ];
  });

  const speakerEntries: MetadataRoute.Sitemap = speakers.map((speaker) => ({
    changeFrequency: 'monthly',
    lastModified: lastModified(speaker.updatedAt, speaker._creationTime),
    url: `${site.url}/speakers/${speaker.slug}`,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      changeFrequency: 'monthly',
      lastModified: lastModified(
        collection.updatedAt,
        collection._creationTime
      ),
      url: `${site.url}/collections/${collection.slug}`,
    })
  );

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    changeFrequency: 'weekly',
    lastModified: lastModified(topic.updatedAt, topic._creationTime),
    url: `${site.url}/topics/${topic.slug}`,
  }));

  const clipEntries: MetadataRoute.Sitemap = clips.map((clip) => ({
    changeFrequency: 'weekly',
    lastModified: lastModified(clip.updatedAt, clip._creationTime),
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
