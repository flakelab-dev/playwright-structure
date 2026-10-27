import { APIRequestContext, APIResponse } from '@playwright/test';
import {
  authFailureSchema,
  authResponseSchema,
  Booking,
  bookingIdsSchema,
  bookingSchema,
  createBookingResponseSchema,
} from './schemas';

/** Query parameters accepted by GET /booking. Dates are YYYY-MM-DD. */
export interface BookingFilter {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

/**
 * Thin wrapper over the Restful Booker API.
 * Tests call methods with intent ("createBooking") instead of building
 * requests by hand, and every successful response is checked against its schema here.
 * Methods ending in "Raw" return the response untouched, for tests about status codes.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async getToken(username: string, password: string): Promise<string> {
    const body = await jsonOrThrow(await this.getTokenRaw(username, password));
    const failure = authFailureSchema.safeParse(body);
    if (failure.success) {
      throw new Error(`Authentication failed: ${failure.data.reason}`);
    }
    return authResponseSchema.parse(body).token;
  }

  getTokenRaw(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  async createBooking(booking: Booking): Promise<{ id: number; booking: Booking }> {
    const response = await this.createBookingRaw(booking);
    const body = createBookingResponseSchema.parse(await jsonOrThrow(response));
    return { id: body.bookingid, booking: body.booking };
  }

  /** Accepts any payload on purpose, so tests can send invalid bookings. */
  createBookingRaw(payload: unknown): Promise<APIResponse> {
    return this.request.post('/booking', { data: payload });
  }

  async getBooking(id: number): Promise<Booking> {
    return bookingSchema.parse(await jsonOrThrow(await this.getBookingRaw(id)));
  }

  getBookingRaw(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  /** Returns the ids of the bookings that match every field in the filter. */
  async getBookingIds(filter: BookingFilter = {}): Promise<number[]> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined) params.set(key, value);
    }
    const response = await this.request.get('/booking', { params });
    return bookingIdsSchema.parse(await jsonOrThrow(response)).map((item) => item.bookingid);
  }

  /** PUT: replaces the whole booking. */
  async updateBooking(id: number, booking: Booking, token: string): Promise<Booking> {
    const response = await this.request.put(`/booking/${id}`, {
      data: booking,
      headers: authHeaders(token),
    });
    return bookingSchema.parse(await jsonOrThrow(response));
  }

  /** PATCH: changes only the given fields and returns the full booking. */
  async partialUpdateBooking(
    id: number,
    changes: Partial<Booking>,
    token: string,
  ): Promise<Booking> {
    const response = await this.request.patch(`/booking/${id}`, {
      data: changes,
      headers: authHeaders(token),
    });
    return bookingSchema.parse(await jsonOrThrow(response));
  }

  deleteBookingRaw(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: authHeaders(token) });
  }
}

/** Restful Booker reads the auth token from a cookie. */
function authHeaders(token: string): Record<string, string> {
  return { Cookie: `token=${token}` };
}

/** Fails with the status and body, so a broken call is easy to diagnose from the report. */
async function jsonOrThrow(response: APIResponse): Promise<unknown> {
  if (!response.ok()) {
    throw new Error(`${response.url()} returned ${response.status()}: ${await response.text()}`);
  }
  return response.json();
}
