import { PREVIEW_SPEAKERS, PREVIEW_TOPICS } from '../convex/previewFixtures.ts';
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

  await page.goto(`/speakers/${PREVIEW_SPEAKERS.JOHN_DOE.slug}`);

  await expect(speakersPage.speakerHeading).toHaveText(
    `${PREVIEW_SPEAKERS.JOHN_DOE.firstName} ${PREVIEW_SPEAKERS.JOHN_DOE.lastName}`
  );

  await expect(page.getByRole('region', { name: 'Topics' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: PREVIEW_TOPICS.GRACE.title })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: PREVIEW_TOPICS.PRAYER.title })
  ).toBeVisible();
});
