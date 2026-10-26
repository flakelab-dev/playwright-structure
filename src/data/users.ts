/**
 * Demo credentials. These are published on the demo sites themselves
 * (saucedemo.com login page, restful-booker docs), so they are safe to commit.
 * Never put real credentials here: read them from environment variables instead.
 */
export const uiUsers = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
} as const;

export const apiAdmin = {
  username: process.env.API_USERNAME ?? 'admin',
  password: process.env.API_PASSWORD ?? 'password123',
};
