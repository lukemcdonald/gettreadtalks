import { mediaJsonLd } from '@/components/media-embed/utils';
import { site } from '@/configs/site';
import { getSpeakerName } from '@/features/speakers/utils';
import { getTalkUrl } from '@/features/talks/utils';

interface TalkJsonLdInput {
  speaker: Parameters<typeof getSpeakerName>[0];
  speakerSlug: string;
  talk: {
    description?: string;
    mediaUrl?: string;
    publishedAt?: number;
    scripture?: string;
    title: string;
  };
  talkSlug: string;
}

function talkJsonLdDescription({
  description,
  scripture,
  speakerName,
  title,
}: {
  description?: string;
  scripture?: string;
  speakerName: string;
  title: string;
}) {
  const explicit = description?.trim();

  if (explicit) {
    return explicit;
  }

  return [
    title,
    speakerName && `by ${speakerName}`,
    scripture && `on ${scripture}`,
  ]
    .filter(Boolean)
    .join(' ');
}

export function talkJsonLd({
  speaker,
  speakerSlug,
  talk,
  talkSlug,
}: TalkJsonLdInput) {
  const speakerName = getSpeakerName(speaker);

  return {
    '@context': 'https://schema.org',
    ...mediaJsonLd(talk.mediaUrl),
    description: talkJsonLdDescription({
      description: talk.description,
      scripture: talk.scripture,
      speakerName,
      title: talk.title,
    }),
    name: talk.title,
    ...(speakerName && { creator: { '@type': 'Person', name: speakerName } }),
    ...(talk.publishedAt && {
      uploadDate: new Date(talk.publishedAt).toISOString(),
    }),
    url: `${site.url}${getTalkUrl(speakerSlug, talkSlug)}`,
  };
}
