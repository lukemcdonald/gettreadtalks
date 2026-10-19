import { expect, test } from './fixtures/index.ts';

test('Admin edit / Visitor cannot edit', async ({ talksPage }) => {
  await talksPage.goto();
  await talksPage.openFirst();

  await expect(talksPage.talkHeading).toBeVisible();
  await expect(talksPage.page).toHaveURL(/\/talks\/[^/]+\/[^/]+$/u);
  await expect(talksPage.adminEdit).toHaveCount(0);

  const publicPath = new URL(talksPage.page.url()).pathname;

  await talksPage.gotoPublicEdit();

  await expect(talksPage.page).toHaveURL(publicPath);
  await expect(talksPage.talkHeading).toBeVisible();
  await expect(talksPage.editSheet).toHaveCount(0);
});
