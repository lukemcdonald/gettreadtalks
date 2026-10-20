import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  getE2eUser,
} from './fixtures/user-credentials.ts';

const user = getE2eUser();

test('Favorites / Signed out redirects to login', async ({
  authPage,
  favoritesPage,
}) => {
  await favoritesPage.goto();

  await expect(favoritesPage.page).toHaveURL(/\/login\?redirect=/u);
  await authPage.email.fill('user@example.com');
});

test('Favorites / Sign in returns to favorites', async ({
  authPage,
  favoritesPage,
}) => {
  test.skip(!user, E2E_USER_SKIP_REASON);

  if (!user) {
    return;
  }

  await favoritesPage.goto();
  await expect(authPage.page).toHaveURL(/\/login\?redirect=/u);
  await authPage.submit(user.email, user.password);

  await expect(authPage.page).toHaveURL(/\/account\/favorites\/?$/u);
  await expect(favoritesPage.heading).toBeVisible();
  await expect(authPage.accountMenu).toBeVisible();
});
