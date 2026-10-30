import { PREVIEW_TALKS } from '../convex/previewFixtures.ts';
import { expect, talkPath, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

// fallow-ignore-next-line weakened-tests -- signed-in e2e specs skip without credentials
test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Admin can save a talk transcript', async ({ talksPage }) => {
  await talksPage.page.goto(talkPath(PREVIEW_TALKS.ROMANS_8));
  await talksPage.openAdminEdit();

  await talksPage.openTranscriptTab();

  const transcript = talksPage.page.getByTestId('talk-transcript');
  const savedText = `E2E transcript ${Date.now()}`;

  await transcript.fill(savedText);
  await talksPage.page.getByTestId('save-transcript').click();

  const talkId = talksPage.getEditTalkId();
  await talksPage.page.goto(`/talks/edit/${talkId}/transcript`);

  await expect(transcript).toHaveValue(savedText);
});
