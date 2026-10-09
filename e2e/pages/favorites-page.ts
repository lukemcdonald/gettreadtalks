import type { Page } from '@playwright/test';

export class FavoritesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/account/favorites');
  }

  talkNamed(title: string) {
    return this.page.getByRole('link', { exact: true, name: title });
  }
}
