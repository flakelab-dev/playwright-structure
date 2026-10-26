import { expect, test } from '../../src/fixtures';

test.describe('Cart', () => {
  test('removing a product leaves only the other products in the cart', async ({
    loggedInPage,
    cartPage,
  }) => {
    await loggedInPage.addToCart('Sauce Labs Backpack');
    await loggedInPage.addToCart('Sauce Labs Bike Light');
    await expect(loggedInPage.cartBadge).toHaveText('2');
    await loggedInPage.openCart();

    await cartPage.removeItem('Sauce Labs Backpack');

    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Bike Light']);
    await expect(cartPage.cartBadge).toHaveText('1');
  });
});
