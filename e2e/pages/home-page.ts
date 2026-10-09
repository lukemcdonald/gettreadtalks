import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly browseTalks: Locator;
  readonly exploreSpeakers: Locator;
  readonly heading: Locator;
  readonly navCollections: Locator;
  readonly navTopics: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.browseTalks = page.getByTestId('hero-primary');
    this.exploreSpeakers = page.getByTestId('hero-secondary');
    this.heading = page.getByRole('heading', {
      name: 'Workout your salvation.',
    });
    this.navCollections = page.getByTestId('nav-collections');
    this.navTopics = page.getByTestId('nav-topics');
  }

  async goto() {
    await this.page.goto('/');
  }
}
