import { mkdir } from 'node:fs/promises';

import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

const SHOTS = 'test-results/pr-assets';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Admin talks / Study filter', async ({ page }) => {
  await mkdir(SHOTS, { recursive: true });

  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto('/manage/talks');
  await expect(
    page.getByRole('heading', { name: 'Manage Talks' })
  ).toBeVisible();

  const studyFilter = page.getByLabel('Study', { exact: true });
  await expect(studyFilter).toBeVisible();
  await studyFilter.click();
  await expect(page.getByRole('option', { name: 'Draft' })).toBeVisible();
  await page.screenshot({
    path: `${SHOTS}/study-filter-open-desktop.png`,
  });

  await page.keyboard.press('Escape');
  await page.setViewportSize({ height: 844, width: 390 });
  await studyFilter.click();
  await expect(page.getByRole('option', { name: 'Draft' })).toBeVisible();
  await page.screenshot({
    path: `${SHOTS}/study-filter-open-mobile.png`,
  });

  await page.getByRole('option', { name: 'Draft' }).click();
  await expect(page).toHaveURL(/[?&]study=draft(?:&|$)/u);
  await expect(page.getByText('Sample Sermon on Romans 8')).toBeVisible();
  await page.screenshot({
    path: `${SHOTS}/study-filter-draft-mobile.png`,
  });

  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto('/manage/talks?study=draft');
  await expect(
    page.getByRole('heading', { name: 'Manage Talks' })
  ).toBeVisible();
  await expect(page.getByText('Sample Sermon on Romans 8')).toBeVisible();
  await expect(studyFilter).toHaveText('Draft');
  await page.screenshot({
    path: `${SHOTS}/study-filter-draft-desktop.png`,
  });
});
