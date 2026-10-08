import { isVideoMediaType } from '../../../../../components/media-embed/utils.ts';
import { site } from '../../../../../configs/site.ts';
import { getSpeakerName } from '../../../../../features/speakers/utils.ts';
import { getTalkUrl } from '../../../../../features/talks/utils.ts';

interface TalkJsonLdInput {
  speaker: Parameters<typeof getSpeakerName>[0];
  speakerSlug: string;
  talk: {
    description?: string;
    mediaUrl?: string;
    publishedAt?: number;
    title: string;
  };
  talkSlug: string;
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
    '@type': isVideoMediaType(talk.mediaUrl) ? 'VideoObject' : 'AudioObject',
    description: talk.description,
    embedUrl: talk.mediaUrl,
    name: talk.title,
    ...(speakerName && { creator: { '@type': 'Person', name: speakerName } }),
    ...(talk.publishedAt && {
      uploadDate: new Date(talk.publishedAt).toISOString(),
    }),
    url: `${site.url}${getTalkUrl(speakerSlug, talkSlug)}`,
  };
}
