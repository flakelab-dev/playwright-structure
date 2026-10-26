import { expect, test } from '../../src/fixtures';
import { uiUsers } from '../../src/data/users';

test.describe('Login', () => {
  test('standard user lands on the products page', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(uiUsers.standard.username, uiUsers.standard.password);

    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user sees an error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(uiUsers.lockedOut.username, uiUsers.lockedOut.password);

    await expect(loginPage.error).toContainText('locked out');
  });
});
