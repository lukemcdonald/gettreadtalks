import { site } from '@/configs/site';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

interface BreadcrumbSegment {
  href?: string;
  label: string;
}

const HOME_SEGMENT: BreadcrumbSegment = {
  href: '/',
  label: 'Home',
};

function toBreadcrumbItemUrl(href: string) {
  if (href === '/') {
    return site.url;
  }

  return buildAbsoluteUrl(href);
}

export function getOrganizationJsonLd() {
  return {
    '@type': 'Organization' as const,
    name: site.name,
    url: site.url,
  };
}

export function buildBreadcrumbJsonLd(
  segments: (BreadcrumbSegment | false | null | undefined)[]
) {
  const items = [
    HOME_SEGMENT,
    ...segments.filter((segment): segment is BreadcrumbSegment => !!segment),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((segment, index) => ({
      '@type': 'ListItem' as const,
      ...(segment.href && { item: toBreadcrumbItemUrl(segment.href) }),
      name: segment.label,
      position: index + 1,
    })),
  };
}
