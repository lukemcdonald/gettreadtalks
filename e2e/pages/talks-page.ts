import type { Locator, Page } from '@playwright/test';

export class TalksPage {
  readonly adminEdit: Locator;
  readonly contentTab: Locator;
  readonly editDrawer: Locator;
  readonly editSheet: Locator;
  readonly favorite: Locator;
  readonly firstTalk: Locator;
  readonly heading: Locator;
  readonly page: Page;
  readonly playback: Locator;
  readonly search: Locator;
  readonly studyPanel: Locator;
  readonly studyTab: Locator;
  readonly talkCards: Locator;
  readonly talkHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminEdit = page.getByTestId('admin-edit');
    this.contentTab = page.getByTestId('edit-talk-tab-content');
    this.editDrawer = page.getByTestId('edit-talk-drawer');
    this.editSheet = page.getByRole('heading', { name: 'Edit Talk' });
    this.favorite = page.getByTestId('favorite-talk');
    this.talkCards = page.getByRole('link').and(page.getByTestId('talk-card'));
    this.firstTalk = this.talkCards.first();
    this.heading = page.getByRole('heading', {
      exact: true,
      level: 1,
      name: 'Talks',
    });
    this.playback = page
      .getByRole('button', { name: /^(?:Play|Watch) /u })
      .or(page.getByRole('link', { name: 'Open Media' }))
      .or(page.locator('audio[controls], video[controls]'));
    this.search = page.getByRole('searchbox', { name: 'Search' });
    this.studyPanel = page.getByTestId('edit-talk-study-panel');
    this.studyTab = page.getByTestId('edit-talk-tab-study');
    this.talkHeading = page.getByRole('heading', { level: 1 });
  }

  async closeEditDrawer() {
    await this.editDrawer.getByRole('button', { name: 'Close' }).click();
  }

  getEditTalkId() {
    const talkId = new URL(this.page.url()).pathname.match(
      /\/talks\/edit\/(?<talkId>[^/]+)/u
    )?.groups?.talkId;

    if (!talkId) {
      throw new Error('Expected an edit talk url');
    }

    return talkId;
  }

  async goto() {
    await this.page.goto('/talks');
  }

  async gotoPublicEdit() {
    await this.page.waitForURL(/\/talks\/[^/]+\/[^/]+$/u);
    const url = new URL(this.page.url());
    await this.page.goto(`${url.pathname}/edit`);
  }

  async gotoStudy(talkId: string) {
    await this.page.goto(`/talks/edit/${talkId}/study`);
  }

  async openAdminEdit() {
    await this.adminEdit.click();
  }

  async openFirst() {
    await this.openTalkAt(0);
  }

  async openStudyTab() {
    await this.studyTab.click();
  }

  async openTalkAt(index: number) {
    await this.talkCards.nth(index).click();
    await this.page.waitForURL(/\/talks\/[^/]+\/[^/]+$/u);
  }

  async searchFor(query: string) {
    await this.search.fill(query);
  }

  async toggleFavorite() {
    const revalidated = this.page.waitForResponse((response) => {
      const request = response.request();
      const isRevalidation =
        request.method() === 'POST' &&
        Boolean(request.headers()['next-action']);

      return isRevalidation;
    });

    await this.favorite.click();
    await revalidated;
  }
}
