import { buildMediaJsonLd } from '@/components/media-embed/utils';
import { buildClipPath } from '@/features/clips/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { buildTalkPath } from '@/features/talks/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

interface ClipJsonLdInput {
  clip: {
    description?: string;
    mediaUrl?: string;
    publishedAt?: number;
    slug: string;
    title: string;
  };
  speaker: {
    firstName: string;
    lastName: string;
    slug: string;
  } | null;
  talk: { slug: string; title: string } | null;
}

// fallow-ignore-next-line complexity
export function buildClipJsonLd({ clip, speaker, talk }: ClipJsonLdInput) {
  const speakerName = getSpeakerName(speaker);

  return {
    '@context': 'https://schema.org',
    ...buildMediaJsonLd(clip.mediaUrl),
    description: clip.description,
    name: clip.title,
    url: buildAbsoluteUrl(buildClipPath(clip.slug)),
    ...(speakerName && { creator: { '@type': 'Person', name: speakerName } }),
    ...(clip.publishedAt && {
      uploadDate: new Date(clip.publishedAt).toISOString(),
    }),
    ...(talk &&
      speaker && {
        isPartOf: {
          '@type': 'CreativeWork',
          name: talk.title,
          url: buildAbsoluteUrl(buildTalkPath(speaker.slug, talk.slug)),
        },
      }),
  };
}
