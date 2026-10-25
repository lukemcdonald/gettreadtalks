import type { Page } from '@playwright/test';

import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

const SHOT_DIR = 'test-results/301';

async function saveShot(page: Page, name: string) {
  await mkdir(SHOT_DIR, { recursive: true });
  await page.screenshot({
    animations: 'disabled',
    path: path.join(SHOT_DIR, `${name}.png`),
  });
}

// fallow-ignore-next-line weakened-tests -- signed-in e2e specs skip without credentials
test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Admin can view and edit a talk transcript', async ({ talksPage }) => {
  await talksPage.page.setViewportSize({ height: 900, width: 1440 });
  await talksPage.page.goto('/talks/john-doe/sample-sermon-on-romans-8');
  await expect(talksPage.talkHeading).toBeVisible();
  await talksPage.openAdminEdit();
  await expect(talksPage.editSheet).toBeVisible();

  await talksPage.page.getByTestId('edit-talk-study').click();

  const viewTranscript = talksPage.page.getByTestId('view-transcript');
  const transcript = talksPage.page.getByTestId('talk-transcript');
  const nextText = `E2E transcript ${Date.now()}`;

  await expect(viewTranscript).toBeVisible();
  await saveShot(talksPage.page, 'study-sheet-desktop');

  await viewTranscript.click();
  await expect(transcript).toBeVisible();
  await expect(transcript).not.toHaveValue('');
  await saveShot(talksPage.page, 'dialog-desktop');

  await transcript.fill(nextText);
  await talksPage.page.getByTestId('save-transcript').click();
  await expect(transcript).toBeHidden();

  await viewTranscript.click();
  await expect(transcript).toHaveValue(nextText);
  await saveShot(talksPage.page, 'dialog-saved-desktop');
  await talksPage.page.keyboard.press('Escape');
  await expect(transcript).toBeHidden();

  await talksPage.page.setViewportSize({ height: 844, width: 390 });
  await saveShot(talksPage.page, 'study-sheet-mobile');

  await viewTranscript.click();
  await expect(transcript).toHaveValue(nextText);
  await saveShot(talksPage.page, 'dialog-saved-mobile');
});
