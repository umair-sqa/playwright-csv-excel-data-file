import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { faker } from "@faker-js/faker";
import { RegisterPage } from "../resources/pages/register";

type User = {
  Gender: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
};

test.describe("Registration Data-Driven Tests (POM)", () => {
  test("Signup users and save to CSV & Excel", async ({ page }) => {
    const users: User[] = [];

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
        pattern: /[A-Za-z0-9!@#$%^&*]/,
      });

      await register.selectGender(gender as "M" | "F");
      await register.fillFirstName(first);
      await register.fillLastName(last);
      await register.fillEmail(email);
      await register.fillPassword(password);
      await register.submit();

      users.push({
        Gender: gender,
        FirstName: first,
        LastName: last,
        Email: email,
        Password: password,
      });

      await register.goto();
    }

    // 📁 Base data directory
    const baseDir = path.resolve("resources/data");
    fs.mkdirSync(baseDir, { recursive: true });

    // =========================
    // 🟢 WRITE CSV
    // =========================
    const csvDir = path.join(baseDir, "csv");
    fs.mkdirSync(csvDir, { recursive: true });

    const csvPath = path.join(csvDir, "registeredUsers.csv");
    const csvHeader =
      ["Gender", "FirstName", "LastName", "Email", "Password"].join(",") + "\n";

    const csvRows = users
      .map((u) =>
        [u.Gender, u.FirstName, u.LastName, u.Email, u.Password].join(",")
      )
      .join("\n");

    fs.writeFileSync(csvPath, csvHeader + csvRows, "utf8");

    // =========================
    // 🔵 WRITE EXCEL
    // =========================
    const excelDir = path.join(baseDir, "excel");
    fs.mkdirSync(excelDir, { recursive: true });

    const excelPath = path.join(excelDir, "registeredUsers.xlsx");

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(users);
    XLSX.utils.book_append_sheet(workbook, worksheet, "RegisteredUsers");
    XLSX.writeFile(workbook, excelPath);

    // =========================
    // ✅ ASSERTIONS
    // =========================
    expect(fs.existsSync(csvPath)).toBeTruthy();
    expect(fs.existsSync(excelPath)).toBeTruthy();

    const csvLines = fs
      .readFileSync(csvPath, "utf8")
      .split(/\r?\n/)
      .filter(Boolean);
    expect(csvLines.length).toBeGreaterThanOrEqual(6);

    const excelData = XLSX.utils.sheet_to_json(
      XLSX.readFile(excelPath).Sheets["RegisteredUsers"]
    );
    expect(excelData.length).toBeGreaterThanOrEqual(5);
  });
});
