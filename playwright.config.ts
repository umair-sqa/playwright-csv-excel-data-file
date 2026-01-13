import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 1,
  workers: process.env.CI ? 4 : 2,
  use: {
    baseURL: "https://demowebshop.tricentis.com/login",
    headless: true,
    trace: "on-first-retry",
  },
});
