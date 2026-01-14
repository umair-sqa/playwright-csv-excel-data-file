import { test, expect } from "@playwright/test";
import path from "path";
import { LoginPage } from "../../resources/pages/login";
import { readUsersFromExcel } from "../../resources/utils/fileReader";

const excelPath = path.resolve("resources/data/excel/registeredUsers.xlsx");

const users = readUsersFromExcel(excelPath);

test.describe.only("Login (Excel) - POM", () => {
  users.forEach((user, index) => {
    // @ts-ignore
    test(`Login user ${index + 1} - ${user.Email}`, async ({ page }) => {
      const login = new LoginPage(page);

      await login.goto();

      await expect(login.returningTitle).toHaveText(/Returning Customer/i);
      await expect(login.email).toBeVisible();
      await expect(login.password).toBeVisible();

      // @ts-ignore
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
