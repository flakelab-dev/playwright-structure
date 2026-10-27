import { test as base } from '@playwright/test';
import { BookingClient } from '../api/booking-client';
import { apiAdmin, sessionUser } from '../data/users';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout-page';
import { InventoryPage } from '../pages/inventory-page';
import { LoginPage } from '../pages/login-page';

/**
 * Fixtures wire everything together, so tests only declare what they need:
 *   test('...', async ({ loggedInPage }) => { ... })
 * Setup lives here once instead of being copied into every test.
 */
type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  /** An InventoryPage already logged in as sessionUser (standard_user unless UI_USER is set). */
  loggedInPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  bookingClient: BookingClient;
  authToken: string;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  loggedInPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login(sessionUser.username, sessionUser.password);
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  authToken: async ({ bookingClient }, use) => {
    await use(await bookingClient.getToken(apiAdmin.username, apiAdmin.password));
  },
});

export { expect } from '@playwright/test';
