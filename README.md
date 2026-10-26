# Playwright structure that scales

A Playwright + TypeScript project structure for UI and API tests: page objects, fixtures, a typed API client, schema validation, per-environment config and CI.

Companion repo for [flakelab.dev](https://flakelab.dev).

## What's inside

```text
config/
  environments.ts        URLs per environment, picked with TEST_ENV
src/
  api/
    schemas.ts           Zod schemas: the API contract
    booking-client.ts    Typed API client, validates every response
  pages/                 Page objects: locators and actions, no business assertions
  fixtures/index.ts      Wires pages, clients and auth so tests only declare what they need
  data/                  Test data builders and demo credentials
tests/
  ui/                    UI tests (saucedemo.com)
  api/                   API tests (restful-booker.herokuapp.com)
playwright.config.ts     Two projects, "ui" and "api"; retries off on purpose
```

Tests read like this:

```ts
test('adding a product updates the cart badge', async ({ loggedInPage }) => {
  await loggedInPage.addToCart('Sauce Labs Backpack');
  await expect(loggedInPage.cartBadge).toHaveText('1');
});
```

## Run it

Requires Node.js 22 or later.

```sh
npm ci
npx playwright install chromium
npm test
```

| Command               | What it does                               |
| :-------------------- | :----------------------------------------- |
| `npm test`            | Run all tests                              |
| `npm run test:ui`     | Run UI tests only                          |
| `npm run test:api`    | Run API tests only                         |
| `npm run test:repeat` | Run every test 20 times to spot flakiness  |
| `npm run typecheck`   | Type-check the whole project               |
| `npm run report`      | Open the last HTML report                  |

## Design choices

- **Retries are off.** Retries turn a flaky test into a green one and hide the problem. This repo exists to measure flakiness, so a failure stays a failure.
- **Results are also written as JSON** (`test-results/results.json`) so pass rates across repeated runs can be computed, not guessed.
- **The API client validates every response** against a schema, so contract changes fail loudly in one place.
- **Page objects hold locators and actions only.** Assertions live in tests, where the intent is.

## Demo apps

All tests run against public demo apps built for practice: [SauceDemo](https://www.saucedemo.com) and [Restful Booker](https://restful-booker.herokuapp.com). The credentials in `src/data/users.ts` are the ones published on those sites.

Restful Booker is a shared public instance. It resets periodically and can be slow, so an occasional API failure may come from the service, not the tests.

## License

[MIT](LICENSE)
