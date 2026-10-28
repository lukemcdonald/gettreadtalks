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

  await expect(page.getByRole('region', { name: 'Topics' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Grace' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Prayer' })).toBeVisible();
});
