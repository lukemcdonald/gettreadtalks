import { PREVIEW_SPEAKERS, PREVIEW_TALKS } from '../convex/previewFixtures.ts';
import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Admin can create a talk and open the transcript tab', async ({
  talksPage,
}) => {
  await talksPage.gotoManageTalks();
  await talksPage.openNewTalk();

  await talksPage.fillCreateTalk({
    mediaUrl: PREVIEW_TALKS.ROMANS_8.mediaUrl,
    speakerQuery: PREVIEW_SPEAKERS.JOHN_DOE.firstName,
    title: `E2E create ${Date.now()}`,
  });
  await talksPage.submitCreateTalk();

  await expect(talksPage.page).toHaveURL(/\/talks\/edit\/[^/?]+/u);
  await talksPage.openTranscriptTab();
  await expect(talksPage.page.getByTestId('talk-transcript')).toBeVisible();
});

test('Signed-in admin can open edit from a talk page', async ({
  talksPage,
}) => {
  await talksPage.goto();
  await talksPage.openFirst();
  await talksPage.openAdminEdit();

  await expect(talksPage.page).toHaveURL(/\/talks\/edit\//u);
  await expect(talksPage.editDrawer).toBeVisible();
});

test('Admin study tab deep link opens the study panel', async ({
  talksPage,
}) => {
  await talksPage.goto();
  await talksPage.openFirst();
  await talksPage.openAdminEdit();
  await talksPage.openStudyTab();

  await expect(talksPage.page).toHaveURL(/\/talks\/edit\/[^/]+\/study$/u);

  const talkId = talksPage.getEditTalkId();
  await talksPage.closeEditDrawer();
  await talksPage.gotoStudy(talkId);

  await expect(talksPage.studyPanel).toBeVisible();
});
