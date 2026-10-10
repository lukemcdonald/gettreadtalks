import { expect, test } from './fixtures/index.ts';

test('Search / Site-wide', async ({ homePage, searchPage }) => {
  await homePage.goto();
  await searchPage.searchFor('grace');

  await expect(searchPage.dropdownResult('Grace')).toBeVisible();

  await searchPage.submit();

  await expect(searchPage.page).toHaveURL(/\/search\?search=grace/u);
  await expect(searchPage.heading).toBeVisible();
  await expect(searchPage.result('Grace')).toBeVisible();
});
