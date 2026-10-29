import {
  PREVIEW_TALK_ROMANS_8,
  PREVIEW_TALK_THE_PRODIGAL_SON,
} from '../convex/previewFixtures.ts';
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
  await talksPage.searchFor('romans');

  await expect(talksPage.page).toHaveURL(/search=romans/u);
  await expect(
    talksPage.page.getByRole('link', {
      name: new RegExp(PREVIEW_TALK_ROMANS_8.title, 'u'),
    })
  ).toBeVisible();
  await expect(
    talksPage.page.getByRole('link', {
      name: new RegExp(PREVIEW_TALK_THE_PRODIGAL_SON.title, 'u'),
    })
  ).toHaveCount(0);
});

test('Talks / Related talks by topic', async ({ talksPage }) => {
  const { page } = talksPage;

  await page.goto(
    `/talks/${PREVIEW_TALK_THE_PRODIGAL_SON.speakerSlug}/${PREVIEW_TALK_THE_PRODIGAL_SON.slug}`
  );

  await expect(talksPage.talkHeading).toHaveText(
    PREVIEW_TALK_THE_PRODIGAL_SON.title
  );

  await expect(
    page.getByRole('heading', { name: 'Related Talks' })
  ).toBeVisible();
  await expect(page.getByTestId('talk-card')).not.toHaveCount(0);
});
