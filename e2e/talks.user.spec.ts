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

  const headingText = await talksPage.page
    .getByTestId('talk-heading')
    .textContent();
  const title = headingText?.trim() ?? '';
  expect(title.length).toBeGreaterThan(0);

  const talkUrl = talksPage.page.url();
  const favoriteCard = favoritesPage.page
    .getByTestId('talk-card')
    .filter({ hasText: title });
  const startedFavorited =
    (await talksPage.favorite.getAttribute('aria-pressed')) === 'true';

  if (!startedFavorited) {
    await talksPage.toggleFavorite();
  }

  await expect(talksPage.favorite).toHaveAttribute('aria-pressed', 'true');

  await favoritesPage.goto();
  await expect(favoriteCard).toBeVisible();

  await talksPage.page.goto(talkUrl);
  await talksPage.toggleFavorite();
  await expect(talksPage.favorite).toHaveAttribute('aria-pressed', 'false');

  await favoritesPage.goto();
  await expect(favoriteCard).toHaveCount(0);

  if (startedFavorited) {
    await talksPage.page.goto(talkUrl);
    await talksPage.toggleFavorite();
    await expect(talksPage.favorite).toHaveAttribute('aria-pressed', 'true');

    await favoritesPage.goto();
    await expect(favoriteCard).toBeVisible();
  }
});
