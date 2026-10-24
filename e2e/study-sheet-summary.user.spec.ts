import type { Page } from '@playwright/test';

import { mkdir } from 'node:fs/promises';

import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

const SHOTS = 'test-results/pr-assets';
const TALK_WITH_TRANSCRIPT = 'Sample Sermon on Romans 8';
const TALK_WITHOUT_TRANSCRIPT = 'Sample Talk: The Lord Is My Shepherd';
const GENERATE_TIMEOUT_MS = 120_000;

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

async function openTalkStudy(page: Page, talkTitle: string) {
  await page.goto('/manage/talks');
  await expect(
    page.getByRole('heading', { name: 'Manage Talks' })
  ).toBeVisible();
  await page.getByRole('link', { exact: true, name: talkTitle }).click();
  await expect(page.getByRole('heading', { name: 'Edit Talk' })).toBeVisible();
  await page.getByRole('link', { name: /^Study/u }).click();
  await expect(page.getByRole('heading', { name: 'Edit Study' })).toBeVisible();
}

async function saveShot(page: Page, name: string) {
  await page.screenshot({ path: `${SHOTS}/${name}` });
}

test('Admin study / Generate summary screenshots', async ({ page }) => {
  await mkdir(SHOTS, { recursive: true });

  await page.setViewportSize({ height: 900, width: 1440 });
  await openTalkStudy(page, TALK_WITHOUT_TRANSCRIPT);
  await expect(
    page.getByRole('button', { name: 'Get transcript' })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Generate summary' })
  ).toHaveCount(0);
  await saveShot(page, 'no-transcript-desktop.png');

  await page.setViewportSize({ height: 844, width: 390 });
  await expect(page.getByRole('heading', { name: 'Edit Study' })).toBeVisible();
  await saveShot(page, 'no-transcript-mobile.png');

  await page.setViewportSize({ height: 900, width: 1440 });
  await openTalkStudy(page, TALK_WITH_TRANSCRIPT);
  const generate = page.getByRole('button', { name: 'Generate summary' });
  const summary = page.getByLabel('Summary');
  await expect(generate).toBeVisible();
  await expect(page.getByRole('button', { name: 'Re-fetch' })).toBeVisible();
  await expect(page.getByText('Transcript saved')).toBeVisible();
  const beforeSummary = await summary.inputValue();
  expect(beforeSummary.length).toBeGreaterThan(0);
  await saveShot(page, 'before-generate-desktop.png');

  await page.setViewportSize({ height: 844, width: 390 });
  await expect(page.getByRole('heading', { name: 'Edit Study' })).toBeVisible();
  await saveShot(page, 'before-generate-mobile.png');

  await page.setViewportSize({ height: 900, width: 1440 });
  await generate.click();
  await expect(generate).toBeEnabled({ timeout: GENERATE_TIMEOUT_MS });
  const status = page.getByTestId('generate-summary-status');

  if (await status.isVisible()) {
    const message = (await status.textContent()) ?? '';
    expect(message).not.toMatch(/AI_GATEWAY|stack|ConvexError/iu);
    await saveShot(page, 'error-desktop.png');
    await page.setViewportSize({ height: 844, width: 390 });
    await expect(status).toBeVisible();
    await saveShot(page, 'error-mobile.png');
    throw new Error(`Generate summary failed: ${message}`);
  }

  await expect(summary).not.toHaveValue(beforeSummary, { timeout: 15_000 });
  await expect(page.getByLabel('Status')).toContainText('Draft');
  await saveShot(page, 'after-generate-desktop.png');

  await page.setViewportSize({ height: 844, width: 390 });
  await expect(summary).not.toHaveValue(beforeSummary);
  await saveShot(page, 'after-generate-mobile.png');
});
