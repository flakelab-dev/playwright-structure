import { randomUUID } from 'node:crypto';
import type { Booking } from '../api/schemas';

/**
 * Builds a valid booking. Override only the fields a test cares about,
 * so each test states its intent and stays independent of the others.
 */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Flake',
    lastname: `Lab-${randomUUID().slice(0, 8)}`,
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
