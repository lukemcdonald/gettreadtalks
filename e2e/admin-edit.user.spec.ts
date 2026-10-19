import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Admin edit / Signed-in shortcut', async ({ talksPage }) => {
  await talksPage.goto();
  await talksPage.openFirst();
  await expect(talksPage.talkHeading).toBeVisible();

  await expect(talksPage.adminEdit).toBeVisible();
  await talksPage.openAdminEdit();
  await expect(talksPage.editSheet).toBeVisible();
  await expect(talksPage.page).toHaveURL(/\/talks\/edit\//u);
});
