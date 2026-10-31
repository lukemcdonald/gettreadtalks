import type { Page } from '@playwright/test';

export class AiPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/ai');
  }
}
