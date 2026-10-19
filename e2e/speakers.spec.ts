import { expect, test } from './fixtures/index.ts';

test('Speakers / Browse and open a speaker', async ({
  homePage,
  speakersPage,
}) => {
  await homePage.goto();
  await homePage.exploreSpeakers.click();

  await expect(speakersPage.heading).toBeVisible();

  await speakersPage.openFirst();

  await expect(speakersPage.page).toHaveURL(/\/speakers\/[^/]+$/u);
  await expect(speakersPage.speakerHeading).toBeVisible();
});

test('Speakers / Published talk topics', async ({ speakersPage }) => {
  const { page } = speakersPage;

  await page.goto('/speakers/john-doe');

  await expect(speakersPage.speakerHeading).toHaveText('John Doe');

  const topicsHeading = page.getByRole('heading', { name: 'Topics' });
  await expect(topicsHeading).toBeVisible();
  await expect(page.getByRole('link', { name: 'Grace' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Prayer' })).toBeVisible();
  await topicsHeading.scrollIntoViewIfNeeded();

  await page.setViewportSize({ height: 900, width: 1440 });
  await page.screenshot({
    fullPage: true,
    path: 'e2e/output/speaker-topics-after-desktop.png',
  });

  await page.setViewportSize({ height: 844, width: 390 });
  await topicsHeading.scrollIntoViewIfNeeded();
  await page.screenshot({
    fullPage: true,
    path: 'e2e/output/speaker-topics-after-mobile.png',
  });
});
