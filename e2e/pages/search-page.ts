import type { Locator, Page } from '@playwright/test';

export class SearchPage {
  readonly cta: Locator;
  readonly heading: Locator;
  readonly input: Locator;
  readonly page: Page;
  readonly pageSearch: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cta = page.getByTestId('search-cta');
    this.heading = page.getByRole('heading', {
      exact: true,
      level: 1,
      name: 'Search',
    });
    this.input = page.getByRole('searchbox', {
      name: 'Search talks, speakers, topics, and clips',
    });
    this.pageSearch = page.getByRole('searchbox', { name: 'Search' });
  }

  dropdownResult(name: string) {
    return this.page.getByRole('option', { name });
  }

  async goto(query?: string) {
    if (query) {
      await this.page.goto(`/search?search=${encodeURIComponent(query)}`);
      return;
    }

    await this.page.goto('/search');
  }

  async open() {
    await this.cta.click();
  }

  result(name: string) {
    return this.page.getByRole('link', { name });
  }

  async searchFor(query: string) {
    await this.open();
    await this.input.fill(query);
  }

  async submit() {
    await this.input.press('Enter');
  }
}
