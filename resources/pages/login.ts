import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly rememberMe: Locator;
  readonly loginButton: Locator;
  readonly messageError: Locator;
  readonly returningTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.locator("#Email");
    this.password = page.locator("#Password");
    this.rememberMe = page.locator("#RememberMe");
    this.loginButton = page.locator(".button-1.login-button");
    this.messageError = page.locator(".message-error");
    this.returningTitle = page.locator(".returning-wrapper .title strong");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async fillCredentials(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
  }

  async setRememberMe(enable = true) {
    if (enable) {
      if (!(await this.rememberMe.isChecked())) await this.rememberMe.check();
    } else {
      if (await this.rememberMe.isChecked()) await this.rememberMe.uncheck();
    }
  }

  async submit() {
    await Promise.all([
      this.page.waitForLoadState("networkidle"),
      this.loginButton.click(),
    ]);
  }

  async getErrorText() {
    return this.messageError.innerText().catch(() => "");
  }

  async isLoggedIn() {
    const logout = this.page.locator("a", { hasText: /log out|logout/i });
    return (await logout.count()) > 0;
  }
}
