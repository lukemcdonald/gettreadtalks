import type { Locator, Page } from '@playwright/test';

export class CollectionsPage {
  readonly collectionHeading: Locator;
  readonly firstCollection: Locator;
  readonly heading: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.collectionHeading = page.getByRole('heading', { level: 1 });
    this.firstCollection = page
      .getByRole('link')
      .and(page.getByTestId('collection-card'))
      .first();
    this.heading = page.getByRole('heading', {
      exact: true,
      level: 1,
      name: 'Collections',
    });
  }

  async openFirst() {
    await this.firstCollection.click();
  }
}
