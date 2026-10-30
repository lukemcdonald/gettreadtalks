import { PREVIEW_TOPICS } from '../convex/previewFixtures.ts';
import { expect, test } from './fixtures/index.ts';

test('User can search and open full results', async ({
  homePage,
  searchPage,
}) => {
  await homePage.goto();
  await searchPage.searchFor(PREVIEW_TOPICS.GRACE.title);

  await expect(
    searchPage.page.getByTestId('search-result').first()
  ).toBeVisible();

  await searchPage.goto(PREVIEW_TOPICS.GRACE.title);

  await expect(searchPage.page).toHaveURL(/\/search\?search=/u);
  await expect(
    searchPage.page.getByTestId('search-result').first()
  ).toBeVisible();
});
