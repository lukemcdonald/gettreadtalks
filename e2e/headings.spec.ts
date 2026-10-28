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

for (const { name, path } of PUBLIC_PAGES) {
  test(`Headings / ${name} has one h1`, async ({ page }) => {
    const response = await page.goto(path);

    if (name === 'not found') {
      expect(response?.status()).toBe(404);
    }

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
  });
}
