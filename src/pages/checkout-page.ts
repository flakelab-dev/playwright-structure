import { Locator, Page } from '@playwright/test';
import type { Customer } from '../data/customers';

/**
 * Covers the three checkout steps: your information, overview and complete.
 * No goto(): reach it from the cart with CartPage.checkout().
 */
export class CheckoutPage {
  readonly title: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly error: Locator;
  readonly itemNames: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.error = page.locator('[data-test="error"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async fillInformation(customer: Customer): Promise<void> {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
