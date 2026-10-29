import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { PREVIEW_TALKS } from '../convex/previewFixtures.ts';
import { expect, talkPath, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

const SHOT_DIR = 'test-results/517';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Admin edit / Study tab shows a draft preview', async ({ talksPage }) => {
  await talksPage.page.setViewportSize({ height: 1200, width: 1440 });
  await talksPage.page.goto(talkPath(PREVIEW_TALKS.ROMANS_8));
  await talksPage.openAdminEdit();
  await talksPage.openStudyTab();
  await expect(talksPage.studyPanel).toBeVisible();
  await expect(talksPage.page.getByTestId('generate-study')).toBeEnabled();
  await expect(
    talksPage.page.getByRole('textbox', { name: 'Heading' }).first()
  ).toHaveValue('God works in all things');
  await expect(talksPage.page.getByTestId('talk-study-preview')).toBeVisible();
  await expect(
    talksPage.page
      .getByTestId('talk-study-preview')
      .getByRole('heading', { name: 'God works in all things' })
  ).toBeVisible();
  await mkdir(SHOT_DIR, { recursive: true });
  await talksPage.editDrawer.screenshot({
    animations: 'disabled',
    path: path.join(SHOT_DIR, 'study-tab-desktop.png'),
  });
});

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
