import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  getE2eUser,
} from './fixtures/user-credentials.ts';

const user = getE2eUser();

test.skip(!user, E2E_USER_SKIP_REASON);

test('User can sign in and log out', async ({ authPage, homePage }) => {
  if (!user) {
    return;
  }

  await homePage.goto();
  await authPage.signIn.click();
  await authPage.submit(user.email, user.password);

  await expect(authPage.page).toHaveURL(/\/account\/?$/u);

  await authPage.logOut();

  await expect(authPage.page).toHaveURL('/');
  await expect(authPage.signIn).toBeVisible();
});
