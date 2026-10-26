import { randomUUID } from 'node:crypto';
import { expect, test } from '../../src/fixtures';
import { buildBooking } from '../../src/data/bookings';

test.describe('Booking API: updates', () => {
  test('PUT replaces every field of a booking', async ({ bookingClient, authToken }) => {
    const { id } = await bookingClient.createBooking(buildBooking());
    const replacement = buildBooking({
      firstname: 'Updated',
      totalprice: 320,
      depositpaid: false,
      bookingdates: { checkin: '2027-01-10', checkout: '2027-01-14' },
      additionalneeds: 'Late checkout',
    });

    const returned = await bookingClient.updateBooking(id, replacement, authToken);

    expect(returned).toEqual(replacement);
    expect(await bookingClient.getBooking(id)).toEqual(replacement);
  });

  test('PATCH changes only the given fields', async ({ bookingClient, authToken }) => {
    const original = buildBooking();
    const { id } = await bookingClient.createBooking(original);
    const changes = { firstname: 'Patched', totalprice: 999 };

    const returned = await bookingClient.partialUpdateBooking(id, changes, authToken);

    const expected = { ...original, ...changes };
    expect(returned).toEqual(expected);
    expect(await bookingClient.getBooking(id)).toEqual(expected);
  });
});

test.describe('Booking API: search', () => {
  test('filtering by first name returns the matching booking', async ({ bookingClient }) => {
    // A unique name, so other bookings on the shared public instance cannot match.
    const firstname = `Flake-${randomUUID().slice(0, 8)}`;
    const { id } = await bookingClient.createBooking(buildBooking({ firstname }));

    const ids = await bookingClient.getBookingIds({ firstname });

    expect(ids).toEqual([id]);
  });
});

test.describe('Booking API: validation', () => {
  test('creating a booking without required fields is rejected', async ({ bookingClient }) => {
    const { lastname, totalprice, bookingdates, ...incomplete } = buildBooking();

    const response = await bookingClient.createBookingRaw(incomplete);

    // Restful Booker answers 500 here rather than 400; the test checks rejection, not the code.
    expect(response.ok(), `expected rejection, got ${response.status()}`).toBe(false);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
