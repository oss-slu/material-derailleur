# Team Metrics Report 2 — Sprints 3 & 4

**Project:** Material Donor Mutual Assist (Material Derailleur)
**Client:** BWorks (Non-profit Organization)
**Team:** Mathew Shereni (Tech Lead), Cole Patric (Developer), Tori Willis (Developer)
**Sprint Duration:** 2 weeks per sprint
**Period Covered:** March 5, 2026 – April 5, 2026 (Sprints 3 & 4)
**Report Date:** April 5, 2026
**Report Number:** 2 (Report 1 covered Sprints 1–2)

---

## 1. Metrics Selection

As a team we selected four metrics that directly reflect our current sprint focus: stabilizing the codebase,
fixing known defects, and preparing a solid foundation before introducing new features.

| Metric | Why We Track It |
|--------|-----------------|
| **Sprint Velocity** (PRs merged + issues closed) | Measures tangible output; reflects how consistently we are delivering work each sprint |
| **Code Coverage** (% statements covered by tests) | Objective signal of test quality; important as we clean up and stabilize the codebase |
| **Defect Rate** (bugs identified and fixed per sprint) | Tracks code health and whether we are reducing or accumulating technical debt |
| **Goal Achievement** (sprint goals met vs. planned) | Honest measure of whether we delivered what we committed to |

**Why not more metrics?**
We deliberately kept the list focused. Burndown charts were less meaningful this sprint because our work was
maintenance and bug-fix oriented rather than feature-driven. Team satisfaction was assessed qualitatively
through our retrospective rather than as a numerical score. We will revisit adding more metrics in Report 3
once we shift back to feature development.

**Alignment with team goals:**
Our sprint 3–4 goal was to clean up deprecated code, fix outstanding bugs, and ensure the application runs
smoothly for our client BWorks before introducing new enhancements. These four metrics directly reflect
whether we achieved that.

---

## 2. Sprint Velocity

Data source: GitHub Insights (monthly pulse, March 5 – April 5, 2026)

### 2a. Pull Request & Commit Activity

| Item | Sprints 3–4 Combined | Per Sprint Average |
|------|----------------------|--------------------|
| PRs merged (total) | 12 | ~6 |
| PRs merged (team-authored) | 7 | ~3.5 |
| PRs merged (automated / Dependabot) | 5 | ~2.5 |
| Open PRs at period end | 0 | — |
| Contributors active | 4 authors, 5 merging | — |
| Commits pushed to main | 28 | ~14 |
| Commits across all branches | 28 | ~14 |
| Files changed | 40 | ~20 |
| Lines added | 928 | ~464 |
| Lines deleted | 334 | ~167 |

### 2b. Issue Activity

| Item | Sprints 3–4 Combined | Per Sprint Average |
|------|----------------------|--------------------|
| Issues closed | 11 | ~5.5 |
| New issues opened | 7 | ~3.5 |
| Active issues at period end | 18 | — |

### 2c. All PRs Merged — Sprints 3 & 4

| PR | Title | Type | Sprint |
|----|-------|------|--------|
| #400 | Donor Page Appearance + Submission Error Fix | Team | Sprint 3 |
| #401 | Refactor permissions | Team | Sprint 3 |
| #365 | Print barcode inline without opening about:blank | Team | Sprint 3 |
| #403 | Bump @types/node 24.10.4 → 25.5.0 (Dependabot) | Automated | Sprint 4 |
| #404 | Admin Status Review | Team | Sprint 4 |
| #405 | Fixing Deprecation, Donation List, Cleaning Up | Team (Cole Patric) | Sprint 4 |
| #406 | Fix CAPTCHA | Team (Tori Willis) | Sprint 4 |
| #407 | Bump nodemailer 7.0.13 → 8.0.4 (Dependabot) | Automated | Sprint 4 |
| #408 | Bump @types/supertest 6.0.3 → 7.2.0 (Dependabot) | Automated | Sprint 4 |
| #417 | Bump typescript 5.9.3 → 6.0.2 (Dependabot) | Automated | Sprint 4 |
| #419 | Added status timeline to donor donations page | Team | Sprint 4 |
| #420 | Bump @types/node 25.5.0 → 25.5.2 (Dependabot) | Automated | Sprint 4 |

