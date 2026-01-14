import { Page } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/register");
  }

  async selectGender(gender: "M" | "F") {
    if (gender === "M") {
      await this.page.check("#gender-male");
    } else {
      await this.page.check("#gender-female");
    }
  }

  async fillFirstName(firstName: string) {
    await this.page.fill("#FirstName", firstName);
  }

  async fillLastName(lastName: string) {
    await this.page.fill("#LastName", lastName);
  }

  async fillEmail(email: string) {
    await this.page.fill("#Email", email);
  }

  async fillPassword(password: string) {
    await this.page.fill("#Password", password);
    await this.page.fill("#ConfirmPassword", password);
  }

  async submit() {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle" }),
      this.page.click("#register-button"),
    ]);
  }
}
