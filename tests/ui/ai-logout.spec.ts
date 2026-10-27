import { expect, test } from '../../src/fixtures';

test.describe('Logout', () => {
  test('logging out returns to the login page and ends the session', async ({
    page,
    loggedInPage,
    loginPage,
  }) => {
    await expect(loggedInPage.title).toHaveText('Products');

    await loggedInPage.logout();

    await expect(loginPage.submit).toBeVisible();

    // The session is really gone: the products page now bounces back to login.
    await page.goto('/inventory.html');
    await expect(loginPage.error).toContainText('when you are logged in');
  });
});
