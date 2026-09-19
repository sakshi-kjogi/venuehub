import { apiClient } from '@/lib/apiClient';
import type { Venue } from './types/venue.types';

// No explicit Content-Type is set here — apiClient has no default JSON
// header override (verified), so Axios lets the browser auto-detect
// FormData and set the correct multipart/form-data boundary itself.
export async function uploadVenueImageRequest(venueId: string, file: File): Promise<Venue> {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await apiClient.post<{ venue: Venue }>(`/venues/${venueId}/images`, formData);
  return data.venue;
}

export async function deleteVenueImageRequest(venueId: string, imageId: string): Promise<Venue> {
  const { data } = await apiClient.delete<{ venue: Venue }>(`/venues/${venueId}/images/${imageId}`);
  return data.venue;
}

export async function setCoverImageRequest(venueId: string, imageId: string): Promise<Venue> {
  const { data } = await apiClient.patch<{ venue: Venue }>(`/venues/${venueId}/images/${imageId}/cover`);
  return data.venue;
}