import type { Locator, Page } from '@playwright/test';

export class FavoritesPage {
  readonly heading: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', {
      exact: true,
      level: 1,
      name: 'Favorites',
    });
  }

  async goto() {
    await this.page.goto('/account/favorites');
  }

  talkNamed(title: string) {
    return this.page.getByRole('link', { exact: true, name: title });
  }
}
