import { buildMediaJsonLd } from '@/components/media-embed/utils';
import { getSiteLanguage, site } from '@/configs/site';
import { buildClipPath } from '@/features/clips/utils';
import { getSpeakerAvatarUrl } from '@/features/speakers/get-speaker-avatar-url';
import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';
import { buildTalkPath } from '@/features/talks/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';
import { getOrganizationJsonLd } from '@/lib/json-ld';

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

function getClipCreatorJsonLd(speaker: ClipJsonLdInput['speaker']) {
  const name = getSpeakerName(speaker);

  if (!(name && speaker)) {
    return;
  }

  const imageUrl = getSpeakerAvatarUrl(speaker);

  return {
    '@type': 'Person' as const,
    ...(imageUrl && { image: buildAbsoluteUrl(imageUrl) }),
    name,
    url: buildAbsoluteUrl(buildSpeakerPath(speaker)),
  };
}

function getClipDescription(
  clip: ClipJsonLdInput['clip'],
  speakerName: string
) {
  const description = clip.description?.trim();

  if (description) {
    return description;
  }

  const byline = speakerName ? ` from ${speakerName}` : '';

  return `${clip.title}${byline}. ${site.description}`;
}

export function buildClipJsonLd({ clip, speaker, talk }: ClipJsonLdInput) {
  const speakerName = getSpeakerName(speaker);
  const clipUrl = buildAbsoluteUrl(buildClipPath(clip));
  const creator = getClipCreatorJsonLd(speaker);

  return {
    '@context': 'https://schema.org',
    ...(buildMediaJsonLd(clip.mediaUrl, {
      thumbnailUrl: `${clipUrl}/opengraph-image`,
    }) ?? { '@type': 'CreativeWork' as const }),
    ...(creator && { creator }),
    description: getClipDescription(clip, speakerName),
    inLanguage: getSiteLanguage(),
    ...(talk &&
      speaker && {
        isPartOf: {
          '@type': 'CreativeWork',
          name: talk.title,
          url: buildAbsoluteUrl(buildTalkPath({ speaker, slug: talk.slug })),
        },
      }),
    name: clip.title,
    publisher: getOrganizationJsonLd(),
    ...(clip.publishedAt && {
      uploadDate: new Date(clip.publishedAt).toISOString(),
    }),
    url: clipUrl,
  };
}
