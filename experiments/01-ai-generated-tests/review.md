# Experiment 01: results and review

## Run 1: local

- **Date:** 2026-10-26
- **Command:** `npx playwright test --repeat-each=20` (retries off)
- **Environment:** Windows 11, Node.js 24, Playwright 1.64.1, Chromium, 6 workers
- **Summary computed with:** `node scripts/summarize-results.mjs`

**Runs: 360 · Passed: 360 (100%)**

| Project | Test                                                                         |  Passed | Pass rate |
| :------ | :--------------------------------------------------------------------------- | ------: | --------: |
| api     | ai-auth › getToken fails loudly on wrong credentials                         |   20/20 |      100% |
| api     | ai-auth › wrong credentials do not return a token                            |   20/20 |      100% |
| api     | ai-booking › filtering by first name returns the matching booking            |   20/20 |      100% |
| api     | ai-booking › PATCH changes only the given fields                             |   20/20 |      100% |
| api     | ai-booking › PUT replaces every field of a booking                           |   20/20 |      100% |
| api     | ai-booking › creating a booking without required fields is rejected          |   20/20 |      100% |
| ui      | ai-cart › removing a product leaves only the other products in the cart      |   20/20 |      100% |
| ui      | ai-checkout › error when firstName is missing                                |   20/20 |      100% |
| ui      | ai-checkout › error when lastName is missing                                 |   20/20 |      100% |
| ui      | ai-checkout › error when postalCode is missing                               |   20/20 |      100% |
| ui      | ai-checkout › completing checkout shows the order confirmation               |   20/20 |      100% |
| ui      | ai-logout › logging out returns to the login page and ends the session       |   20/20 |      100% |
| ui      | ai-sorting › sorting by price low to high orders products by ascending price |   20/20 |      100% |
|         | _Baseline (hand-written): 5 tests_                                           | 100/100 |      100% |

## Review

Stable is not the same as correct. A test that always passes may still check the wrong thing.
For each AI-generated test, answer:

1. **Oracle:** where does each expected value come from? Was it verified against the app, or assumed?
2. **Sensitivity:** if the feature broke, would this test fail?
3. **Isolation:** does it depend on anything it does not control (shared public data, other tests, leftover state, data it never cleans up)?
4. **Structure:** does it use the fixtures, page objects and client, or bypass them? Are the selectors robust?

Verdict: ✅ good as is · ⚠️ Oracle: expected behavior not backed by a specification · ⚠️ Weak: the assertion would not catch the failure · ❌ wrong

