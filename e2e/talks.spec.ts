import { expect, test } from './fixtures/index.ts';

test('Talks / Browse and open a talk', async ({ homePage, talksPage }) => {
  await homePage.goto();
  await homePage.browseTalks.click();

  await expect(talksPage.heading).toBeVisible();

  await talksPage.openFirst();

  await expect(talksPage.page).toHaveURL(/\/talks\/[^/]+\/[^/]+/u);
  await expect(talksPage.talkHeading).toBeVisible();
  await expect(talksPage.playback).toBeVisible();
});

test('Talks / Listing search', async ({ talksPage }) => {
  await talksPage.goto();
  await talksPage.searchFor('grace');

  await expect(talksPage.page).toHaveURL(/search=grace/u);
});

test('Talks / Related talks by topic', async ({ talksPage }) => {
  const { page } = talksPage;

  await page.goto('/talks/mary-smith/example-talk-the-prodigal-son');

  await expect(talksPage.talkHeading).toHaveText(
    'Example Talk: The Prodigal Son'
  );

  const relatedHeading = page.getByRole('heading', { name: 'Related Talks' });
  await expect(relatedHeading).toBeVisible();
  await relatedHeading.scrollIntoViewIfNeeded();
  await expect(page.getByTestId('talk-card')).not.toHaveCount(0);

  await page.setViewportSize({ height: 900, width: 1440 });
  await page.screenshot({
    fullPage: true,
    path: 'e2e/output/talk-related-after-desktop.png',
  });

  await page.setViewportSize({ height: 844, width: 390 });
  await relatedHeading.scrollIntoViewIfNeeded();
  await page.screenshot({
    fullPage: true,
    path: 'e2e/output/talk-related-after-mobile.png',
  });
});
