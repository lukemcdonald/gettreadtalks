import type { Locator, Page } from '@playwright/test';

export class AuthPage {
  readonly accountMenu: Locator;
  readonly email: Locator;
  readonly page: Page;
  readonly password: Locator;
  readonly signIn: Locator;
  readonly signInSubmit: Locator;
  readonly signOut: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountMenu = page
      .getByTestId('account-menu')
      .filter({ visible: true });
    this.email = page
      .getByRole('textbox', { name: /email address/iu })
      .filter({ visible: true });
    this.password = page.getByLabel(/^password/iu).filter({ visible: true });
    this.signIn = page.getByTestId('sign-in').filter({ visible: true });
    this.signInSubmit = page
      .getByTestId('sign-in-submit')
      .filter({ visible: true });
    this.signOut = page.getByTestId('sign-out');
  }

  async gotoLogin() {
    await this.page.goto('/login');
  }

  async logOut() {
    await this.accountMenu.click();
    await this.signOut.click();
  }

  async submit(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signInSubmit.click();
  }
}
