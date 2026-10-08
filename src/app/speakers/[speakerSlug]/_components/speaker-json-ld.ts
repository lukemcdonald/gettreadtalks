import { site } from '../../../../configs/site.ts';

interface SpeakerJsonLdInput {
  description?: string;
  imageUrl?: string;
  name: string;
  speakerSlug: string;
  websiteUrl?: string;
}

export function speakerJsonLd({
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
    url: `${site.url}/speakers/${speakerSlug}`,
  };
}
