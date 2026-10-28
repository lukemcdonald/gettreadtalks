import { buildSpeakerPath } from '@/features/speakers/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

interface SpeakerJsonLdInput {
  description?: string;
  imageUrl?: string;
  name: string;
  role?: string;
  speakerSlug: string;
  websiteUrl?: string;
}

export function buildSpeakerJsonLd({
  description,
  imageUrl,
  name,
  role,
  speakerSlug,
  websiteUrl,
}: SpeakerJsonLdInput) {
  const url = buildAbsoluteUrl(buildSpeakerPath({ slug: speakerSlug }));

  return {
    '@context': 'https://schema.org',
    '@id': url,
    '@type': 'Person',
    description,
    ...(imageUrl && { image: buildAbsoluteUrl(imageUrl) }),
    ...(role && { jobTitle: role }),
    name,
    ...(websiteUrl && { sameAs: [websiteUrl] }),
    url,
  };
}
