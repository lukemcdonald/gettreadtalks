import type { Locator, Page } from '@playwright/test';

export class AiPage {
  readonly copyUrl: Locator;
  readonly heading: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.copyUrl = page.getByTestId('copy-mcp-url');
    this.heading = page.getByRole('heading', {
      exact: true,
      level: 1,
      name: 'Ask AI about TREAD talks',
    });
  }

  async goto() {
    await this.page.goto('/ai');
  }
}
