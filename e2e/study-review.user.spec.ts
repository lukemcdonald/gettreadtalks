import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test.use({ viewport: { height: 900, width: 1280 } });

test('Admin study review screenshots', async ({ page }) => {
  await page.goto('/manage/talks');
  await page.getByRole('link', { name: 'Sample Sermon on Romans 8' }).click();
  await expect(page.getByRole('heading', { name: 'Edit Talk' })).toBeVisible();

  const studyLink = page.getByRole('link', { name: /Study/u });
  await expect(studyLink).toBeVisible();
  await studyLink.scrollIntoViewIfNeeded();

  const talkSheet = page.getByRole('dialog', { name: 'Edit Talk' });
  await talkSheet.screenshot({
    path: 'test-results/pr-assets/talk-edit-study-row.png',
  });

  await studyLink.click();
  await expect(page.getByRole('heading', { name: 'Edit Study' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Publish' })).toBeVisible();

  const studySheet = page.getByRole('dialog', { name: 'Edit Study' });
  await studySheet.screenshot({
    path: 'test-results/pr-assets/study-drawer-draft.png',
  });

  await page.getByRole('button', { name: 'Publish' }).click();
  await expect(page.getByRole('button', { name: 'Unpublish' })).toBeVisible();
  await studySheet.screenshot({
    path: 'test-results/pr-assets/study-drawer-published.png',
  });
});
