import { describe, expect, it } from '@/test';

import { buildBreadcrumbJsonLd } from './json-ld';

describe('buildBreadcrumbJsonLd', () => {
  it('starts at Home with absolute item urls', () => {
    const result = buildBreadcrumbJsonLd([
      { href: '/talks', label: 'Talks' },
      {
        href: '/talks/lloyd-jones/the-cross',
        label: 'The Cross',
      },
    ]);
    const [home, ...items] = result.itemListElement;

    expect(home).toMatchObject({ name: 'Home', position: 1 });
    expect(home.item).toMatch(/^https:\/\//u);
    expect(items.map((item) => item.item)).toEqual([
      expect.stringMatching(/^https:\/\//u),
      expect.stringMatching(/^https:\/\//u),
    ]);
  });
});
