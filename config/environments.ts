/**
 * One place for every URL the tests talk to.
 * Pick an environment with TEST_ENV (defaults to "demo").
 * Add "staging", "prod", etc. here instead of hardcoding URLs in tests.
 */
export interface Environment {
  name: string;
  uiBaseUrl: string;
  apiBaseUrl: string;
}

const environments: Record<string, Environment> = {
  demo: {
    name: 'demo',
    uiBaseUrl: 'https://www.saucedemo.com',
    apiBaseUrl: 'https://restful-booker.herokuapp.com',
  },
};

export function getEnvironment(): Environment {
  const name = process.env.TEST_ENV ?? 'demo';
  const env = environments[name];
  if (!env) {
    throw new Error(
      `Unknown TEST_ENV "${name}". Available: ${Object.keys(environments).join(', ')}`,
    );
  }
  return env;
}
