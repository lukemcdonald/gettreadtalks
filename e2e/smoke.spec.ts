import { expect, test } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Workout your salvation.' })
  ).toBeVisible();
});

test('browse talks and open a talk', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Browse Talks' }).click();

  await expect(
    page.getByRole('heading', { exact: true, level: 1, name: 'Talks' })
  ).toBeVisible();

  await page
    .getByRole('heading', { level: 3 })
    .getByRole('link')
    .first()
    .click();

  await expect(page).toHaveURL(/\/talks\/[^/]+\/[^/]+/u);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('search talks', async ({ page }) => {
  await page.goto('/talks');
  await page.getByRole('searchbox', { name: 'Search' }).fill('grace');

  await expect(page).toHaveURL(/search=grace/u);
  await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible();
});

test('unknown route shows 404', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
});
