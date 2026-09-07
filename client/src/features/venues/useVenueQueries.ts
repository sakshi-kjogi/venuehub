import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchVenues, fetchMyVenues, fetchVenueById,
  createVenueRequest, updateVenueRequest, deleteVenueRequest,
} from './api/venues.api';
import type { VenueFormValues } from './venues.schemas';
import type { VenueFilters } from './types/venue.types';

export function useVenuesQuery(filters: VenueFilters) {
  return useQuery({
    queryKey: ['venues', filters],
    queryFn: () => fetchVenues(filters),
    placeholderData: keepPreviousData,
  });
}

export function useMyVenuesQuery() {
  return useQuery({ queryKey: ['venues', 'mine'], queryFn: fetchMyVenues });
}

export function useVenueQuery(id: string) {
  return useQuery({ queryKey: ['venues', id], queryFn: () => fetchVenueById(id), enabled: !!id });
}

export function useCreateVenueMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: VenueFormValues) => createVenueRequest(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}

export function useUpdateVenueMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: VenueFormValues) => updateVenueRequest(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}

export function useDeleteVenueMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVenueRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}