import { apiClient } from '@/lib/apiClient';
import type { Venue } from './venues.types';
import type { VenueFormValues } from './venues.schemas';

function toPayload(values: VenueFormValues) {
  const { amenitiesText, ...rest } = values;
  return {
    ...rest,
    amenities: amenitiesText
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean),
  };
}

export async function fetchVenues(): Promise<Venue[]> {
  const { data } = await apiClient.get<{ venues: Venue[] }>('/venues');
  return data.venues;
}

export async function fetchMyVenues(): Promise<Venue[]> {
  const { data } = await apiClient.get<{ venues: Venue[] }>('/venues/mine');
  return data.venues;
}

export async function fetchVenueById(id: string): Promise<Venue> {
  const { data } = await apiClient.get<{ venue: Venue }>(`/venues/${id}`);
  return data.venue;
}

export async function createVenueRequest(values: VenueFormValues): Promise<Venue> {
  const { data } = await apiClient.post<{ venue: Venue }>('/venues', toPayload(values));
  return data.venue;
}

export async function updateVenueRequest(id: string, values: VenueFormValues): Promise<Venue> {
  const { data } = await apiClient.patch<{ venue: Venue }>(`/venues/${id}`, toPayload(values));
  return data.venue;
}

export async function deleteVenueRequest(id: string): Promise<void> {
  await apiClient.delete(`/venues/${id}`);
}