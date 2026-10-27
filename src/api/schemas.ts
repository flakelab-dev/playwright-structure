import { z } from 'zod';

/** Schemas describe the API contract. Tests validate responses against them. */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const bookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: z.object({ checkin: isoDate, checkout: isoDate }),
  additionalneeds: z.string().optional(),
});

export const createBookingResponseSchema = z.object({
  bookingid: z.number().int().positive(),
  booking: bookingSchema,
});

/** GET /booking returns only ids, optionally filtered by query parameters. */
export const bookingIdsSchema = z.array(z.object({ bookingid: z.number().int().positive() }));

export const authResponseSchema = z.object({
  token: z.string().min(1),
});

/** Restful Booker answers wrong credentials with 200 and this body, not with 401. */
export const authFailureSchema = z.object({
  reason: z.string(),
});

export type Booking = z.infer<typeof bookingSchema>;
