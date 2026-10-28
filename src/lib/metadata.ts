import type { Metadata } from 'next';

import { site } from '@/configs/site';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

export const META_DESCRIPTION_MAX_LENGTH = 160;

const TRAILING_META_WORDS = new Set([
  'a',
  'an',
  'and',
  'but',
  'for',
  'nor',
  'of',
  'or',
  'the',
  'to',
  'with',
]);

const openGraphDefaults = {
  images: [
    {
      alt: site.name,
      height: 630,
      url: '/default-seo-image.png',
      width: 1200,
    },
  ],
  locale: site.locale,
  siteName: site.name,
};

function toCanonicalUrl(canonical: string) {
  if (canonical.startsWith('http://') || canonical.startsWith('https://')) {
    return canonical;
  }

  return buildAbsoluteUrl(canonical);
}

function trimAtWordBoundary(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  const lastSpace = text.lastIndexOf(' ', maxLength);
  const trimmed =
    lastSpace > 0 ? text.slice(0, lastSpace) : text.slice(0, maxLength);
  const lastWord = trimmed.split(' ').at(-1)?.toLowerCase();

  if (!lastWord || !TRAILING_META_WORDS.has(lastWord)) {
    return trimmed;
  }

  const previousSpace = trimmed.lastIndexOf(' ');

  if (previousSpace <= 0) {
    return trimmed;
  }

  return trimmed.slice(0, previousSpace);
}

export function formatMetaDescription(text: string | null | undefined) {
  const normalized = text?.trim().replaceAll(/\s+/gu, ' ');

  if (!normalized) {
    return;
  }

  return trimAtWordBoundary(normalized, META_DESCRIPTION_MAX_LENGTH);
}

export function buildPageMetadata({
  canonical,
  description,
  openGraphType,
  title,
}: {
  canonical: string;
  description?: string;
  openGraphType?: 'profile' | 'video.other';
  title: string;
}): Metadata {
  const canonicalUrl = toCanonicalUrl(canonical);
  const metaDescription = formatMetaDescription(description);
  const metadata: Metadata = {
    alternates: {
      canonical: canonicalUrl,
    },
    title,
  };

  if (metaDescription) {
    metadata.description = metaDescription;
  }

  if (openGraphType === 'profile') {
    metadata.openGraph = {
      ...openGraphDefaults,
      type: 'profile',
      url: canonicalUrl,
    };
  } else if (openGraphType === 'video.other') {
    metadata.openGraph = {
      ...openGraphDefaults,
      type: 'video.other',
      url: canonicalUrl,
    };
  } else {
    metadata.openGraph = {
      ...openGraphDefaults,
      type: 'website',
      url: canonicalUrl,
    };
  }

  return metadata;
}
