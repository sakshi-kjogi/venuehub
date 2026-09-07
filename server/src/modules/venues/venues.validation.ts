import { z } from 'zod';

export const createVenueSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  capacity: z.coerce.number().int().positive(),
  pricePerDay: z.coerce.number().positive(),
  amenities: z.array(z.string()).default([]),
});

export const updateVenueSchema = createVenueSchema.partial();

export type CreateVenueInput = z.infer<typeof createVenueSchema>;
export type UpdateVenueInput = z.infer<typeof updateVenueSchema>;

const VENUE_SORT_FIELDS = ['createdAt', 'pricePerDay', 'capacity', 'name'] as const;

export const venueQuerySchema = z
  .object({
    search: z.string().trim().min(1).optional(),
    city: z.string().trim().min(1).optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    minCapacity: z.coerce.number().int().nonnegative().optional(),
    amenities: z
      .string()
      .optional()
      .transform((val) =>
        val
          ? val
              .split(',')
              .map((a) => a.trim())
              .filter((a) => a.length > 0)
          : undefined
      ),
    sortBy: z.enum(VENUE_SORT_FIELDS).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
  })
  .refine(
    (data) => data.minPrice === undefined || data.maxPrice === undefined || data.minPrice <= data.maxPrice,
    { message: 'minPrice must be less than or equal to maxPrice', path: ['minPrice'] }
  );

export type VenueQueryInput = z.infer<typeof venueQuerySchema>;