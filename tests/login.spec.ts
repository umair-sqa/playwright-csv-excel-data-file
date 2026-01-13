import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { LoginPage } from "../resources/pages/login";
// import { readCsv } from "../resources/utils/fileReader";

const csvPath = path.resolve("resources/data/registeredUsers.csv");

function readUsersFromCsv(filePath: string) {
  const [headerLine, ...rows] = fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (!headerLine) return [];

  const headers = headerLine.split(",").map((h) => h.trim());

  return rows.map((row) => {
    const values = row.split(",");
    return Object.fromEntries(
      headers.map((h, i) => [h, (values[i] ?? "").trim()])
    );
  });
}

const users = readUsersFromCsv(csvPath);

test.describe("Login (CSV) - POM", () => {
  users.forEach((user, index) => {
    test(`Login user ${index + 1} - ${user.Email}`, async ({ page }) => {
      const login = new LoginPage(page);

      await login.goto();

      await expect(login.returningTitle).toHaveText(/Returning Customer/i);
      await expect(login.email).toBeVisible();
      await expect(login.password).toBeVisible();

      await login.fillCredentials(user.Email, user.Password);

      if (index === 0) {
        await login.setRememberMe(true);
      }

      await login.submit();

      const loggedIn = await login.isLoggedIn();
      if (!loggedIn) {
        test.info().attach("login-error", {
          body: (await login.getErrorText()).trim(),
          contentType: "text/plain",
        });
      }

      expect(loggedIn).toBe(true);
    });
  });
});
