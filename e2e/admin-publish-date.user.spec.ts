import type { TalksPage } from './pages/talks-page.ts';
import type { Page } from '@playwright/test';

import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

const NEWEST_DATE = '2024-06-04';
const PAST_DATE = '2020-01-01';
const SHOT_DIR = 'test-results/pr-shots';
const TALK_PATH = '/talks/mary-smith/example-talk-the-prodigal-son';

async function saveShot(page: Page, name: string) {
  await mkdir(SHOT_DIR, { recursive: true });
  await page.screenshot({
    animations: 'disabled',
    path: path.join(SHOT_DIR, `${name}.png`),
  });
}

async function setPublishDate(talksPage: TalksPage, value: string) {
  await talksPage.page.goto(TALK_PATH);
  await expect(talksPage.talkHeading).toBeVisible();
  await talksPage.openAdminEdit();
  await expect(talksPage.editDrawer).toBeVisible();
  await talksPage.fillPublishDate(value);
  await talksPage.saveChanges();
  await expect(talksPage.editDrawer).toHaveCount(0);
}

// fallow-ignore-next-line weakened-tests -- signed-in e2e specs skip without credentials
test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Admin can set a past publish date and move a talk in archive order', async ({
  talksPage,
}) => {
  await talksPage.page.setViewportSize({ height: 800, width: 1280 });
  await setPublishDate(talksPage, NEWEST_DATE);

  await expect(async () => {
    await talksPage.goto();
    const hrefs = await talksPage.getTalkHrefs();

    expect(hrefs[0]).toBe(TALK_PATH);
  }).toPass();

  await saveShot(talksPage.page, 'archive-before-desktop');

  await talksPage.page.goto(TALK_PATH);
  await expect(talksPage.talkHeading).toBeVisible();
  await talksPage.openAdminEdit();
  await expect(talksPage.editDrawer).toBeVisible();
  await expect(talksPage.publishDate).toBeVisible();
  await talksPage.publishDate.scrollIntoViewIfNeeded();
  await saveShot(talksPage.page, 'edit-publish-date-desktop');

  await talksPage.page.setViewportSize({ height: 844, width: 390 });
  await talksPage.publishDate.scrollIntoViewIfNeeded();
  await saveShot(talksPage.page, 'edit-publish-date-mobile');

  await talksPage.page.setViewportSize({ height: 800, width: 1280 });
  await talksPage.fillPublishDate(PAST_DATE);
  await talksPage.saveChanges();
  await expect(talksPage.editDrawer).toHaveCount(0);

  await expect(async () => {
    await talksPage.goto();
    const hrefsAfter = await talksPage.getTalkHrefs();

    expect(hrefsAfter).toContain(TALK_PATH);
    expect(hrefsAfter[0]).not.toBe(TALK_PATH);
    expect(hrefsAfter.at(-1)).toBe(TALK_PATH);
  }).toPass();

  await saveShot(talksPage.page, 'archive-after-desktop');

  await setPublishDate(talksPage, NEWEST_DATE);

  await expect(async () => {
    await talksPage.goto();
    const hrefsRestored = await talksPage.getTalkHrefs();

    expect(hrefsRestored[0]).toBe(TALK_PATH);
  }).toPass();
});
