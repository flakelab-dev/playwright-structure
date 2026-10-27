import { expect, test } from '../../src/fixtures';

const toNumber = (price: string): number => Number(price.replace('$', ''));

test.describe('Sorting', () => {
  test('sorting by price low to high orders products by ascending price', async ({
    loggedInPage,
  }) => {
    await expect(loggedInPage.title).toHaveText('Products');
    const pricesBefore = await loggedInPage.itemPrices.allTextContents();
    const expected = [...pricesBefore].sort((a, b) => toNumber(a) - toNumber(b));
    // Guard: if the default order were already ascending, the test would prove nothing.
    expect(pricesBefore.length).toBeGreaterThan(1);
    expect(pricesBefore).not.toEqual(expected);

    await loggedInPage.sortBy('Price (low to high)');

    await expect(loggedInPage.itemPrices).toHaveText(expected);
  });
});
