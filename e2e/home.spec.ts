import { expect, test } from './fixtures/index.ts';

test('Unknown route shows not found and opens search', async ({
  notFoundPage,
  searchPage,
}) => {
  const response = await notFoundPage.gotoUnknown();

  expect(response?.status()).toBe(404);

  await notFoundPage.trySearching.click();
  await expect(searchPage.input).toBeVisible();
});
