# Test Plan — Web Application Quality Assurance Challenge

**Project:** MIGx QA Challenge
**Author:** Maryna Mykhailova
**Systems under test:**
- **UI:** Swag Labs / SauceDemo — <https://www.saucedemo.com/>
- **API:** ReqRes — <https://reqres.in/api>

**Time box:** 4 hours

---

## 1. Purpose
Independently own test planning and execution for two systems handed over
without source access or documentation. The goal is not exhaustive coverage but
a defensible, **risk-based** strategy: decide what to test manually, what to
automate, and what to skip under the time box, then hand off clear evidence
(test-case matrix, defect log, automated suite, bug report) that a developer and
a stakeholder can both act on.

## 2. Scope

### 2.1 In scope
| Area | System | Notes |
|------|--------|-------|
| Login & access control | UI | All 4 demo users, invalid & empty credentials, locked-out state |
| Product sorting & data display | UI | Name A–Z / Z–A, Price low–high / high–low; order verified |
| Cart | UI | Add / remove, badge count |
| Checkout flow | UI | Form validation (empty/invalid), totals arithmetic, order completion |
| Session / authentication | UI | Session reuse across authenticated flows |
| API contract validation | API | Status codes, response schema, error handling (GET/POST/PUT/DELETE) |
| Network-level bug evidence | UI | DevTools Network/Console for one confirmed defect |

### 2.2 Out of scope (with reasoning)
| Excluded | Why |
|----------|-----|
| Cross-browser / device matrix | Single time box; Chromium is representative. Config-ready as future work. |
| Load / stress / soak testing | Demo infra, not owned; only a single-user performance *signal* is noted. |
| Full WCAG accessibility audit | Beyond the time box; key checks flagged as non-functional follow-up. |
| Security penetration testing | Only light input-abuse exploration (special chars in forms). |
| ReqRes write persistence | ReqRes is a mock; POST/PUT/DELETE do not persist — assert contract shape only. |
| Visual / pixel regression | No baseline available in the time box. |

## 3. Test approach

### 3.1 Levels & types
- **Functional** — positive and negative paths on every core flow.
- **Exploratory** — session-based charters against the `problem_user` and
  `performance_glitch_user` accounts to surface seeded defects.
- **Contract / API** — status codes, JSON schema, error behaviour.
- **Non-functional (signal only)** — page-load timing observation.

### 3.2 Manual vs automated
| Bucket | Decision | Rationale |
|--------|----------|-----------|
| Login (all users + negatives) | **Automate** | High business risk, stable, high regression value |
| Checkout happy path + validation | **Automate** | Core revenue flow; must never regress |
| Sorting (4 modes, order asserted) | **Automate** | Deterministic, cheap to assert, easy to get wrong |
| Cart add/remove + badge | **Automate** | Core, deterministic |
| API contract (ReqRes) | **Automate (pytest + requests)** | Fast, deterministic, high signal per line |
| `problem_user` seeded defects | **Manual + defect log** | Non-deterministic UI glitches — documented, not asserted, so a green build stays meaningful |
| `performance_glitch_user` timing | **Manual measurement** | Timing signal captured as evidence, not a hard gate |
| Direct-URL / network-level bug | **Manual → deep bug report** | Best request/response evidence candidate |

### 3.3 Tooling
| Concern | Tool | Why |
|---------|------|-----|
| UI automation | **Playwright + playwright-bdd + TypeScript** | Auto-wait reduces flakiness; first-class trace/video/screenshot evidence; Gherkin readability; Page-Object-friendly |
| Auth | **storageState** (setup project) | Log in once per role, reuse the session — faster and more stable than logging in per test |
| API automation | **pytest + requests + jsonschema** | Readable assertions, schema validation for contracts, single-command run |
| Bug evidence | Chrome DevTools (Network/Console/Elements) | Request/response-level proof, as required |
| Structure | Page Object Model + fixtures (UI), client wrapper + fixtures (API) | Maintainable; single source of truth for selectors/data — not recorded scripts |

### 3.4 Test data
- SauceDemo ships fixed accounts (password `secret_sauce` for all) — no setup.
- App state is per-session; a fresh browser context per test + `storageState`
  reuse keep tests isolated.
- ReqRes is stateless/mock — no teardown; a valid API-key header is sent where
  the current ReqRes version requires one.

## 4. Risk-based prioritization (given 4 hours)
Priority = **business impact × likelihood of failure**.

- **P1 (must, automated):** login, checkout, sorting, cart, API contract — the
  money path and the flows a regression suite must guard.
- **P2 (should, manual + selective automation):** catalog integrity, session
  handling, performance signal.
- **P3 (could, exploratory only):** input abuse, browser back-button behaviour,
  footer links, item-detail edge cases.

If time runs out, P3 is dropped first, then P2 automation (kept as documented
manual cases); P1 automation is protected.

## 5. Environments
| Item | Value |
|------|-------|
| UI target | `https://www.saucedemo.com/` (production demo) |
| API target | `https://reqres.in/api` |
| Browser | Chromium (Playwright default) |
| Selection | `ENV` (qa4 / dev4) + `BASE_URL` override |
| Node | ≥ 18 (UI suite) |
| Python | ≥ 3.10 (API suite) |

## 6. Entry / exit criteria
**Entry:** targets reachable; credentials valid; toolchains installed per README.

**Exit:**
- All P1 test cases executed; automated P1 suites green (excluding known seeded
  defects, which are documented rather than failing the build).
- Defect log complete with a severity for every finding.
- One bug reproduced with network-level evidence and a suggested fix.
- README lets a reviewer run everything with single documented commands.

## 7. Severity classification (used in the defect log)
| Severity | Definition | Example |
|----------|------------|---------|
| **S1 – Critical** | Blocks core flow / data loss / security exposure | Unauthenticated access to inventory |
| **S2 – Major** | Core feature wrong, workaround exists | Sorting returns wrong order for a user |
| **S3 – Minor** | Non-blocking functional / UX defect | All product images identical for a user |
| **S4 – Trivial** | Cosmetic | Minor copy / alignment issue |

## 8. Deliverables
1. This Test Plan.
2. `test-case-matrix.md` — traceable test cases with priority & result.
3. `defect-log.md` — findings with severity classification.
4. Automated UI regression suite (Playwright + playwright-bdd) — login, sorting, cart, checkout.
5. API test suite (pytest + requests) — status codes, schema, error handling.
6. `bug-report.md` — one deep defect with DevTools evidence and a suggested fix.
7. `README.md` — setup, run commands, and the *why* behind the strategy + bonus Q&A.

## 9. Assumptions & risks
- SauceDemo intentionally seeds per-user defects; findings for `problem_user` /
  `performance_glitch_user` are **expected demo behaviour**, documented as such
  rather than treated as suite failures.
- ReqRes is a public mock; rate limiting or an API-key requirement may affect
  runs — handled via a configurable key and re-runnable, idempotent tests.
- Both targets are third-party demos; availability is a delivery risk, mitigated
  by keeping the suites idempotent and re-runnable.
