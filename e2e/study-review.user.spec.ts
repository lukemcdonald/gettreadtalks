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
  await studyLink.click();
  await expect(page.getByRole('heading', { name: 'Edit Study' })).toBeVisible();

  const status = page.getByLabel('Status');
  await expect(status).toContainText('Draft');

  const studySheet = page.getByRole('dialog', { name: 'Edit Study' });
  await studySheet.screenshot({
    path: 'test-results/pr-assets/study-drawer-draft.png',
  });

  await status.click();
  await page.getByRole('option', { name: 'Published' }).click();
  await page.getByRole('button', { name: 'Save Changes' }).click();

  await expect(page.getByRole('heading', { name: 'Edit Talk' })).toBeVisible();
  await expect(studyLink).toContainText('Published');

  await studyLink.click();
  await expect(page.getByRole('heading', { name: 'Edit Study' })).toBeVisible();
  await expect(page.getByLabel('Status')).toContainText('Published');
  await page.getByRole('dialog', { name: 'Edit Study' }).screenshot({
    path: 'test-results/pr-assets/study-drawer-published.png',
  });
});
