import { expect, test } from '../../src/fixtures';
import { buildCustomer, Customer } from '../../src/data/customers';

test.describe('Checkout', () => {
  test('completing checkout shows the order confirmation', async ({
    loggedInPage,
    cartPage,
    checkoutPage,
  }) => {
    await loggedInPage.addToCart('Sauce Labs Backpack');
    await loggedInPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation(buildCustomer());
    await checkoutPage.continue();
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    await expect(checkoutPage.itemNames).toHaveText(['Sauce Labs Backpack']);

    await checkoutPage.finish();

    await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.cartBadge).toHaveCount(0);
  });

  const requiredFields: { field: keyof Customer; message: string }[] = [
    { field: 'firstName', message: 'Error: First Name is required' },
    { field: 'lastName', message: 'Error: Last Name is required' },
    { field: 'postalCode', message: 'Error: Postal Code is required' },
  ];

  for (const { field, message } of requiredFields) {
    test(`checkout form shows an error when ${field} is missing`, async ({
      loggedInPage,
      cartPage,
      checkoutPage,
    }) => {
      await loggedInPage.addToCart('Sauce Labs Backpack');
      await loggedInPage.openCart();
      await cartPage.checkout();

      await checkoutPage.fillInformation(buildCustomer({ [field]: '' }));
      await checkoutPage.continue();

      await expect(checkoutPage.error).toHaveText(message);
      await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
    });
  }
});
