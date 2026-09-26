# MIGx QA Challenge — SauceDemo UI Automation + ReqRes API

QA submission for the MIGx "Web Application Quality Assurance Challenge".
End-to-end quality for two systems handed over without source access:

- **UI:** Swag Labs / SauceDemo — <https://www.saucedemo.com/>
- **API:** ReqRes — <https://reqres.in/api>

This repo contains a written **test plan** + **test-case matrix**, an automated
**UI regression suite** (Playwright + playwright-bdd / Cucumber, POM,
storageState auth), a **defect log**, a deep **bug report** with DevTools
evidence, and the reasoning behind the strategy. The **API suite** (pytest +
requests) is the documented next step (see “Status & next steps”).

> **AI assistance (transparency).** AI tooling (Claude) was used to accelerate
> scaffolding, refactors and documentation. All technical decisions (tool
> choice, POM design, storageState, env config, prioritization) are mine and I
> can explain every part.

---

## 1. Stack
- **UI:** Playwright `^1.49` · playwright-bdd `^9.2` (Gherkin/Cucumber) · TypeScript `^5.7` (strict)
- dotenv (env config) · ESLint 9 + Prettier
- **API (planned):** pytest + requests + jsonschema

## 2. Setup
```bash
npm install
npx playwright install --with-deps chromium
cp .env.example .env   # optional (defaults to SauceDemo)
```

## 3. Run the UI suite (single command)
```bash
npm test                 # bddgen (compile features) + run all projects
npm run test:headed      # watch in a real browser
npm run test:smoke       # @smoke slice
npm run test:regression  # @regression slice
npm run report           # open the HTML report
```

## 4. Run the API suite
Planned (pytest + requests) — see `docs/test-plan.md` §Next steps. Once added:
```bash
cd api-tests && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest -v
```

## 5. View the docs
- Test plan: [`docs/test-plan.md`](docs/test-plan.md)
- Test-case matrix: [`docs/test-case-matrix.md`](docs/test-case-matrix.md)
- Defect log: [`docs/defect-log.md`](docs/defect-log.md)
- Bug report: [`docs/bug-report.md`](docs/bug-report.md)

## 6. Project layout
```
MiGX-master/
├─ features/                     # Gherkin specs + steps (business-readable "what")
│  ├─ login.feature  cart.feature  sorting.feature  checkout.feature
│  └─ steps/                     # step definitions (assertions live here)
├─ src/
│  ├─ pages/                     # Page Objects (BasePage + one class per page)
│  ├─ fixtures/                  # PageManager + playwright-bdd binding (createBdd)
│  ├─ setup/                     # auth.setup.ts — storageState per role
│  ├─ testData/                  # typed users, products, error copy
│  └─ utils/                     # environmentBaseUrl, uiPages, urlBuilder, hooks, authState
├─ playwright.config.ts          # env baseURL + 3 projects (setup / guest / authed)
└─ docs/                         # test plan, matrix, defect log, bug report
```

## 7. How it runs — 3 projects (why)
1. **setup** — logs `standard` + `problem` in once, saves `.auth/<role>.json`.
2. **guest** (`@login`) — login / access-control scenarios, **no** saved session
   (they test logging in, so must start unauthenticated).
3. **authed** (`not @login`) — cart / sorting / checkout **reuse** the standard
   session via `storageState` — no UI login per test → faster & more stable.

## 8. Test strategy (the “why”)
- **Risk-based:** automate the money path (login → cart → checkout) + sorting —
  deterministic, high business impact, high regression value.
- **POM + fixtures:** selectors encapsulated in Page Objects; assertions live in
  steps; one `pages` fixture per test → isolation, no manual `new`.
- **No hardcoded selectors/data:** `data-test` locators; users/products resolved
  via `userByKey` / `productByName` (single source of truth).
- **Web-first assertions only** — no `waitForTimeout`, so tests are deterministic.
- **Seeded demo defects kept OUT of the automated gate:** SauceDemo intentionally
  seeds per-user bugs (problem_user, performance_glitch_user). These are
  non-deterministic demo behaviour — documented in `docs/defect-log.md` and traced
  to a TC, so a green build means the product works, not that a demo quirk behaved.

## 9. Status & next steps
- ✅ **UI suite complete:** 17 tests — setup (2) · login (5) · sorting (4) · cart (2) · checkout (4). typecheck clean, bddgen clean.
- ⏭️ **Next (planned):** API suite (pytest + requests + jsonschema) for ReqRes —
  status codes, response schemas, error handling (invalid user id, missing fields);
  CI workflow (GitHub Actions); husky pre-commit gate.

---

## 10. Bonus questions

**1. Computer System Validation (CSV / GxP).**
For a GxP system I'd produce validation docs alongside test evidence: a
**Validation Plan**, **User/Functional Requirements (URS/FRS)** and a
**Requirements Traceability Matrix** linking each requirement to a test;
**IQ** (Installation Qualification — environment, versions, dependencies
installed as specified), **OQ** (Operational Qualification — the suite exercises
each function against expected results = these test cases), and **PQ**
(Performance Qualification — the system performs under real-world conditions/data).
Each run would be evidenced (reports, traces, screenshots), reviewed and approved
with e-signatures, under change control and an audit trail.

**2. CI/CD.**
Run the suite in GitHub Actions (or Jenkins): install deps + browsers, `npm test`,
publish the HTML report and upload trace/video artifacts on failure. Triggers:
on every PR (a fast `@smoke` slice as a merge gate) and full `@regression`
nightly + on merge to `main`; manual dispatch for ad-hoc runs.

**3. Test data management.**
Keep data typed and centralized (`src/testData`). SauceDemo state is per-session,
so I isolate via a fresh browser context per test and reuse auth via
`storageState`. For a truly stateful app I'd seed/reset via API or DB fixtures in
setup/teardown, use unique data per test (no shared mutable state), and tear down
what I create so runs stay idempotent and parallel-safe.

**4. Non-functional.**
Performance: inventory/page-load timing (`performance_glitch_user` already shows a
regression signal); Lighthouse/Web Vitals on the catalog. Accessibility: axe-core
checks (labels, roles, contrast, keyboard nav, focus order) on login and checkout —
high-traffic forms where a11y matters most.

**5. Risk-based prioritization (given 4h).**
Automated the deterministic, high-impact money path (login, cart, checkout,
sorting) — the flows a regression suite must guard. Explored the seeded per-user
defects manually (non-deterministic → logged, not asserted). Deferred cross-browser
matrix, visual regression and full a11y (documented as out of scope). The API
suite was scoped after the UI core; it's the documented next step.
