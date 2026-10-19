import { buildAbsoluteUrl } from '@/lib/entities/paths';

interface BreadcrumbSegment {
  href?: string;
  label: string;
}

export function buildBreadcrumbJsonLd(
  segments: (BreadcrumbSegment | false | null | undefined)[]
) {
  const items = segments.filter(
    (segment): segment is BreadcrumbSegment => !!segment
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((segment, index) => ({
      '@type': 'ListItem' as const,
      ...(segment.href && { item: buildAbsoluteUrl(segment.href) }),
      name: segment.label,
      position: index + 1,
    })),
  };
}
