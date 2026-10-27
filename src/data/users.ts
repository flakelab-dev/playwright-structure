/**
 * Demo credentials. These are published on the demo sites themselves
 * (saucedemo.com login page, restful-booker docs), so they are safe to commit.
 * Never put real credentials here: read them from environment variables instead.
 */
export const uiUsers = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
} as const;

/**
 * User behind the loggedInPage fixture. Set UI_USER to run the suite as another
 * SauceDemo user, e.g. UI_USER=problem_user to check which tests catch its bugs.
 */
export const sessionUser = {
  username: process.env.UI_USER ?? uiUsers.standard.username,
  password: uiUsers.standard.password,
};

export const apiAdmin = {
  username: process.env.API_USERNAME ?? 'admin',
  password: process.env.API_PASSWORD ?? 'password123',
};
