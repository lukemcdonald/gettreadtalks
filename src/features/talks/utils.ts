import type { Speaker } from '@/features/speakers/types';
import type { Talk, TalkId } from '@/features/talks/types';

import { buildAbsoluteUrl, buildPathQuery } from '@/lib/entities/paths';

export function buildTalkPath(
  talk: Pick<Talk, 'slug'> & {
    speaker?: Pick<Speaker, 'slug'> | null;
  }
) {
  if (!talk.speaker?.slug) {
    return `/talks/${talk.slug}`;
  }

  return `/talks/${talk.speaker.slug}/${talk.slug}`;
}

export function buildTalkStudyPath(talkId: TalkId) {
  return `/talks/edit/${talkId}/study`;
}

export function buildTalksPath(options?: { query?: { featured?: boolean } }) {
  return `/talks${buildPathQuery(options?.query)}`;
}

export function formatTalkMetaDescription({
  description,
  scripture,
  speakerName,
  topicTitles = [],
}: {
  description?: string;
  scripture?: string;
  speakerName?: string;
  topicTitles?: string[];
}) {
  const summary =
    description?.trim() ||
    (speakerName ? `A talk by ${speakerName}.` : undefined);
  const topics = topicTitles.length
    ? `Topics: ${topicTitles.join(', ')}.`
    : undefined;
  const parts = [summary, scripture, topics].filter((part): part is string =>
    Boolean(part)
  );

  if (parts.length === 0) {
    return;
  }

  return parts.join(' ');
}

export function buildTalkListItemsJsonLd(
  talks: {
    speaker: { slug: string } | null;
    slug: string;
    title: string;
  }[]
) {
  return talks.map((talk, index) => ({
    '@type': 'ListItem' as const,
    name: talk.title,
    position: index + 1,
    url: talk.speaker ? buildAbsoluteUrl(buildTalkPath(talk)) : undefined,
  }));
}
