import { buildMediaJsonLd } from '@/components/media-embed/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { buildTalkPath, getTalkAboutText } from '@/features/talks/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

interface TalkJsonLdInput {
  speaker: Parameters<typeof getSpeakerName>[0];
  speakerSlug: string;
  summary?: string | null;
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
  summary,
  talk,
  talkSlug,
}: TalkJsonLdInput) {
  const speakerName = getSpeakerName(speaker);
  const uploadedAt = talk.publishedAt ?? talk._creationTime;

  return {
    '@context': 'https://schema.org',
    ...buildMediaJsonLd(talk.mediaUrl),
    description: formatTalkJsonLdDescription({
      description: getTalkAboutText({
        description: talk.description,
        summary,
      }),
      scripture: talk.scripture,
      speakerName,
      title: talk.title,
    }),
    name: talk.title,
    ...(speakerName && { creator: { '@type': 'Person', name: speakerName } }),
    ...(uploadedAt && {
      uploadDate: new Date(uploadedAt).toISOString(),
    }),
    url: buildAbsoluteUrl(
      buildTalkPath({ speaker: { slug: speakerSlug }, slug: talkSlug })
    ),
  };
}
