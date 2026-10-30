import type { Locator, Page } from '@playwright/test';

export class TalksPage {
  readonly adminEdit: Locator;
  readonly createDrawer: Locator;
  readonly editDrawer: Locator;
  readonly favorite: Locator;
  readonly firstTalk: Locator;
  readonly newTalk: Locator;
  readonly page: Page;
  readonly publishDate: Locator;
  readonly search: Locator;
  readonly studyPanel: Locator;
  readonly studyTab: Locator;
  readonly talkCards: Locator;
  readonly transcriptTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminEdit = page.getByTestId('admin-edit');
    this.createDrawer = page.getByTestId('create-talk-drawer').filter({
      visible: true,
    });
    this.editDrawer = page.getByTestId('edit-talk-drawer').filter({
      visible: true,
    });
    this.favorite = page.getByTestId('favorite-talk');
    this.newTalk = page.getByTestId('new-talk');
    this.publishDate = this.editDrawer.getByTestId('publish-date');
    this.search = page.getByRole('searchbox', { name: 'Search' });
    this.studyPanel = this.editDrawer.getByTestId('edit-talk-study-panel');
    this.studyTab = this.editDrawer.getByTestId('edit-talk-tab-study');
    this.talkCards = page.getByRole('link').and(page.getByTestId('talk-card'));
    this.firstTalk = this.talkCards.first();
    this.transcriptTab = this.editDrawer.getByTestId(
      'edit-talk-tab-transcript'
    );
  }

  async closeEditDrawer() {
    await this.editDrawer.getByRole('button', { name: 'Close' }).click();
  }

  async fillCreateTalk({
    mediaUrl,
    speakerQuery,
    title,
  }: {
    mediaUrl: string;
    speakerQuery: string;
    title: string;
  }) {
    await this.createDrawer.getByLabel('Title').fill(title);
    await this.createDrawer
      .getByPlaceholder('Search speakers...')
      .fill(speakerQuery);
    await this.page.getByRole('option').first().click();
    await this.createDrawer.getByLabel('Media URL').fill(mediaUrl);
  }

  async fillPublishDate(value: string) {
    await this.publishDate.fill(value);
  }

  async gotoManageTalks() {
    await this.page.goto('/manage/talks');
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

  async getTalkHrefs() {
    const hrefs = await this.talkCards.evaluateAll((cards) =>
      cards.map((card) => card.getAttribute('href') ?? '')
    );

    return hrefs;
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

  async openNewTalk() {
    await this.newTalk.click();
  }

  async openStudyTab() {
    await this.studyTab.click();
  }

  async openTranscriptTab() {
    await this.transcriptTab.click();
  }

  async openTalkAt(index: number) {
    await this.talkCards.nth(index).click();
    await this.page.waitForURL(/\/talks\/[^/]+\/[^/]+$/u);
  }

  async saveChanges() {
    await this.waitForServerAction(() =>
      this.editDrawer.getByRole('button', { name: 'Save Changes' }).click()
    );
  }

  async searchFor(query: string) {
    await this.search.fill(query);
  }

  async submitCreateTalk() {
    await this.waitForServerAction(() =>
      this.createDrawer.getByTestId('form-sheet-submit').click()
    );
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

  async waitForServerAction(action: () => Promise<void>) {
    const completed = this.page.waitForResponse((response) => {
      const request = response.request();
      const isMutation =
        request.method() === 'POST' &&
        Boolean(request.headers()['next-action']);

      return isMutation;
    });

    await action();
    await completed;
  }
}
