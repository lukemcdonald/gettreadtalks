import type { Locator, Page } from '@playwright/test';

export class SearchPage {
  readonly input: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.input = page.getByRole('combobox', {
      name: 'Search talks, speakers, topics, and clips',
    });
  }

  async goto(query?: string) {
    if (query) {
      await this.page.goto(`/search?search=${encodeURIComponent(query)}`);

      return;
    }

    await this.page.goto('/search');
  }

  async open() {
    await this.page.getByTestId('search-cta').filter({ visible: true }).click();
    await this.input.waitFor({ state: 'visible' });
  }

  async searchFor(query: string) {
    await this.open();
    await this.input.fill(query);
  }
}
