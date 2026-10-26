import { APIRequestContext, APIResponse } from '@playwright/test';
import { authResponseSchema, Booking, bookingSchema, createBookingResponseSchema } from './schemas';

/**
 * Thin wrapper over the Restful Booker API.
 * Tests call methods with intent ("createBooking") instead of building
 * requests by hand, and every successful response is checked against its schema here.
 * Methods ending in "Raw" return the response untouched, for tests about status codes.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async getToken(username: string, password: string): Promise<string> {
    const response = await this.request.post('/auth', { data: { username, password } });
    const body = authResponseSchema.parse(await jsonOrThrow(response));
    return body.token;
  }

  async createBooking(booking: Booking): Promise<{ id: number; booking: Booking }> {
    const response = await this.request.post('/booking', { data: booking });
    const body = createBookingResponseSchema.parse(await jsonOrThrow(response));
    return { id: body.bookingid, booking: body.booking };
  }

  async getBooking(id: number): Promise<Booking> {
    return bookingSchema.parse(await jsonOrThrow(await this.getBookingRaw(id)));
  }

  getBookingRaw(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  deleteBookingRaw(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
  }
}

/** Fails with the status and body, so a broken call is easy to diagnose from the report. */
async function jsonOrThrow(response: APIResponse): Promise<unknown> {
  if (!response.ok()) {
    throw new Error(`${response.url()} returned ${response.status()}: ${await response.text()}`);
  }
  return response.json();
}
