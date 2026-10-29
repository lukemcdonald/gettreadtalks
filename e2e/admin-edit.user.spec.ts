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

test('Admin edit / Study tab url and close after a second talk', async ({
  talksPage,
}) => {
  await talksPage.goto();
  await talksPage.openTalkAt(0);
  await talksPage.openAdminEdit();
  await expect(talksPage.editDrawer).toBeVisible();
  await expect(talksPage.studyPanel).toHaveCount(0);
  await expect(talksPage.page).toHaveURL(/\/talks\/edit\/[^/]+$/u);

  await talksPage.openStudyTab();
  await expect(talksPage.studyPanel).toBeVisible();
  await expect(talksPage.page).toHaveURL(/\/talks\/edit\/[^/]+\/study$/u);

  const firstTalkId = talksPage.getEditTalkId();
  await talksPage.closeEditDrawer();
  await expect(talksPage.editDrawer).toHaveCount(0);

  await talksPage.goto();
  await talksPage.openTalkAt(1);
  await talksPage.openAdminEdit();
  await expect(talksPage.editDrawer).toBeVisible();
  const secondTalkId = talksPage.getEditTalkId();
  await talksPage.closeEditDrawer();
  await expect(talksPage.editDrawer).toHaveCount(0);

  await talksPage.gotoStudy(firstTalkId);
  await expect(talksPage.editDrawer).toBeVisible();
  await expect(talksPage.studyPanel).toBeVisible();
  await expect(talksPage.page).toHaveURL(
    new RegExp(`/talks/edit/${firstTalkId}/study$`, 'u')
  );

  await talksPage.gotoStudy(secondTalkId);
  await expect(talksPage.editDrawer).toBeVisible();
  await expect(talksPage.studyPanel).toBeVisible();
  await talksPage.closeEditDrawer();
  await expect(talksPage.editDrawer).toHaveCount(0);
  await expect(talksPage.page).not.toHaveURL(/\/talks\/edit\//u);
});
