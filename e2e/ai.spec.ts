import { expect, test } from './fixtures/index.ts';

test('AI / Loads', async ({ aiPage }) => {
  await aiPage.goto();

  await expect(aiPage.heading).toBeVisible();
  await expect(aiPage.copyUrl).toBeVisible();
  await expect(aiPage.mcpUrl).toBeVisible();
});
