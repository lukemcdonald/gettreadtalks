import { mkdir, writeFile } from 'node:fs/promises';

import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

const SHOTS = 'test-results/pr-assets';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Transcript fetch toast', async ({ page }) => {
  await mkdir(SHOTS, { recursive: true });

  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto('/manage/talks');
  await page.getByRole('link', { name: 'Sample Sermon on Romans 8' }).click();
  await expect(page.getByRole('heading', { name: 'Edit Talk' })).toBeVisible();

  await page.getByRole('link', { name: /Study/u }).click();
  await expect(page.getByRole('heading', { name: 'Edit Study' })).toBeVisible();

  const getTranscript = page.getByRole('button', { name: 'Get transcript' });
  const refetch = page.getByRole('button', { name: 'Re-fetch' });

  if (await refetch.isVisible()) {
    await expect(refetch).toBeEnabled();
    await refetch.click();
    await expect(
      page.getByRole('heading', { name: 'Fetch this transcript again?' })
    ).toBeVisible();
    await page
      .locator('[data-slot="alert-dialog-popup"]')
      .getByRole('button', { name: 'Re-fetch' })
      .click();
  } else {
    await expect(getTranscript).toBeEnabled();
    await getTranscript.click();
  }

  const toastTitle = page.locator('[data-slot="toast-title"]');
  await expect(toastTitle).toBeVisible({ timeout: 90_000 });
  await expect(page.getByRole('button', { name: 'Open' })).toBeVisible();

  const toastTitleText = await toastTitle.textContent();
  const title = toastTitleText?.trim() ?? '';
  await writeFile(`${SHOTS}/toast-kind.txt`, `${title}\n`);

  await page.screenshot({
    path: `${SHOTS}/transcript-fetch-toast-desktop.png`,
  });

  await toastTitle.hover();
  await page.setViewportSize({ height: 844, width: 390 });
  await expect(toastTitle).toBeVisible();
  await page.screenshot({
    path: `${SHOTS}/transcript-fetch-toast-mobile.png`,
  });
});
