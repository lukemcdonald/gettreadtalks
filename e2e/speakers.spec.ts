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
