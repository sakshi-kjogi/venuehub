import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchVenues, fetchMyVenues, fetchVenueById,
  createVenueRequest, updateVenueRequest, deleteVenueRequest,
} from './venues.api';
import type { VenueFormValues } from './venues.schemas';

export function useVenuesQuery() {
  return useQuery({ queryKey: ['venues'], queryFn: fetchVenues });
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