import { expect, test } from './fixtures/index.ts';

test('AI page loads for agents', async ({ aiPage }) => {
  await aiPage.goto();

  await expect(aiPage.page.getByTestId('copy-mcp-url')).toBeVisible();
});
