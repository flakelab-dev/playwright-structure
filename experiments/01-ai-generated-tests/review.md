# Experiment 01: results and review

## Run 1: local

- **Date:** 2026-10-26
- **Command:** `npx playwright test --repeat-each=20` (retries off)
- **Environment:** Windows 11, Node.js 24, Playwright 1.64.1, Chromium, 6 workers
- **Summary computed with:** `node scripts/summarize-results.mjs`

**Runs: 360 · Passed: 360 (100%)**

| Project | Test | Passed | Pass rate |
| :-- | :-- | --: | --: |
| api | ai-auth › getToken fails loudly on wrong credentials | 20/20 | 100% |
| api | ai-auth › wrong credentials do not return a token | 20/20 | 100% |
| api | ai-booking › filtering by first name returns the matching booking | 20/20 | 100% |
| api | ai-booking › PATCH changes only the given fields | 20/20 | 100% |
| api | ai-booking › PUT replaces every field of a booking | 20/20 | 100% |
| api | ai-booking › creating a booking without required fields is rejected | 20/20 | 100% |
| ui | ai-cart › removing a product leaves only the other products in the cart | 20/20 | 100% |
| ui | ai-checkout › error when firstName is missing | 20/20 | 100% |
| ui | ai-checkout › error when lastName is missing | 20/20 | 100% |
| ui | ai-checkout › error when postalCode is missing | 20/20 | 100% |
| ui | ai-checkout › completing checkout shows the order confirmation | 20/20 | 100% |
| ui | ai-logout › logging out returns to the login page and ends the session | 20/20 | 100% |
| ui | ai-sorting › sorting by price low to high orders products by ascending price | 20/20 | 100% |
| | *Baseline (hand-written): 5 tests* | 100/100 | 100% |

## Review

Stable is not the same as correct. A test that always passes may still check the wrong thing.
For each AI-generated test, answer:

1. **Oracle:** where does each expected value come from? Was it verified against the app, or assumed?
2. **Sensitivity:** if the feature broke, would this test fail?
3. **Isolation:** does it depend on anything it does not control (shared public data, other tests, leftover state, data it never cleans up)?
4. **Structure:** does it use the fixtures, page objects and client, or bypass them? Are the selectors robust?

Verdict: ✅ good as is · ⚠️ passes but weak or fragile · ❌ wrong

| Test | 1. Oracle | 2. Sensitivity | 3. Isolation | 4. Structure | Verdict | Notes |
| :-- | :-- | :-- | :-- | :-- | :-: | :-- |
| ai-sorting › price low to high | | | | | | |
| ai-cart › remove a product | | | | | | |
| ai-checkout › happy path | | | | | | |
| ai-checkout › firstName missing | | | | | | |
| ai-checkout › lastName missing | | | | | | |
| ai-checkout › postalCode missing | | | | | | |
| ai-logout › log out | | | | | | |
| ai-booking › PUT | | | | | | |
| ai-booking › PATCH | | | | | | |
| ai-booking › filter by first name | | | | | | |
| ai-booking › invalid payload rejected | | | | | | |
| ai-auth › no token on wrong credentials | | | | | | |
| ai-auth › getToken fails on wrong credentials | | | | | | |

### Support code added by the AI

| File | What changed | Notes |
| :-- | :-- | :-- |
| src/pages/inventory-page.ts | Sorting, cart link, menu and logout | |
| src/pages/cart-page.ts | New page object | |
| src/pages/checkout-page.ts | New page object (3 checkout steps) | |
| src/api/booking-client.ts | PUT, PATCH, filter, raw variants, auth headers helper | |
| src/api/schemas.ts | Booking IDs and auth failure schemas | |
| src/fixtures/index.ts | cartPage and checkoutPage fixtures | |
| src/data/customers.ts | Checkout form data builder | |

### Assumptions the AI declared (from its own report)

- [ ] Restful Booker returns 500 for an incomplete booking payload.
- [ ] Restful Booker returns 200 with `{"reason":"Bad credentials"}` for wrong credentials.
- [ ] SauceDemo exposes the `data-test` attributes it used (`logout-sidebar-link`, `product-sort-container`, `complete-header`, `shopping-cart-link`, `inventory-item` in cart rows).
- [ ] The cart is empty after completing checkout.

## Where the AI went wrong

_To be written after the review._
