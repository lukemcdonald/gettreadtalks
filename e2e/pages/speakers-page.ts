import type { Locator, Page } from '@playwright/test';

export class SpeakersPage {
  readonly firstSpeaker: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.firstSpeaker = page
      .getByRole('link')
      .and(page.getByTestId('speaker-card'))
      .first();
  }

  async openFirst() {
    await this.firstSpeaker.click();
  }
}
