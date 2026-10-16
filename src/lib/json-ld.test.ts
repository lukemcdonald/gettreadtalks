import { describe, expect, it } from '@/test';

import { buildBreadcrumbJsonLd } from './json-ld';

describe('buildBreadcrumbJsonLd', () => {
  it('matches visible breadcrumb items, names, order, and absolute urls', () => {
    expect(
      buildBreadcrumbJsonLd([
        { href: '/talks', label: 'Talks' },
        {
          href: '/talks/lloyd-jones/the-cross',
          label: 'The Cross',
        },
      ])
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          item: 'https://www.gettreadtalks.com/talks',
          name: 'Talks',
          position: 1,
        },
        {
          '@type': 'ListItem',
          item: 'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross',
          name: 'The Cross',
          position: 2,
        },
      ],
    });
  });

  it('drops falsy segments and omits item when href is missing', () => {
    expect(
      buildBreadcrumbJsonLd([
        { href: '/talks', label: 'Talks' },
        false,
        null,
        { label: 'The Cross' },
      ])
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          item: 'https://www.gettreadtalks.com/talks',
          name: 'Talks',
          position: 1,
        },
        {
          '@type': 'ListItem',
          name: 'The Cross',
          position: 2,
        },
      ],
    });
  });
});
