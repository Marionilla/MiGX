# MIGx QA Challenge — SauceDemo UI Automation

End-to-end UI regression suite for **Swag Labs / SauceDemo**
(<https://www.saucedemo.com/>) built with **Playwright + playwright-bdd
(Cucumber) + TypeScript**, using the Page Object Model and reused
authentication via **storageState**.

## Stack

- Playwright `^1.49` · playwright-bdd `^9.2` (Gherkin/Cucumber) · TypeScript `^5.7` (strict)
- dotenv (env config) · ESLint 9 + Prettier

## Setup

```bash
npm install
npx playwright install --with-deps chromium
cp .env.example .env   # optional (defaults to prod / SauceDemo)
```

## Run

```bash
npm test                 # bddgen (compile features) + run all projects
npm run test:headed      # watch in a real browser
npm run test:smoke       # @smoke slice
npm run test:regression  # @regression slice
npm run report           # open HTML report
```

## Project layout

```
migx-qa-challenge/
├─ features/                     # Gherkin specs + steps (business-readable "what")
│  ├─ login.feature  sorting.feature  cart.feature  checkout.feature
│  └─ steps/                     # step definitions (assertions live here)
├─ src/
│  ├─ pages/                     # Page Objects (BasePage + one class per page)
│  ├─ fixtures/                  # PageManager + playwright-bdd binding (createBdd)
│  ├─ setup/                     # auth.setup.ts — storageState per role
│  ├─ testData/                  # typed users, products, error copy
│  └─ utils/                     # environmentBaseUrl, uiPages, uiUrlBuilder, hooks, authState
├─ playwright.config.ts          # env baseURL + 3 projects (setup / guest / authed)
└─ docs/                         # test plan, matrix, defect log, bug report
```

## How it runs — 3 projects

1. **setup** — logs `standard` + `problem` in once, saves `.auth/<role>.json`.
2. **guest** (`@login`) — login / access-control scenarios, **no** saved session.
3. **authed** (`not @login`) — cart / sorting / checkout, **reuse** the standard-user
   session via `storageState` (no UI login per test).

## Environment / URLs

Base URLs live in `src/utils/environmentBaseUrl.ts` (qa4 / dev4), selected by
`ENV` and overridable by `BASE_URL`:

```bash
ENV=qa4 npm test
BASE_URL=https://mirror npm test   # hard override
```

## Conventions

- **Assertions in step definitions, never in Page Objects.**
- Locators via `getByTestId` / `getByRole` (`testIdAttribute: 'data-test'`).
- Web-first assertions only — **no `waitForTimeout`**.
- One `pages` fixture (PageManager) per test → isolation, no manual `new`.
- Concrete values (users, products) live in `src/testData` and Gherkin — resolved
  via `userByKey` / `productByName` (single source of truth, no hardcoded selectors).

## Status

**17 tests** — setup (2) · guest/login (5) · authed: sorting (4) + cart (2) + checkout (4).
See `docs/` for the plan, test-case matrix, defect log and a deep bug report.
