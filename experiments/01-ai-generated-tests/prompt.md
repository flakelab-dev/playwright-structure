# Experiment 01: AI-generated tests on an existing structure

- **Model:** Claude Opus 5.5, running in Claude Code as a fresh agent session.
- **Context given:** this repository and the prompt below. Nothing else.
- **Rule:** the generated code is committed exactly as produced, before it is run or reviewed.

## Prompt (verbatim)

```text
This repo is a Playwright + TypeScript test project (see README.md).
Add new tests that follow the existing structure: use the fixtures in
src/fixtures, the page objects in src/pages and BookingClient in src/api.
Add new page objects or client methods when needed.

UI tests (saucedemo.com), in tests/ui/ai-*.spec.ts:
1. Sort products by price, low to high
2. Remove a product from the cart
3. Complete checkout (happy path)
4. Checkout form shows an error when a required field is missing
5. Log out

API tests (restful-booker.herokuapp.com), in tests/api/ai-*.spec.ts:
6. Update a booking with PUT (authenticated)
7. Partially update a booking with PATCH (authenticated)
8. Filter bookings by first name
9. Creating a booking with an invalid payload is rejected
10. Authenticating with wrong credentials fails

Rules: no hard waits, no retries, each test independent.
Do not run the tests; only write them.
```
