import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('PR assets / admin edit talk has no description field', async ({
  talksPage,
}) => {
  await talksPage.goto();
  await talksPage.openFirst();
  await expect(talksPage.talkHeading).toBeVisible();
  await talksPage.openAdminEdit();
  await expect(talksPage.editSheet).toBeVisible();
  await expect(talksPage.page.getByLabel('Description')).toHaveCount(0);
  await talksPage.page.screenshot({
    path: 'test-results/pr-assets/admin-edit-talk.png',
  });
});
