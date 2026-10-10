import type { Locator, Page } from '@playwright/test';

export class AiPage {
  readonly copyUrl: Locator;
  readonly heading: Locator;
  readonly mcpUrl: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.copyUrl = page.getByTestId('copy-mcp-url');
    this.heading = page.getByRole('heading', {
      exact: true,
      level: 1,
      name: 'Ask AI about TREAD talks',
    });
    this.mcpUrl = page.getByText('https://www.gettreadtalks.com/mcp', {
      exact: true,
    });
  }

  async goto() {
    await this.page.goto('/ai');
  }
}
