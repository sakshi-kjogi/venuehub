import { apiClient } from '@/lib/apiClient';
import type { Venue, VenueFilters, PaginatedVenues } from '../types/venue.types';
import type { VenueFormValues } from '../venues.schemas';

function toQueryParams(filters: VenueFilters): Record<string, string> {
  const params: Record<string, string> = {
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page: String(filters.page),
    limit: String(filters.limit),
  };
  if (filters.search) params.search = filters.search;
  if (filters.city) params.city = filters.city;
  if (filters.minPrice !== undefined) params.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== undefined) params.maxPrice = String(filters.maxPrice);
  if (filters.minCapacity !== undefined) params.minCapacity = String(filters.minCapacity);
  if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');
  return params;
}

export async function fetchVenues(filters: VenueFilters): Promise<PaginatedVenues> {
  const { data } = await apiClient.get<PaginatedVenues>('/venues', {
    params: toQueryParams(filters),
  });
  return data;
}

export async function fetchMyVenues(): Promise<Venue[]> {
  const { data } = await apiClient.get<{ venues: Venue[] }>('/venues/mine');
  return data.venues;
}

export async function fetchVenueById(id: string): Promise<Venue> {
  const { data } = await apiClient.get<{ venue: Venue }>(`/venues/${id}`);
  return data.venue;
}

// VenueFormValues now matches the backend's create/update payload exactly
// (amenities is already string[]), so no toPayload transform is needed —
// the amenitiesText-splitting logic this used to have is gone for good.
export async function createVenueRequest(values: VenueFormValues): Promise<Venue> {
  const { data } = await apiClient.post<{ venue: Venue }>('/venues', values);
  return data.venue;
}

export async function updateVenueRequest(id: string, values: VenueFormValues): Promise<Venue> {
  const { data } = await apiClient.patch<{ venue: Venue }>(`/venues/${id}`, values);
  return data.venue;
}

export async function deleteVenueRequest(id: string): Promise<void> {
  await apiClient.delete(`/venues/${id}`);
}