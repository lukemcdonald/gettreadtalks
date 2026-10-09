import { test as base } from '@playwright/test';

import { CollectionsPage } from '../pages/collections-page.ts';
import { HomePage } from '../pages/home-page.ts';
import { NotFoundPage } from '../pages/not-found-page.ts';
import { SpeakersPage } from '../pages/speakers-page.ts';
import { TalksPage } from '../pages/talks-page.ts';
import { TopicsPage } from '../pages/topics-page.ts';

export { expect } from '@playwright/test';

interface Fixtures {
  collectionsPage: CollectionsPage;
  homePage: HomePage;
  notFoundPage: NotFoundPage;
  speakersPage: SpeakersPage;
  talksPage: TalksPage;
  topicsPage: TopicsPage;
}

export const test = base.extend<Fixtures>({
  collectionsPage: async ({ page }, provide) => {
    await provide(new CollectionsPage(page));
  },
  context: async ({ baseURL, context }, provide) => {
    const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

    if (bypassSecret && baseURL) {
      const { origin } = new URL(baseURL);

      await context.route(
        (url) => url.origin === origin,
        async (route) => {
          await route.continue({
            headers: {
              ...route.request().headers(),
              'x-vercel-protection-bypass': bypassSecret,
              'x-vercel-set-bypass-cookie': 'true',
            },
          });
        }
      );
    }

    await provide(context);
  },
  homePage: async ({ page }, provide) => {
    await provide(new HomePage(page));
  },
  notFoundPage: async ({ page }, provide) => {
    await provide(new NotFoundPage(page));
  },
  speakersPage: async ({ page }, provide) => {
    await provide(new SpeakersPage(page));
  },
  talksPage: async ({ page }, provide) => {
    await provide(new TalksPage(page));
  },
  topicsPage: async ({ page }, provide) => {
    await provide(new TopicsPage(page));
  },
});
