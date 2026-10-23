import { expect, test } from './fixtures/index.ts';

test('Home / Renders catalog', { tag: '@smoke' }, async ({ homePage }) => {
  await homePage.goto();

  await expect(homePage.browseTalks).toBeVisible();
  await expect(
    homePage.page.getByRole('link').and(homePage.page.getByTestId('talk-card'))
  ).not.toHaveCount(0);
});

test(
  'Talks / Opens a published talk',
  { tag: '@smoke' },
  async ({ talksPage }) => {
    await talksPage.goto();
    await expect(talksPage.firstTalk).toBeVisible();

    await talksPage.openFirst();

    await expect(talksPage.page).toHaveURL(/\/talks\/[^/]+\/[^/]+/u);
    await expect(
      talksPage.page.getByTestId('talk-heading').or(talksPage.talkHeading)
    ).toBeVisible();
  }
);

test(
  'Search / Returns results',
  { tag: '@smoke' },
  async ({ searchPage, talksPage }) => {
    await talksPage.goto();
    await expect(talksPage.firstTalk).toBeVisible();

    const title = await talksPage.firstTalk.textContent();
    const query = title?.trim() ?? '';
    expect(query.length).toBeGreaterThan(0);

    await searchPage.goto(query);

    await expect(
      searchPage.page
        .getByTestId('search-result')
        .or(searchPage.page.getByRole('link', { name: query }))
        .first()
    ).toBeVisible();
  }
);
