import { mediaJsonLd } from '../../../../components/media-embed/utils.ts';
import { site } from '../../../../configs/site.ts';
import { getSpeakerName } from '../../../../features/speakers/utils.ts';
import { getTalkUrl } from '../../../../features/talks/utils.ts';

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
export function clipJsonLd({ clip, speaker, talk }: ClipJsonLdInput) {
  const speakerName = getSpeakerName(speaker);

  return {
    '@context': 'https://schema.org',
    ...mediaJsonLd(clip.mediaUrl),
    description: clip.description,
    name: clip.title,
    url: `${site.url}/clips/${clip.slug}`,
    ...(speakerName && { creator: { '@type': 'Person', name: speakerName } }),
    ...(clip.publishedAt && {
      uploadDate: new Date(clip.publishedAt).toISOString(),
    }),
    ...(talk &&
      speaker && {
        isPartOf: {
          '@type': 'CreativeWork',
          name: talk.title,
          url: `${site.url}${getTalkUrl(speaker.slug, talk.slug)}`,
        },
      }),
  };
}
