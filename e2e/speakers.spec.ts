import { PREVIEW_SPEAKERS } from '../convex/previewFixtures.ts';
import { expect, test } from './fixtures/index.ts';

test('User can browse speakers and open one', async ({
  homePage,
  speakersPage,
}) => {
  await homePage.goto();
  await homePage.exploreSpeakers.click();
  await speakersPage.openFirst();

  await expect(speakersPage.page).toHaveURL(/\/speakers\/[^/]+$/u);
});

test('Speaker page lists related topic links', async ({ speakersPage }) => {
  await speakersPage.page.goto(`/speakers/${PREVIEW_SPEAKERS.JOHN_DOE.slug}`);

  await expect(
    speakersPage.page.getByRole('region', { name: 'Topics' }).getByRole('link')
  ).not.toHaveCount(0);
});
