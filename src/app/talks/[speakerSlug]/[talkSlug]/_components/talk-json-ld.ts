import { buildMediaJsonLd } from '@/components/media-embed/utils';
import { site } from '@/configs/site';
import { getSpeakerName } from '@/features/speakers/utils';
import { buildTalkUrl } from '@/features/talks/utils';

interface TalkJsonLdInput {
  speaker: Parameters<typeof getSpeakerName>[0];
  speakerSlug: string;
  talk: {
    _creationTime?: number;
    description?: string;
    mediaUrl?: string;
    publishedAt?: number;
    scripture?: string;
    title: string;
  };
  talkSlug: string;
}

function formatTalkJsonLdDescription({
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

export function buildTalkJsonLd({
  speaker,
  speakerSlug,
  talk,
  talkSlug,
}: TalkJsonLdInput) {
  const speakerName = getSpeakerName(speaker);
  const uploadedAt = talk.publishedAt ?? talk._creationTime;

  return {
    '@context': 'https://schema.org',
    ...buildMediaJsonLd(talk.mediaUrl),
    description: formatTalkJsonLdDescription({
      description: talk.description,
      scripture: talk.scripture,
      speakerName,
      title: talk.title,
    }),
    name: talk.title,
    ...(speakerName && { creator: { '@type': 'Person', name: speakerName } }),
    ...(uploadedAt && {
      uploadDate: new Date(uploadedAt).toISOString(),
    }),
    url: `${site.url}${buildTalkUrl(speakerSlug, talkSlug)}`,
  };
}