Reviewed against the code and the available documentation: the [Restful Booker API docs](https://restful-booker.herokuapp.com/apidoc/index.html). SauceDemo has no documentation, so every UI expectation comes from the app's current behavior.

| Test                                  | Q2: caught a seeded bug? | Verdict              |
| :------------------------------------ | :----------------------- | :------------------- |
| ai-sorting › price low to high        | Yes (3 users)            | ⚠️ Oracle            |
| ai-cart › remove a product            | Not measured             | ⚠️ Oracle            |
| ai-checkout › happy path              | Yes (2 users)            | ⚠️ Oracle            |
| ai-checkout › firstName missing       | Yes (1 user)             | ⚠️ Oracle            |
| ai-checkout › lastName missing        | Yes (1 user)             | ⚠️ Oracle            |
| ai-checkout › postalCode missing      | Yes (1 user)             | ⚠️ Oracle            |
| ai-logout › log out                   | Not measured             | ⚠️ Oracle            |
| ai-booking › PUT                      | n/a (API)                | ✅                   |
| ai-booking › PATCH                    | n/a (API)                | ✅                   |
| ai-booking › filter by first name     | n/a (API)                | ✅                   |
| ai-booking › invalid payload rejected | No                       | ❌ Weak + Oracle     |
| ai-auth › no token on wrong creds     | n/a (API)                | ⚠️ Oracle            |
| ai-auth › getToken fails on wrong creds | No                     | ⚠️ Weak              |

**Isolation (Q3), all tests:** no dependency between tests; they pass in any order and in parallel (360 runs, 6 workers). The UI tests share `standard_user`, but SauceDemo keeps the cart in the browser, and each test gets a fresh browser context. The filter test uses a unique first name, so other bookings on the shared public instance cannot match. However, the PUT, PATCH and filter tests create bookings and never delete them: about 60 abandoned bookings per 20-run session on a shared public service. The hand-written baseline has the same gap, and the AI copied the pattern.

**Structure (Q4), all tests:** uses the fixtures, page objects and API client; follows the `Raw` naming convention; adds a data builder like the existing one; parametrizes the three missing-field cases instead of copying them. `data-test` selectors are the most stable choice on SauceDemo. Room to improve: `title`, `itemNames` and `cartBadge` are duplicated across three page objects (a shared header component would scale better), and the four checkout tests repeat the same setup (a fixture would remove it).

**Notes per test**

- **ai-sorting:** reads the prices, sorts them in code, checks the page does not start sorted (a good guard), then sorts on the page and compares. Solid logic, but nothing documents the expected behavior.
- **ai-cart:** a good test, but nothing documents the expected behavior.
- **ai-checkout › happy path:** assumes the cart is empty after checkout. Reasonable (every shop does this) and true today, but undocumented.
- **ai-checkout › missing fields:** the error texts are undocumented; if the app changes its wording, these tests fail. Generated as three independent tests from one loop. The reviewer would write them as three explicit tests for readability.
- **ai-logout:** the full message is "Epic sadface: You can only access '/inventory.html' when you are logged in.", but the test only checks the last part. The end of the session is checked by behavior (the products page redirects to login), not by inspecting cookies.
- **ai-booking › PUT, PATCH, filter:** behavior backed by the docs. The response status is checked in the client (`jsonOrThrow`), which fails with the URL, status and body, so a failed request gives a descriptive error before any assertion runs. The reviewer first flagged a missing status check; reading the client resolved it.
- **ai-booking › invalid payload:** the docs do not say which status to expect. The API returns 500 (a server error) for a validation problem, which should be 400. The AI noticed, wrote a comment, and loosened the assertion to "any status ≥ 400". If the service were down (e.g. 503), this test would still pass.
- **ai-auth › no token:** the docs do not describe this case. The API returns 200 with `{"reason":"Bad credentials"}`; the test treats that as correct.
- **ai-auth › getToken fails:** `rejects.toThrow()` accepts any error, including a network failure. When it passes today, it is because the response does not match the token schema, not because the API rejected the login.

## Run 2: seeded bugs (mutation check)

SauceDemo offers demo users with deliberate bugs. The `loggedInPage` fixture reads `UI_USER`, so the same AI-generated UI tests ran as each user, 3 times each:

```sh
UI_USER=problem_user npx playwright test tests/ui/ai- --project=ui --repeat-each=3
```

| User                    | Passed | What failed, and why                                                                                                                         |
| :---------------------- | -----: | :------------------------------------------------------------------------------------------------------------------------------------------- |
| standard_user           |  21/21 | (control)                                                                                                                                    |
| problem_user            |   9/21 | Sorting does not sort. The last name field ignores input, so checkout cannot continue and the other missing-field tests get the wrong error. |
| error_user              |  12/21 | Sorting does not sort. Checkout cannot finish. A missing last name is not reported.                                                          |
| visual_user             |  18/21 | Sorting: the prices shown after sorting are not the prices shown before.                                                                     |
| performance_glitch_user |  17/21 | Not a functional bug: login takes over 5 s, and the tests that start with an assertion on the page title time out.                            |

Every failure above was caused by the seeded bug, not by a mistake in the test. Tests that stayed green did so because the bug was not on their path (for example, logout works for every user). Not verified manually: whether `error_user` has a cart bug on products other than the two the test uses.

The `performance_glitch_user` run shows a flakiness source: the same slowness fails the tests whose first step is an assertion (5 s timeout) and passes the tests whose first step is an action (no action timeout).

### Support code added by the AI

| File                        | What changed                                          | Notes |
| :-------------------------- | :---------------------------------------------------- | :---- |
| src/pages/inventory-page.ts | Sorting, cart link, menu and logout                   |       |
| src/pages/cart-page.ts      | New page object                                       |       |
| src/pages/checkout-page.ts  | New page object (3 checkout steps)                    |       |
| src/api/booking-client.ts   | PUT, PATCH, filter, raw variants, auth headers helper |       |
| src/api/schemas.ts          | Booking IDs and auth failure schemas                  |       |
| src/fixtures/index.ts       | cartPage and checkoutPage fixtures                    |       |
| src/data/customers.ts       | Checkout form data builder                            |       |

### Assumptions the AI declared (from its own report)

All four are true today. None is documented.

- [x] Restful Booker returns 500 for an incomplete booking payload (checked with curl; the test itself only checks ≥ 400).
- [x] Restful Booker returns 200 with `{"reason":"Bad credentials"}` for wrong credentials (checked with curl).
- [x] SauceDemo exposes the `data-test` attributes it used (the tests that use them pass).
- [x] The cart is empty after completing checkout (asserted by the happy path test, which passes).

## Fixes after review

Each fix is a separate commit on top of the AI's output, so the before and after can be compared.

| Finding                                    | Fix                                                                                              | Commit  |
| :----------------------------------------- | :----------------------------------------------------------------------------------------------- | :------ |
| ❌ Invalid payload accepts any status ≥ 400 | Asserts the exact 500 and records it as a known API bug (should be 400)                          | bed0c5d |
| ⚠️ Weak: getToken accepts any error        | The client throws `Authentication failed: <reason>`; the test asserts that message              | c272114 |
| Bookings never deleted                     | The `bookingClient` fixture deletes every booking a test created; verified with a GET after run | 5b5ce0b |

`test.fail()` was considered for the known bug and rejected: it treats any failure as expected, including an outage.

Not changed: the duplicated header locators and the repeated checkout setup (Q4). They are improvements, not defects, and are left for a later refactor.

## Where the AI went wrong

Written up in full in the article: [360 green runs, and one test that would pass with the server down](https://flakelab.dev/blog/ai-generated-playwright-tests-measured/).

1. **It loosened an assertion to fit a bug.** It knew the API returns 500 for a validation error and accepted any status ≥ 400, so the test would pass with the service down. Fixed in bed0c5d.
2. **It accepted any error.** `rejects.toThrow()` with no message passed because of a schema error on the 200 + `reason` response, not because the API rejected the login. Fixed in c272114.
3. **It copied a gap from the baseline.** Bookings were created and never deleted, like in the hand-written tests. Fixed in 5b5ce0b.
4. **It turned current behavior into expected behavior.** SauceDemo has no spec, so every UI expectation is today's behavior: 8 of 13 tests are ⚠️ Oracle. Its list of assumptions is where these problems show up.
5. **Minor:** duplicated header locators and repeated checkout setup. Not fixed.

What it got right: it followed the structure and naming conventions, used unique data in the filter test, guarded the sorting test against an already sorted list, parametrized the missing-field cases and declared its assumptions.

Its mistakes were about what to check, not how to write the code.
