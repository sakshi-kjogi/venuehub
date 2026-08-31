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