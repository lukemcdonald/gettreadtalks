import { buildMediaJsonLd } from '@/components/media-embed/utils';
import { site } from '@/configs/site';
import { getSpeakerName } from '@/features/speakers/utils';
import { buildTalkPath } from '@/features/talks/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

interface TalkJsonLdInput {
  speaker: Parameters<typeof getSpeakerName>[0];
  speakerSlug: string;
  summary?: string | null;
  talk: {
    _creationTime?: number;
    mediaUrl?: string;
    publishedAt?: number;
    title: string;
  };
  talkSlug: string;
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
  const description = summary?.trim() || site.description;

  return {
    '@context': 'https://schema.org',
    ...buildMediaJsonLd(talk.mediaUrl),
    description,
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
