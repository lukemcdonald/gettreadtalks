import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { expect, test as setup } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  getE2eUser,
  USER_STORAGE_STATE,
} from './fixtures/user-credentials.ts';

const user = getE2eUser();

setup.skip(!user, E2E_USER_SKIP_REASON);

setup('authenticate', async ({ authPage }) => {
  if (!user) {
    return;
  }

  await mkdir(path.dirname(USER_STORAGE_STATE), { recursive: true });
  await authPage.gotoLogin();
  await authPage.submit(user.email, user.password);
  await expect(authPage.page).toHaveURL(/\/account\/?$/u);
  await expect(authPage.accountMenu).toBeVisible();
  await authPage.page.context().storageState({ path: USER_STORAGE_STATE });
});
