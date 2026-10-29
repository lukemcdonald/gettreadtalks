import { PREVIEW_TOPIC_GRACE } from '../convex/previewFixtures.ts';
import { expect, test } from './fixtures/index.ts';

test('Search / Site-wide', async ({ homePage, searchPage }) => {
  await homePage.goto();
  await searchPage.searchFor(PREVIEW_TOPIC_GRACE.slug);

  await expect(
    searchPage.dropdownResult(PREVIEW_TOPIC_GRACE.title)
  ).toBeVisible();
  await expect(searchPage.viewAll).toBeHidden();

  await searchPage.goto(PREVIEW_TOPIC_GRACE.slug);

  await expect(searchPage.heading).toBeVisible();
  await expect(searchPage.result(PREVIEW_TOPIC_GRACE.title)).toBeVisible();
});

test('Search / Keyboard shortcut', async ({ homePage, searchPage }) => {
  await homePage.goto();
  await expect(
    searchPage.page.getByRole('button', { name: 'Search' })
  ).toBeEnabled();
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

  await expect(
    searchPage.page.getByRole('heading', { name: 'Search' })
  ).toBeVisible();
  await expect(searchPage.dropdownResult('Talks')).toBeVisible();
  await expect(searchPage.dropdownResult('Collections')).toBeVisible();

  await searchPage.input.fill(PREVIEW_TOPIC_GRACE.slug);
  await expect(
    searchPage.dropdownResult(PREVIEW_TOPIC_GRACE.title)
  ).toBeVisible();
  await expect(searchPage.viewAll).toBeHidden();
});

test('Search / Keeps query on dismiss and clears after navigate', async ({
  homePage,
  searchPage,
}) => {
  await homePage.goto();
  await searchPage.searchFor(PREVIEW_TOPIC_GRACE.slug);
  await expect(
    searchPage.dropdownResult(PREVIEW_TOPIC_GRACE.title)
  ).toBeVisible();

  await searchPage.input.press('Escape');
  await searchPage.open();
  await expect(searchPage.input).toHaveValue(PREVIEW_TOPIC_GRACE.slug);

  await searchPage.dropdownResult(PREVIEW_TOPIC_GRACE.title).click();
  await expect(searchPage.page).toHaveURL(
    new RegExp(`/topics/${PREVIEW_TOPIC_GRACE.slug}`, 'u')
  );

  await searchPage.open();
  await expect(searchPage.input).toHaveValue('');
});
