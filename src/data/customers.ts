/** Data for the SauceDemo checkout form. */
export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Builds a complete customer. Override only the fields a test cares about,
 * e.g. buildCustomer({ postalCode: '' }) to leave a required field empty.
 */
export function buildCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    firstName: 'Flake',
    lastName: 'Lab',
    postalCode: '10001',
    ...overrides,
  };
}
