import { expect, test } from './fixtures/index.ts';

test('Home / Loads', async ({ homePage }) => {
  await homePage.goto();

  await expect(homePage.heading).toBeVisible();
});

test('Not found / Unknown route', async ({ notFoundPage }) => {
  const response = await notFoundPage.gotoUnknown();

  expect(response?.status()).toBe(404);
  await expect(notFoundPage.heading).toBeVisible();
});
