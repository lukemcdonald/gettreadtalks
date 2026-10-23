import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';
import { buildTalkPath } from '@/features/talks/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

export interface SpeakerRecord {
  firstName: string;
  lastName: string;
  ministry?: string;
  slug: string;
}

export interface TalkRecord {
  publishedAt?: number;
  scripture?: string;
  slug: string;
  title: string;
  topicSlugs?: string[];
}

export function toIsoDate(timestamp?: number) {
  if (!timestamp) {
    return;
  }

  return new Date(timestamp).toISOString();
}

export function formatSpeaker(speaker: SpeakerRecord) {
  return {
    ministry: speaker.ministry,
    name: getSpeakerName(speaker),
    slug: speaker.slug,
    url: buildAbsoluteUrl(buildSpeakerPath(speaker)),
  };
}

export function formatTalk(talk: TalkRecord, speaker: SpeakerRecord | null) {
  return {
    publishedAt: toIsoDate(talk.publishedAt),
    scripture: talk.scripture,
    slug: talk.slug,
    speaker: speaker ? formatSpeaker(speaker) : null,
    title: talk.title,
    topics: talk.topicSlugs,
    url: speaker
      ? buildAbsoluteUrl(buildTalkPath({ slug: talk.slug, speaker }))
      : undefined,
  };
}