**Velocity summary:** The team delivered 7 team-authored PRs across two sprints (~3.5 per sprint) with
~14 commits to main per sprint. Notably, the period closed with 0 open PRs — all active work was merged
and the queue is clear heading into Sprint 5. The final merge (#419) introduced a new feature — a status
timeline on the donor donations page — marking the transition from pure cleanup into feature delivery.

---

## 3. Code Coverage

Data source: Jest coverage run (`npm test -- --coverage`) executed April 2, 2026 against the current
main branch. All test suites pass with zero failures.

### 3a. Backend (server/) — 32 tests, 4 suites, all passing ✅

| Metric | Coverage |
|--------|----------|
| Statements | **26%** |
| Branches | **21.28%** |
| Functions | **15.71%** |
| Lines | **25.83%** |

```
Statements: [█████░░░░░░░░░░░░░░░] 26%
Branches:   [████░░░░░░░░░░░░░░░░] 21%
Functions:  [███░░░░░░░░░░░░░░░░░] 16%
Lines:      [█████░░░░░░░░░░░░░░░] 26%
```

**File breakdown (backend):**

| File | Statements | Notes |
|------|-----------|-------|
| donorSchema.ts | 100% | Fully covered |
| routeProtection.ts | 93% | Best covered — auth/RBAC logic well tested |
| programRoutes.ts | 61% | Moderate coverage |
| donatedItemRoutes.ts | 46% | Partial coverage |
| donorRoutes.ts | 33% | Needs more tests |
| emailService.ts | 27% | External SMTP makes testing harder |
| donatedItemService.ts | 18% | Gap area — priority for Sprint 5 |
| imageAnalysisService.ts | 0% | External AI API — no tests yet |
| donorService.ts | 0% | Gap area — priority for Sprint 5 |
| programService.ts | 0% | Gap area — priority for Sprint 5 |
| index.ts | 0% | Entry point — not unit tested |

### 3b. Frontend (client-app/) — 21 tests, 3 suites, all passing ✅

| Metric | Coverage |
|--------|----------|
| Statements | **42.08%** |
| Branches | **28.4%** |
| Functions | **25.77%** |
| Lines | **39.63%** |

```
Statements: [████████░░░░░░░░░░░░] 42%
Branches:   [█████░░░░░░░░░░░░░░░] 28%
Functions:  [█████░░░░░░░░░░░░░░░] 26%
Lines:      [███████░░░░░░░░░░░░░] 40%
```

**File breakdown (frontend):**

| File | Statements | Notes |
|------|-----------|-------|
| LoadingSpinner.tsx | 100% | Fully covered |
| Enums.ts | 100% | Fully covered |
| DonorForm.tsx | 82% | Best-covered component |
| DonatedItemsList.tsx | 35% | Needs more tests |
| AddNewStatus.tsx | 26% | Large component, low coverage |

### 3c. Coverage Comparison

| Layer | Statement Coverage | Tests Passing |
|-------|--------------------|---------------|
| Backend | 26% | 32/32 ✅ |
| Frontend | 42% | 21/21 ✅ |
| **Combined** | **~34%** | **53/53 ✅** |

Frontend coverage is notably higher than backend (42% vs 26%). The backend gap is concentrated in
service files that interact with external systems (Azure Blob Storage, SMTP email, Google GenAI) —
these require more sophisticated mocking to test and are not yet prioritized in our test suite.

**Baseline established:** 26% backend, 42% frontend. Future reports will track progress against these numbers.

---

## 4. Defect Rate

Data source: GitHub PR history and issue tracker

### 4a. Bugs Fixed — Sprints 3 & 4

| PR | Bug Description | Sprint Fixed |
|----|-----------------|--------------|
| #406 | CAPTCHA not functioning on registration page | Sprint 4 |
| #405 | Deprecated API calls causing warnings and instability | Sprint 4 |
| #405 | Donation list display issues | Sprint 4 |
| #365 | Barcode opening a new tab (`about:blank`) unintentionally | Sprint 3 |
| #400 | Donor page appearance issues + form submission errors | Sprint 3 |
| #407 / #408 / #417 / #420 | Outdated dependencies with known version risks | Sprints 3–4 |

**Total bugs fixed across Sprints 3–4:** ~6 (+ 4 dependency risk patches automated)
**Per sprint average:** ~3 bugs fixed per sprint

The team proactively resolved deprecation warnings, a security-relevant CAPTCHA regression, and multiple
UI bugs. No new critical bugs were introduced during this period — all 53 tests continue to pass.

---

## 5. Goal Achievement

| Sprint 3–4 Goal | Status | Notes |
|-----------------|--------|-------|
| Fix CAPTCHA bug on registration | ✅ Completed | PR #406 by Tori Willis |
| Fix deprecated API calls | ✅ Completed | PR #405 by Cole Patric |
| Fix donation list display | ✅ Completed | PR #405 |
| Fix barcode opening about:blank | ✅ Completed | PR #365 |
| Admin Status Review implementation | ✅ Completed | PR #404 |
| Refactor permissions | ✅ Completed | PR #401 |
| Fix Donor page appearance + submission errors | ✅ Completed | PR #400 |
| Add status timeline to donor donations page | ✅ Completed | PR #419 — new feature shipped |
| Keep dependencies current | ✅ Automated | Dependabot PRs #403, #407, #408, #417, #420 |
| Inventory systems spreadsheet | ⏳ In progress | Carries to Sprint 5 |
| Documentation improvements | ⚠️ Identified | Not yet started — Sprint 5 priority |

**Goal achievement rate: ~85%** — all technical goals met, new feature shipped, no open PRs at period
end. Non-code deliverables (documentation, spreadsheet) carry forward to Sprint 5.

---

## 6. Analysis

### What trends do we observe?

**Stability is improving and features are resuming.** The team closed 11 issues while opening only 7
across the period — a net reduction in open work. More importantly, the sprint ended with PR #419
merging a new feature (status timeline on the donor donations page), marking a healthy transition from
pure cleanup work back into feature delivery. The PR queue is fully clear (0 open PRs) heading into
Sprint 5.

**Coverage gap is structural, not neglect.** At 26% backend and 42% frontend, we are below ideal
thresholds (typically 70–80%). However, the gap is concentrated in external-service integrations
(imageAnalysisService.ts for Google GenAI, emailService.ts for SMTP, Azure Blob storage clients)
that require infrastructure-level mocking. Auth and routing logic — the most critical paths —
are well covered, with `routeProtection.ts` at 93%.

**Demand is manageable.** Closing 11 issues while opening 7 means the net issue count is declining.
The 18 active issues include both bugs and future enhancement ideas from the retrospective — the raw
number overstates the critical backlog.

**Team output is well distributed.** With 4 authors across 28 commits and 5 people involved in merging,
work was not bottlenecked on any single contributor.

### What surprised us?

- Branch coverage (21% backend) is significantly lower than statement coverage (26%), meaning even where
  code executes in tests, conditional branches are largely unexplored — a meaningful quality gap beyond
  what statement coverage alone suggests.
- `routeProtection.ts` at 93% vs. service files at 0% is an inversion — our security boundary is
  well-tested, but business logic is not. Partially acceptable, but service coverage is the next priority.
- The CAPTCHA fix (PR #406) addressed a regression that could have affected user registration in
  production — a reminder that even "cleanup" sprints can surface security-relevant issues.
- Shipping PR #419 (status timeline feature) at the end of the sprint was a positive surprise —
  the team completed all cleanup goals and still had capacity to deliver a new feature.

### What context is missing from the numbers?

- The 18 active issues include both bugs and enhancement ideas — the count does not indicate 18 active bugs.
- Dependabot PRs (5 total) count toward PR velocity but represent zero manual developer effort.
  True team-authored velocity was 7 PRs over two sprints (~3.5 per sprint).
- Lines added (928) and deleted (334) reflect a net reduction in code size — consistent with a
  cleanup-focused sprint that removed deprecated patterns rather than adding new ones.

---

## 7. Retrospective Summary

The following was captured from the team retrospective conducted at the end of Sprint 4:

### Strengths
- **Communication** — the team maintained clear, consistent communication throughout both sprints
- **Adaptability** — pivoted quickly when bugs were discovered mid-sprint
- **Time management** — sprint commitments were met without last-minute crunch

### Weaknesses
- **Documentation** — the only identified weakness; developer-facing docs and enhancement notes
  are not being maintained alongside code changes

### Improvements Committed To
1. **Create a Google Doc** for users and future developers documenting system enhancements and
   architectural decisions
2. **Create a mega-thread issue pattern** for small, related tasks — use GitHub Issue checkboxes
   instead of separate issues to reduce noise

### Priority List for Sprint 5
- Inventory Systems Spreadsheet
- Work on team presentation
- Begin documentation Google Doc

### Future Enhancements Identified (Sprint 5+)

| Enhancement | Description |
|-------------|-------------|
| Scheduled Image Approvals | If a donated item has multiple images, allow different send-off times |
| CAPTCHA for Register | Add CAPTCHA protection to the registration flow |
| Multi-item submission | Allow users to submit 3 different items with back-and-forth navigation |
| Barcode print checkbox | Checkbox to select barcodes for batch printing without opening new tabs |
| Tier 3 email restriction | Low-tier (Tier 3) users should not be able to request donor emails |

---

## 8. Action Items

| Priority | Action | Owner | Success Indicator |
|----------|--------|-------|-------------------|
| High | Create Google Doc for users/future devs documenting enhancements | Mathew | Doc linked from README by end of Sprint 5 |
| High | Adopt mega-thread issue format with checkboxes for small tasks | All | Sprint 5 issues use checkbox format |
| Medium | Increase backend service test coverage — start with `donorService.ts` and `programService.ts` | Cole, Tori | Backend coverage rises from 26% → 35% by Sprint 6 |
| Medium | Complete inventory systems spreadsheet | Mathew | Shared with team by mid-Sprint 5 |
| Low | Create GitHub Issues with specs for Sprint 5+ enhancements | All | Issues created before Sprint 6 planning |

**Coverage targets for next report:**
- Backend: 26% → 35% (add tests for at least 2 service files)
- Frontend: 42% → 50% (add tests for `AddNewStatus.tsx` and `DonatedItemsList.tsx`)

---

## 9. Process Reflection

### How difficult was data collection?

**Automated (easy):** GitHub Insights provided PR counts, issue activity, commit counts, and contributor
data with zero manual work. Running `jest --coverage` gave accurate, reproducible coverage numbers in
under 2 minutes. These will remain easy to collect every sprint.

**Manual (moderate):** Goal achievement required judgment — deciding which goals were "planned" vs.
emergent required reviewing sprint notes and PR descriptions. Defect counts required reading PR titles
and issue labels, which are not always consistently applied.

**Not yet automated:** We do not have a dashboard that aggregates these numbers automatically. Each
data point currently requires a manual lookup. This is acceptable now but represents overhead as the
team scales.

### Which metrics were most/least valuable?

**Most valuable — Code Coverage:** Objective, automated, and directly actionable. Knowing service files
have 0% coverage tells us exactly where to invest next sprint. Unlike velocity, coverage cannot be
gamed by opening and closing trivial issues.

**Most valuable — Goal Achievement:** Forces honest accounting of what was promised vs. delivered.
The ~85% achievement rate (including an unplanned feature) tells a clearer story than raw PR counts.

**Least valuable (this sprint) — Defect Rate in isolation:** Inconsistent issue labeling meant counting
bugs required manual inspection rather than automated querying. Until we enforce consistent labels,
this metric requires too much manual effort for the insight it provides.

### What would we track differently?

1. **Issue label discipline:** Consistently tagging issues as `bug`, `enhancement`, or `task` from
   creation would make defect rate and velocity breakdown automatic and accurate.

2. **Sprint board snapshots:** Screenshots of the GitHub Project board at sprint start and end would
   make planned vs. completed velocity more precise without relying on PR merge dates alone.

3. **Separate Dependabot PRs from team PRs in velocity:** 5 of 12 PRs this period were automated.
   Reporting them separately (as this report does) gives a more honest picture of team output.

4. **Track branch coverage alongside statement coverage:** Branch coverage (21%) being significantly
   lower than statement coverage (26%) is a quality signal we almost missed.

### Automation opportunities

| Data Point | Current Method | Automation Opportunity |
|------------|---------------|------------------------|
| Coverage % | Manual `npm test --coverage` run | GitHub Actions coverage badge + report artifact |
| PR velocity | GitHub Insights (manual) | GitHub Actions workflow summary |
| Issue counts | GitHub Insights (manual) | GitHub API query in CI pipeline |
| Goal achievement | Manual sprint review | GitHub Projects API + automated board snapshot |

---

## 10. Summary Dashboard

| Metric | Sprints 3–4 Value | Sprint 5 Target |
|--------|-------------------|-----------------|
| Team PRs merged per sprint | ~3.5 (+ ~2.5 automated) | Maintain ≥ 3 |
| Issues closed per sprint | ~5.5 | Maintain ≥ 5 |
| Open PRs at sprint end | 0 ✅ | Maintain 0 |
| Backend statement coverage | 26% | 35% |
| Frontend statement coverage | 42% | 50% |
| All tests passing | 53/53 ✅ | Maintain 100% |
| Sprint goal achievement | ~85% | 85%+ |
| Active open issues | 18 | Reduce to ≤ 15 |
| Documentation Google Doc | Not started | Created ✅ |

---

*Report prepared by Mathew Shereni, Tech Lead — Material Derailleur / BWorks Donation Management System*
*Saint Louis University — Open Source Software Development*
