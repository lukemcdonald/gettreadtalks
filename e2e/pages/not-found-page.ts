import type { Locator, Page } from '@playwright/test';

export class NotFoundPage {
  readonly heading: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: '404' });
  }

  async gotoUnknown() {
    const response = await this.page.goto('/this-page-does-not-exist');

    return response;
  }
}
