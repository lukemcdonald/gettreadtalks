import { site } from '../../configs/site.ts';

/**
 * Generate a talk URL with speaker and talk slugs.
 * @param speakerSlug - Speaker slug identifier
 * @param talkSlug - Talk slug identifier
 * @returns URL path for the talk
 */
export function getTalkUrl(speakerSlug: string, talkSlug: string): string {
  return `/talks/${speakerSlug}/${talkSlug}`;
}

export function talkListItemsJsonLd(
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
      ? `${site.url}${getTalkUrl(talk.speaker.slug, talk.slug)}`
      : undefined,
  }));
}
