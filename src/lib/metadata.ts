import type { Metadata } from 'next';

import { site } from '@/configs/site';

const openGraphDefaults = {
  locale: site.locale,
  siteName: site.name,
} as const;

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
  const metadata: Metadata = {
    alternates: {
      canonical,
    },
    description,
    title,
  };

  if (openGraphType === 'profile') {
    metadata.openGraph = {
      ...openGraphDefaults,
      type: 'profile',
    };
  }

  if (openGraphType === 'video.other') {
    metadata.openGraph = {
      ...openGraphDefaults,
      type: 'video.other',
    };
  }

  return metadata;
}
