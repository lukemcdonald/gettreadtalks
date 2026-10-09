import type { Locator, Page } from '@playwright/test';

export class TalksPage {
  readonly firstTalk: Locator;
  readonly heading: Locator;
  readonly page: Page;
  readonly playback: Locator;
  readonly search: Locator;
  readonly talkHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstTalk = page
      .getByRole('link')
      .and(page.getByTestId('talk-card'))
      .first();
    this.heading = page.getByRole('heading', {
      exact: true,
      level: 1,
      name: 'Talks',
    });
    this.playback = page.getByRole('button', { name: /^Watch /u });
    this.search = page.getByRole('searchbox', { exact: true, name: 'Search' });
    this.talkHeading = page.getByRole('heading', { level: 1 });
  }

  async goto() {
    await this.page.goto('/talks');
  }

  async openFirst() {
    await this.firstTalk.click();
  }

  async searchFor(query: string) {
    await this.search.fill(query);
  }
}
