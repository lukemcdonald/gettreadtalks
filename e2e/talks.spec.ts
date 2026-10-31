import { PREVIEW_TALKS } from '../convex/previewFixtures.ts';
import { expect, talkPath, test } from './fixtures/index.ts';

test('Talk listing search filters results', async ({ talksPage }) => {
  await talksPage.goto();
  await talksPage.searchFor('romans');

  await expect(talksPage.page).toHaveURL(/search=romans/u);
  await expect(
    talksPage.page
      .getByTestId('talk-card')
      .filter({ hasText: PREVIEW_TALKS.ROMANS_8.title })
  ).toBeVisible();
  await expect(
    talksPage.page
      .getByTestId('talk-card')
      .filter({ hasText: PREVIEW_TALKS.THE_PRODIGAL_SON.title })
  ).toHaveCount(0);
});

test('Talk detail shows related talks', async ({ talksPage }) => {
  await talksPage.page.goto(talkPath(PREVIEW_TALKS.THE_PRODIGAL_SON));

  await expect(talksPage.page.getByTestId('talk-heading')).toBeVisible();
  await expect(talksPage.page.getByTestId('talk-card')).not.toHaveCount(0);
});
