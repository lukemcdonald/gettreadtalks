import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  getE2eUser,
} from './fixtures/user-credentials.ts';

const user = getE2eUser();

test.skip(!user, E2E_USER_SKIP_REASON);

test('Auth / Log in', async ({ authPage, homePage }) => {
  if (!user) {
    return;
  }

  await homePage.goto();
  await authPage.signIn.click();
  await authPage.submit(user.email, user.password);

  await expect(authPage.page).toHaveURL(/\/account\/?$/u);
  await expect(authPage.accountMenu).toBeVisible();
  await expect(authPage.signIn).toHaveCount(0);
});

test('Auth / Log out', async ({ authPage, homePage }) => {
  if (!user) {
    return;
  }

  await homePage.goto();
  await authPage.signIn.click();
  await authPage.submit(user.email, user.password);
  await expect(authPage.accountMenu).toBeVisible();

  await authPage.logOut();

  await expect(authPage.page).toHaveURL('/');
  await expect(authPage.signIn).toBeVisible();
  await expect(authPage.accountMenu).toHaveCount(0);
});
