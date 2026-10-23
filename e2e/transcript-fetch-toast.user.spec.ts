import type { Locator, Page } from '@playwright/test';

import { mkdir, writeFile } from 'node:fs/promises';

import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

const SHOTS = 'test-results/pr-assets';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

async function expectConfirmDialogClosed(page: Page) {
  await expect(
    page.getByRole('heading', { name: 'Fetch this transcript again?' })
  ).toBeHidden();
  await expect(page.locator('[data-slot="alert-dialog-backdrop"]')).toHaveCount(
    0
  );
  await expect(page.locator('[data-slot="alert-dialog-popup"]')).toHaveCount(0);
}

async function openStudy(page: Page, talkName: string) {
  await page.goto('/manage/talks');
  await page.getByRole('link', { name: talkName }).click();
  await expect(page.getByRole('heading', { name: 'Edit Talk' })).toBeVisible();
  await page.getByRole('link', { name: /Study/u }).click();
  await expect(page.getByRole('heading', { name: 'Edit Study' })).toBeVisible();
}

async function startTranscriptFetch(page: Page) {
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

  await expect(page.getByText('Fetching transcript...')).toBeVisible({
    timeout: 90_000,
  });
}

async function waitUntilSettled(locator: Locator) {
  await locator.evaluate(async (element) => {
    await Promise.all(
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished.catch(() => {}))
    );
  });
}

test('toast after the study sheet closes', async ({ page }) => {
  await mkdir(SHOTS, { recursive: true });
  await page.setViewportSize({ height: 800, width: 1280 });
  await openStudy(page, 'Sample Talk: The Lord Is My Shepherd');
  await startTranscriptFetch(page);
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('heading', { name: 'Edit Talk' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();

  const openButton = page.getByRole('button', { name: 'Open' });
  const toastTitle = page.locator('[data-slot="toast-title"]');
  await expect(toastTitle).toBeVisible({ timeout: 90_000 });
  await expect(openButton).toBeVisible();
  await waitUntilSettled(page.locator('[data-slot="toast-viewport"]'));
  await expect(openButton).toBeInViewport({ ratio: 1 });
  await expect(toastTitle).toBeInViewport({ ratio: 1 });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  const toastTitleText = await toastTitle.textContent();
  const title = toastTitleText?.trim() ?? '';
  await writeFile(`${SHOTS}/toast-kind.txt`, `${title}\n`);

  await page.screenshot({
    animations: 'disabled',
    path: `${SHOTS}/toast-after-close-desktop-v2.png`,
  });

  await toastTitle.hover();
  await page.setViewportSize({ height: 844, width: 390 });
  await expect(toastTitle).toBeVisible();
  await waitUntilSettled(page.locator('[data-slot="toast-viewport"]'));
  await expect(openButton).toBeInViewport({ ratio: 1 });
  await page.screenshot({
    animations: 'disabled',
    path: `${SHOTS}/toast-after-close-mobile.png`,
  });
});

test('no toast on the study sheet', async ({ page }) => {
  await mkdir(SHOTS, { recursive: true });
  await page.setViewportSize({ height: 800, width: 1280 });
  await openStudy(page, 'Sample Sermon on Romans 8');
  await startTranscriptFetch(page);
  await expectConfirmDialogClosed(page);
  await expect(page.getByText('Transcript saved')).toBeVisible({
    timeout: 90_000,
  });
  await expectConfirmDialogClosed(page);
  await expect(page.getByRole('heading', { name: 'Edit Study' })).toBeVisible();
  await expect(page.locator('[data-slot="toast-title"]')).toHaveCount(0);
  await page.screenshot({
    animations: 'disabled',
    path: `${SHOTS}/no-toast-on-sheet-desktop-v2.png`,
  });
});
