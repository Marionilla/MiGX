# Testing Strategy & Execution Process (Time-Boxed Approach)

This document complements `test-plan.md`. Where the test plan defines *scope,
priority and tooling decisions*, this document describes the actual
**sequence of work and reasoning** I follow when executing under a time box —
both for this 4-hour challenge and, more generally, for any time-constrained
testing pass (e.g. a pre-deploy regression check).

---

## 1. First pass — building confidence in the environment (0 → ~30 min)

### 1.1 API smoke check (Postman)
The very first thing I do is a **quick manual pass through the critical API
endpoints in Postman** — not full coverage, just the highest-risk contract
points (e.g. can I list a resource, get a single one, get a 404 for an
invalid one, hit auth). This is deliberately the *first* step, before any UI
work, because:
- API calls are the fastest possible signal — seconds, not minutes.
- If the API layer itself is unhealthy or behaves unexpectedly, that changes
  how I read every subsequent UI observation (a UI bug might actually be an
  API/data problem surfacing visually).
- It costs almost nothing and de-risks the rest of the session.

### 1.2 Manual walkthrough of the critical UI flow
Next, I go through the application **by hand**, focused only on the
**critical, revenue-impacting flow**: login → add to cart → checkout → place
order. The goal here is twofold:
- **Understand the environment and the product** — how it actually behaves,
  where the friction points are, what "normal" looks like — before writing a
  single line of automation.
- **Catch anything obviously broken early.** If I spot a discrepancy or a bug
  during this pass, I log it immediately (defect log), rather than waiting
  until after automation. Bugs found early are cheaper to report clearly,
  while the repro steps are still fresh.

This manual pass is intentionally scoped to the *critical path only* — not
every screen — because the time box doesn't allow exhaustive manual coverage,
and the critical path is where a bug has the highest business impact.

## 2. Second pass — automation, in priority order

Only after I have a working mental model of the product (from step 1) do I
start automating, and I automate in this order:

1. **Critical UI scenarios first** — the same flow I just walked through
   manually (login, cart, checkout / place order). This is the highest
   business-risk, highest regression-value flow, so it earns automation
   investment first.
2. **Critical API scenarios next** — the same reasoning applied to the API
   layer: the endpoints that matter most for the contract (status codes,
   core CRUD, auth, error handling).
3. **Broader coverage last, if time remains** — additional UI and API
   functionality beyond the critical path (secondary flows, edge cases,
   less business-critical screens). This is the first thing I drop if the
   clock runs out, and it's documented as "next steps" rather than silently
   skipped.

This mirrors the risk-based prioritization already defined in
`test-plan.md` §4 (P1 → P2 → P3): manual exploration first builds
understanding and catches early bugs, automation then locks in coverage
where it has the highest return, starting from the money path outward.

## 3. Re-running under a tighter time box (e.g. pre-deploy, ~2 hours)

Once the automated suite already exists, a *second* run — for example,
validating an environment before a deploy/promote decision — follows a
different, faster rhythm:

1. **Run the automated API smoke suite first** — it executes fastest and
   tends to surface environment problems soonest. I do not proceed to the UI
   smoke suite until the API smoke suite passes: if the underlying contract
   (status codes, critical endpoints) is broken, there is little value in
   running UI checks that would either fail for the same root cause or give
   a misleading signal. Only once API smoke is green do I run the **UI smoke
   suite** — together these give the fastest possible read on "is this
   environment fundamentally healthy?" before moving to manual spot-checking.
2. **Follow up manually** on the critical flow — not to re-discover
   everything, but to (a) visually confirm what automation can't fully judge,
   (b) capture screenshot evidence for anything suspicious, and (c) log any
   new defects found.
3. **Make the promote/no-promote call** based on the combination of smoke
   results + manual spot-check evidence — this is the actual deliverable of
   a time-boxed regression pass, not "100% coverage."
4. **Full end-to-end regression is second priority** — it runs when time
   allows, after the smoke + manual check has already given a go/no-go
   signal. In a real pipeline this would typically run on a schedule or on
   merge to main, not gate every single promote decision under a hard time
   constraint.

## 4. Why this order, in one paragraph

API checks come first because they're the fastest, cheapest signal of
environment health. A manual pass over the critical flow comes next because
it builds real product understanding and catches obvious bugs before any
automation effort is spent — automating a flow I don't yet understand risks
automating the wrong thing. Automation is then invested in the highest-risk,
highest-value flow first (UI critical path, then API critical path), with
broader coverage added only if time remains. Under a tighter re-run (e.g.
pre-deploy), the same logic scales down: automated smoke gives the fastest
go/no-go signal, manual spot-checking adds evidence and catches what
automation might miss, and full end-to-end regression is prioritized second,
run when time genuinely allows it.
