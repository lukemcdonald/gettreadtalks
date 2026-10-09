import { expect, test } from './fixtures/index.ts';

test('Collections / Browse and open a collection', async ({
  collectionsPage,
  homePage,
}) => {
  await homePage.goto();
  await homePage.navCollections.click();

  await expect(collectionsPage.heading).toBeVisible();

  await collectionsPage.openFirst();

  await expect(collectionsPage.page).toHaveURL(/\/collections\/[^/]+$/u);
  await expect(collectionsPage.collectionHeading).toBeVisible();
});
