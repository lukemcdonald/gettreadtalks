import type { Locator, Page } from '@playwright/test';

export class NotFoundPage {
  readonly heading: Locator;
  readonly page: Page;
  readonly trySearching: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: '404' });
    this.trySearching = page.getByRole('button', { name: 'Try searching' });
  }

  async gotoUnknown() {
    const response = await this.page.goto('/this-page-does-not-exist');

    return response;
  }
}
