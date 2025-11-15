'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

export async function getTopicsWithCounts() {
  const token = await getAuthToken();
  return await fetchQuery(api.topics.listTopicsWithCount, {}, { token });
}

export async function getTopicBySlug(slug: string) {
  const token = await getAuthToken();

  const result = await fetchQuery(
    api.topics.getTopicWithContent,
    { limit: 100, slug },
    { token },
  );

  if (!result) {
    return null;
  }

  const talksWithSpeakers = await Promise.all(
    result.talks.map(async (talk) => {
      const speaker = talk.speakerId
        ? await fetchQuery(api.speakers.getSpeakerById, { speakerId: talk.speakerId }, { token })
        : null;

      return {
        ...talk,
        speaker,
      };
    }),
  );

  return {
    clips: result.clips,
    talks: talksWithSpeakers,
    topic: result.topic,
  };
}
