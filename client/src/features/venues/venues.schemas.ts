import { z } from 'zod';

export const venueFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  capacity: z.coerce.number().int().positive('Capacity must be a positive number'),
  pricePerDay: z.coerce.number().positive('Price must be a positive number'),
  amenitiesText: z.string(), // comma-separated in the UI, split before sending
});

export type VenueFormValues = z.infer<typeof venueFormSchema>;