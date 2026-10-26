import { expect, test } from '../../src/fixtures';
import { buildBooking } from '../../src/data/bookings';

test.describe('Booking API', () => {
  test('created booking can be read back', async ({ bookingClient }) => {
    const input = buildBooking();

    const { id } = await bookingClient.createBooking(input);
    const stored = await bookingClient.getBooking(id);

    expect(stored).toEqual(input);
  });

  test('deleted booking is no longer found', async ({ bookingClient, authToken }) => {
    const { id } = await bookingClient.createBooking(buildBooking());

    const deleteResponse = await bookingClient.deleteBookingRaw(id, authToken);
    expect(deleteResponse.status()).toBe(201); // Restful Booker returns 201 on delete.

    const getResponse = await bookingClient.getBookingRaw(id);
    expect(getResponse.status()).toBe(404);
  });
});
