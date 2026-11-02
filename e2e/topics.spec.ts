import { expect, test } from './fixtures/index.ts';

test('User can browse topics and open one', async ({
  homePage,
  topicsPage,
}) => {
  await homePage.goto();
  await homePage.navTopics.click();
  await topicsPage.openFirst();

  await expect(topicsPage.page).toHaveURL(/\/topics\/[^/]+$/u);
});
