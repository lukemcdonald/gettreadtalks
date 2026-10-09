import type { Locator, Page } from '@playwright/test';

export class SpeakersPage {
  readonly firstSpeaker: Locator;
  readonly heading: Locator;
  readonly page: Page;
  readonly speakerHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstSpeaker = page
      .getByRole('link')
      .and(page.getByTestId('speaker-card'))
      .first();
    this.heading = page.getByRole('heading', {
      exact: true,
      level: 1,
      name: 'Speakers',
    });
    this.speakerHeading = page.getByRole('heading', { level: 1 });
  }

  async openFirst() {
    await this.firstSpeaker.click();
  }
}
