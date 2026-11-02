import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('User can favorite and unfavorite a talk', async ({
  favoritesPage,
  talksPage,
}) => {
  await talksPage.goto();
  await talksPage.openFirst();

  const title = await talksPage.talkHeading.textContent();

  if (!title) {
    throw new Error('Expected the talk heading to have a title');
  }

  const talkUrl = talksPage.page.url();
  const startedFavorited =
    (await talksPage.favorite.getAttribute('aria-pressed')) === 'true';

  if (!startedFavorited) {
    await talksPage.toggleFavorite();
  }

  await expect(talksPage.favorite).toHaveAttribute('aria-pressed', 'true');

  await favoritesPage.goto();
  await expect(favoritesPage.talkNamed(title)).toBeVisible();

  await talksPage.page.goto(talkUrl);
  await talksPage.toggleFavorite();
  await expect(talksPage.favorite).toHaveAttribute('aria-pressed', 'false');

  await favoritesPage.goto();
  await expect(favoritesPage.talkNamed(title)).toHaveCount(0);

  if (startedFavorited) {
    await talksPage.page.goto(talkUrl);
    await talksPage.toggleFavorite();
    await expect(talksPage.favorite).toHaveAttribute('aria-pressed', 'true');

    await favoritesPage.goto();
    await expect(favoritesPage.talkNamed(title)).toBeVisible();
  }
});
