import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
import { RegisterPage } from "../pages/register";

test.describe("Registration Data-Driven Tests (POM)", () => {
  test("Signup 5 users and save to CSV", async ({ page }) => {
    const users: Array<{
      Gender: string;
      FirstName: string;
      LastName: string;
      Email: string;
      Password: string;
    }> = [];

    const register = new RegisterPage(page);
    await register.goto();

    for (let i = 0; i < 5; i++) {
      const gender = faker.helpers.arrayElement(["M", "F"]);
      const first = faker.person.firstName(gender === "M" ? "male" : "female");
      const last = faker.person.lastName();
      const email = faker.internet
        .email({ firstName: first, lastName: last })
        .toLowerCase();
      const password = faker.internet.password({
        length: 12,
        memorable: true,
        pattern: /[A-Za-z0-9!@#\$%\^&\*]/,
      });

      // Fill form using POM
      await register.selectGender(gender as "M" | "F");
      await register.fillFirstName(first);
      await register.fillLastName(last);
      await register.fillEmail(email);
      await register.fillPassword(password);

      // Submit and then navigate back to registration for next user if needed
      await register.submit();

      // After successful signup, collect user data
      users.push({
        Gender: gender,
        FirstName: first,
        LastName: last,
        Email: email,
        Password: password,
      });

      // Navigate back to register page to add next user
      await register.goto();
    }

    // Write CSV to resources/data/csv/registeredUsers.csv
    const csvDir = path.resolve("resources/data/csv");
    if (!fs.existsSync(csvDir)) fs.mkdirSync(csvDir, { recursive: true });
    const csvPath = path.join(csvDir, "registeredUsers.csv");

    const header =
      ["Gender", "FirstName", "LastName", "Email", "Password"].join(",") + "\n";
    const rows = users
      .map((u) =>
        [u.Gender, u.FirstName, u.LastName, u.Email, u.Password].join(",")
      )
      .join("\n");
    fs.writeFileSync(csvPath, header + rows, "utf8");

    // Basic assertion: file exists and contains at least 5 lines (header + 5 rows)
    const content = fs.readFileSync(csvPath, "utf8");
    const lines = content.split(/\r?\n/).filter(Boolean);
    expect(lines.length).toBeGreaterThanOrEqual(6);
  });
});
