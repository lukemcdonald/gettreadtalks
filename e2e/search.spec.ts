import { expect, test } from './fixtures/index.ts';

test('Search / Site-wide', async ({ homePage, searchPage }) => {
  await homePage.goto();
  await searchPage.searchFor('grace');

  await expect(searchPage.dropdownResult('Grace')).toBeVisible();

  await searchPage.viewAll.click();

  await expect(searchPage.page).toHaveURL(/\/search\?search=grace/u);
  await expect(searchPage.heading).toBeVisible();
  await expect(searchPage.result('Grace')).toBeVisible();
});

test('Search / Keyboard shortcut', async ({ homePage, searchPage }) => {
  await homePage.goto();
  await searchPage.page.keyboard.press('ControlOrMeta+K');

  await expect(searchPage.input).toBeVisible();
  await expect(searchPage.dropdownResult('Talks')).toBeVisible();

  await searchPage.page.keyboard.press('ControlOrMeta+K');

  await expect(searchPage.input).toBeHidden();
});

test('Search / Mobile drawer', async ({ homePage, searchPage }) => {
  await searchPage.page.setViewportSize({ height: 844, width: 390 });
  await homePage.goto();
  await searchPage.open();

  await expect(searchPage.cancel).toBeVisible();
  await expect(searchPage.dropdownResult('Talks')).toBeVisible();
  await expect(searchPage.dropdownResult('Collections')).toBeVisible();

  await searchPage.input.fill('grace');
  await expect(searchPage.dropdownResult('Grace')).toBeVisible();

  await searchPage.viewAll.click();
  await expect(searchPage.page).toHaveURL(/\/search\?search=grace/u);
});

test('Search / Keeps query on dismiss and clears after navigate', async ({
  homePage,
  searchPage,
}) => {
  await homePage.goto();
  await searchPage.searchFor('grace');
  await expect(searchPage.dropdownResult('Grace')).toBeVisible();

  await searchPage.input.press('Escape');
  await searchPage.open();
  await expect(searchPage.input).toHaveValue('grace');

  await searchPage.viewAll.click();
  await expect(searchPage.page).toHaveURL(/\/search\?search=grace/u);

  await searchPage.open();
  await expect(searchPage.input).toHaveValue('');
});
