import type { Locator, Page } from '@playwright/test';

export class TopicsPage {
  readonly firstTopic: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.firstTopic = page.getByTestId('topic-link').first();
  }

  async openFirst() {
    await this.firstTopic.click();
  }
}
