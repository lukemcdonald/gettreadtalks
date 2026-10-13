import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Admin edit / Signed-in shortcut', async ({ page, talksPage }) => {
  await page.goto('/account');
  await expect(page.getByText('Profile settings')).toBeVisible();

  const isAdmin = await page
    .getByRole('heading', { name: 'Content Management' })
    .isVisible();

  await talksPage.goto();
  await talksPage.openFirst();
  await expect(talksPage.talkHeading).toBeVisible();

  if (isAdmin) {
    await expect(talksPage.adminEdit).toBeVisible();
    await talksPage.openAdminEdit();
    await expect(talksPage.editSheet).toBeVisible();
    await expect(talksPage.page).toHaveURL(/\/talks\/edit\//u);
  } else {
    await expect(talksPage.adminEdit).toHaveCount(0);
  }
});
