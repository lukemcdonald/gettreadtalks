import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

// fallow-ignore-next-line weakened-tests -- signed-in e2e specs skip without credentials
test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Admin can view and edit a talk transcript', async ({ talksPage }) => {
  await talksPage.page.goto('/talks/john-doe/sample-sermon-on-romans-8');
  await expect(talksPage.talkHeading).toBeVisible();
  await talksPage.openAdminEdit();
  await expect(talksPage.editSheet).toBeVisible();

  await talksPage.page.getByTestId('edit-talk-study').click();

  const viewTranscript = talksPage.page.getByTestId('view-transcript');
  const transcript = talksPage.page.getByTestId('talk-transcript');
  const nextText = `E2E transcript ${Date.now()}`;

  await viewTranscript.click();
  await expect(transcript).toBeVisible();
  await expect(transcript).not.toHaveValue('');

  await transcript.fill(nextText);
  await talksPage.page.getByTestId('save-transcript').click();
  await expect(transcript).toBeHidden();

  await viewTranscript.click();
  await expect(transcript).toHaveValue(nextText);
});
