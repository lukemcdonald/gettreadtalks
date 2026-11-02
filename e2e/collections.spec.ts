import { expect, test } from './fixtures/index.ts';

test('User can browse collections and open one', async ({
  collectionsPage,
  homePage,
}) => {
  await homePage.goto();
  await homePage.navCollections.click();
  await collectionsPage.openFirst();

  await expect(collectionsPage.page).toHaveURL(/\/collections\/[^/]+$/u);
});
