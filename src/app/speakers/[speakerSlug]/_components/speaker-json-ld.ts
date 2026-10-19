import { buildSpeakerPath } from '@/features/speakers/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

interface SpeakerJsonLdInput {
  description?: string;
  imageUrl?: string;
  name: string;
  speakerSlug: string;
  websiteUrl?: string;
}

export function buildSpeakerJsonLd({
  description,
  imageUrl,
  name,
  speakerSlug,
  websiteUrl,
}: SpeakerJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    description,
    image: imageUrl,
    name,
    ...(websiteUrl && { sameAs: [websiteUrl] }),
    url: buildAbsoluteUrl(buildSpeakerPath(speakerSlug)),
  };
}
