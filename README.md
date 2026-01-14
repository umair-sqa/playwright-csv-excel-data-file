# Playwright CSV & Excel Data File Tests

Playwright CSV & Excel Data File is a small test repository that demonstrates using Playwright tests which read user data from CSV and Excel files to run registration and login scenarios.

This project contains Playwright tests, helper utilities for reading CSV/Excel data, and example data files under `resources/data`.

### Contents
- **tests/**: Playwright test files (`register.spec.ts`, `login`) that exercise registration and login flows.
- **pages/**: Page object files used by tests (for example `register.ts`, `login.ts`).
- **utils/fileReader.ts**: Utility to read test data from CSV and Excel files.
- **resources/data/csv/**: Example CSV files (e.g. `registeredUsers.csv`).
- **resources/data/excel/**: Folder for Excel data files.

### Prerequisites
- Node.js 16+ or a supported LTS release
- npm (or yarn)

### Install dependencies:

```bash
npm install
```

### Install Playwright browsers:

```bash
npx playwright install
```

### Data Generation

Create Users and store them in CSV and Excel file under data in resources

```bash
npm run user-generation
```

### Run tests

- Run all Playwright tests:

```bash
npm test
```

- Or run Playwright directly (example):

```bash
npx playwright test
```

Run a single test file:

```bash
npx playwright test tests/register.spec.ts
```