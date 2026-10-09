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

test('Talks / Search', async ({ talksPage }) => {
  await talksPage.goto();
  await talksPage.searchFor('grace');

  await expect(talksPage.page).toHaveURL(/search=grace/u);
});
