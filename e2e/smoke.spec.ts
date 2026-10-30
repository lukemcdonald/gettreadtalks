import { expect, test } from './fixtures/index.ts';

test('Home shows talks entry', { tag: '@smoke' }, async ({ homePage }) => {
  await homePage.goto();

  await expect(homePage.browseTalks).toBeVisible();
});

test(
  'User can open a published talk',
  { tag: '@smoke' },
  async ({ talksPage }) => {
    await talksPage.goto();
    await talksPage.openFirst();

    await expect(talksPage.page).toHaveURL(/\/talks\/[^/]+\/[^/]+/u);
    await expect(talksPage.page.getByTestId('talk-heading')).toBeVisible();
  }
);

test(
  'Search returns results',
  { tag: '@smoke' },
  async ({ searchPage, talksPage }) => {
    await talksPage.goto();
    await talksPage.openFirst();

    const title = await talksPage.page
      .getByTestId('talk-heading')
      .textContent();
    const query = title?.trim() ?? '';
    expect(query.length).toBeGreaterThan(0);

    await searchPage.goto(query);

    await expect(
      searchPage.page.getByTestId('search-result').first()
    ).toBeVisible();
  }
);
