import type { Locator, Page } from '@playwright/test';

export class TopicsPage {
  readonly firstTopic: Locator;
  readonly heading: Locator;
  readonly page: Page;
  readonly topicHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstTopic = page.getByTestId('topic-link').first();
    this.heading = page.getByRole('heading', {
      exact: true,
      level: 1,
      name: 'Topics',
    });
    this.topicHeading = page.getByRole('heading', { level: 1 });
  }

  async openFirst() {
    await this.firstTopic.click();
  }
}
