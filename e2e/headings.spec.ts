import type { Page } from '@playwright/test';

import { expect, test } from './fixtures/index.ts';

const PUBLIC_PAGES = [
  { name: 'ai', path: '/ai' },
  { name: 'clip', path: '/clips/sample-clip-no-condemnation' },
  { name: 'clips', path: '/clips' },
  { name: 'collection', path: '/collections/example-series-the-psalms' },
  { name: 'collections', path: '/collections' },
  { name: 'home', path: '/' },
  { name: 'not found', path: '/this-page-does-not-exist' },
  { name: 'search', path: '/search' },
  { name: 'speaker', path: '/speakers/john-doe' },
  { name: 'speakers', path: '/speakers' },
  { name: 'talk', path: '/talks/john-doe/sample-sermon-on-romans-8' },
  { name: 'talks', path: '/talks' },
  { name: 'topic', path: '/topics/grace' },
  { name: 'topics', path: '/topics' },
] as const;

async function expectHeadingOutline(page: Page) {
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('main')).toHaveCount(1);

  const levels = await page
    .getByRole('heading')
    .evaluateAll((elements) =>
      elements.map((element) => Math.trunc(Number(element.tagName.slice(1))))
    );

  let previousLevel = 0;

  for (const level of levels) {
    expect(level).toBeGreaterThan(0);
    expect(level).toBeLessThanOrEqual(previousLevel + 1);
    previousLevel = level;
  }
}

for (const { name, path } of PUBLIC_PAGES) {
  test(`Headings / ${name} has one h1 and no skipped levels`, async ({
    page,
  }) => {
    const response = await page.goto(path);

    if (name === 'not found') {
      expect(response?.status()).toBe(404);
    }

    await expectHeadingOutline(page);
  });
}
