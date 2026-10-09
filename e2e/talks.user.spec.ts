import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Talks / Favorite and unfavorite', async ({
  favoritesPage,
  talksPage,
}) => {
  await talksPage.goto();
  await talksPage.openFirst();

  await expect(talksPage.favorite).toBeVisible();
  await expect(talksPage.favorite).toBeEnabled();

  const title = await talksPage.talkHeading.textContent();

  if (!title) {
    throw new Error('Expected the talk heading to have a title');
  }

  const talkUrl = talksPage.page.url();
  const startedPressed =
    (await talksPage.favorite.getAttribute('aria-pressed')) === 'true';

  if (!startedPressed) {
    await talksPage.favorite.click();
  }

  await expect(async () => {
    await favoritesPage.goto();
    await expect(favoritesPage.talkNamed(title)).toBeVisible();
  }).toPass();

  await talksPage.page.goto(talkUrl);
  await expect(talksPage.favorite).toBeVisible();
  await talksPage.favorite.click();

  await expect(async () => {
    await favoritesPage.goto();
    await expect(favoritesPage.talkNamed(title)).toHaveCount(0);
  }).toPass();

  if (startedPressed) {
    await talksPage.page.goto(talkUrl);
    await expect(talksPage.favorite).toBeVisible();
    await talksPage.favorite.click();

    await expect(async () => {
      await favoritesPage.goto();
      await expect(favoritesPage.talkNamed(title)).toBeVisible();
    }).toPass();
  }
});
