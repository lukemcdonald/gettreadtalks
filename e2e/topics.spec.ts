import { expect, test } from './fixtures/index.ts';

test('Topics / Browse and open a topic', async ({ homePage, topicsPage }) => {
  await homePage.goto();
  await homePage.navTopics.click();

  await expect(topicsPage.heading).toBeVisible();

  await topicsPage.openFirst();

  await expect(topicsPage.page).toHaveURL(/\/topics\/[^/]+$/u);
  await expect(topicsPage.topicHeading).toBeVisible();
});
