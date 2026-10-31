import type { Locator, Page } from '@playwright/test';

export class CollectionsPage {
  readonly firstCollection: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.firstCollection = page
      .getByRole('link')
      .and(page.getByTestId('collection-card'))
      .first();
  }

  async openFirst() {
    await this.firstCollection.click();
  }
}
