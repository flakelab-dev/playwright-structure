import { expect, test } from '../../src/fixtures';

test.describe('Cart', () => {
  test('adding a product updates the cart badge', async ({ loggedInPage }) => {
    await loggedInPage.addToCart('Sauce Labs Backpack');

    await expect(loggedInPage.cartBadge).toHaveText('1');
  });
});
