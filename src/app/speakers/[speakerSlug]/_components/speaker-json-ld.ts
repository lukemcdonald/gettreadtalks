import { site } from '@/configs/site';
import { buildSpeakerUrl } from '@/features/speakers/utils';

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
    url: `${site.url}${buildSpeakerUrl(speakerSlug)}`,
  };
}
