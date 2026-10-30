import { expect, test } from './fixtures/index.ts';

test('Visitor cannot open admin edit', async ({ talksPage }) => {
  await talksPage.goto();
  await talksPage.openFirst();

  await expect(talksPage.adminEdit).toHaveCount(0);

  const publicPath = new URL(talksPage.page.url()).pathname;

  await talksPage.gotoPublicEdit();

  await expect(talksPage.page).toHaveURL(publicPath);
  await expect(talksPage.editDrawer).toHaveCount(0);
});
