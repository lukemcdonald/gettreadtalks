import type { Page } from '@playwright/test';

import fs from 'node:fs';
import path from 'node:path';

import { expect, test } from './fixtures/index.ts';

const OUT_DIR = path.join('test-results', 'pr-assets');
const PHASE = process.env.SKELETON_PHASE ?? 'after';

const VIEWPORTS = {
  desktop: { height: 800, width: 1280 },
  mobile: { height: 844, width: 390 },
} as const;

type ViewportName = keyof typeof VIEWPORTS;

async function capture(page: Page, name: string, viewport: ViewportName) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  await page.screenshot({
    fullPage: true,
    path: path.join(OUT_DIR, `${name}-${viewport}-${PHASE}.png`),
  });
}

async function waitForSkeleton(page: Page) {
  await page.locator('[data-slot="skeleton"]').first().waitFor({
    state: 'visible',
    timeout: 4000,
  });
}

const journeys = [
  {
    href: (page: Page) =>
      page.getByTestId('talk-card').first().getAttribute('href'),
    listing: '/talks',
    name: 'talk',
    title: 'Talks',
  },
  {
    href: (page: Page) =>
      page.getByTestId('speaker-card').first().getAttribute('href'),
    listing: '/speakers',
    name: 'speaker',
    title: 'Speakers',
  },
  {
    href: (page: Page) =>
      page.locator('a[href^="/clips/"]').first().getAttribute('href'),
    listing: '/clips',
    name: 'clip',
    title: 'Clips',
  },
  {
    href: (page: Page) =>
      page.getByTestId('collection-card').first().getAttribute('href'),
    listing: '/collections',
    name: 'collection',
    title: 'Collections',
  },
] as const;

test.describe('skeleton asset capture', () => {
  test.setTimeout(45_000);

  for (const journey of journeys) {
    for (const viewport of Object.keys(VIEWPORTS) as ViewportName[]) {
      test(`${journey.name} ${viewport}`, async ({ page }) => {
        await page.setViewportSize(VIEWPORTS[viewport]);
        await page.goto(journey.listing);
        await expect(
          page.getByRole('heading', {
            exact: true,
            level: 1,
            name: journey.title,
          })
        ).toBeVisible();

        const href = await journey.href(page);

        expect(href).toBeTruthy();

        await page.goto(href ?? '/', { waitUntil: 'commit' });
        await waitForSkeleton(page);
        await capture(page, journey.name, viewport);
      });
    }
  }
});
