import { getSiteLanguage, site } from '@/configs/site';
import { buildSearchPath } from '@/features/search/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';
import { getOrganizationJsonLd } from '@/lib/json-ld';

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description: site.metaDescription,
    inLanguage: getSiteLanguage(),
    name: site.name,
    potentialAction: {
      '@type': 'SearchAction',
      'query-input': 'required name=search_term_string',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: buildAbsoluteUrl(
          `${buildSearchPath()}?search={search_term_string}`
        ),
      },
    },
    publisher: getOrganizationJsonLd(),
    url: site.url,
  };
}
