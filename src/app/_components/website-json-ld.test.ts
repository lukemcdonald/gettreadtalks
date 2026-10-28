import { getSiteLanguage, site } from '@/configs/site';
import { describe, expect, it } from '@/test';

import { buildWebsiteJsonLd } from './website-json-ld';

describe('buildWebsiteJsonLd', () => {
  it('describes the site with a publisher and search action', () => {
    const result = buildWebsiteJsonLd();

    expect(result['@type']).toBe('WebSite');
    expect(result.description).toBe(site.metaDescription);
    expect(result.inLanguage).toBe(getSiteLanguage());
    expect(result.name).toBe(site.name);
    expect(result.publisher).toEqual({
      '@type': 'Organization',
      name: site.name,
      url: site.url,
    });
    expect(result.url).toBe(site.url);
    expect(result.potentialAction.target.urlTemplate).toBe(
      'https://www.gettreadtalks.com/search?search={search_term_string}'
    );
  });
});
