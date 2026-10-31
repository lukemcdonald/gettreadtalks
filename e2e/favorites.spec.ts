import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  getE2eUser,
} from './fixtures/user-credentials.ts';

const user = getE2eUser();

test('Signed-out user is redirected from favorites', async ({
  favoritesPage,
}) => {
  await favoritesPage.goto();

  await expect(favoritesPage.page).toHaveURL(/\/login\?redirect=/u);
});

test('User can sign in from favorites redirect', async ({
  authPage,
  favoritesPage,
}) => {
  test.skip(!user, E2E_USER_SKIP_REASON);

  if (!user) {
    return;
  }

  await favoritesPage.goto();
  await authPage.submit(user.email, user.password);

  await expect(favoritesPage.page).toHaveURL(/\/account\/favorites\/?$/u);
});
