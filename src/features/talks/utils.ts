import { site } from '../../configs/site.ts';

/**
 * Generate a talk URL with speaker and talk slugs.
 * @param speakerSlug - Speaker slug identifier
 * @param talkSlug - Talk slug identifier
 * @returns URL path for the talk
 */
export function buildTalkUrl(speakerSlug: string, talkSlug: string): string {
  return `/talks/${speakerSlug}/${talkSlug}`;
}

export function buildTalksPath() {
  return '/talks';
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
    url: talk.speaker
      ? `${site.url}${buildTalkUrl(talk.speaker.slug, talk.slug)}`
      : undefined,
  }));
}
