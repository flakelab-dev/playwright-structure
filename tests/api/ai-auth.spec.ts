import { expect, test } from '../../src/fixtures';
import { authFailureSchema } from '../../src/api/schemas';
import { apiAdmin } from '../../src/data/users';

test.describe('Auth API', () => {
  test('wrong credentials do not return a token', async ({ bookingClient }) => {
    const response = await bookingClient.getTokenRaw(apiAdmin.username, 'wrong-password');
    const body = await response.json();

    // Restful Booker reports bad credentials in the body (with status 200), not as 401.
    expect(body).not.toHaveProperty('token');
    expect(authFailureSchema.parse(body).reason).toBe('Bad credentials');
  });

  test('getToken fails loudly on wrong credentials', async ({ bookingClient }) => {
    await expect(bookingClient.getToken(apiAdmin.username, 'wrong-password')).rejects.toThrow();
  });
});
