import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  uploadVenueImageRequest, deleteVenueImageRequest, setCoverImageRequest,
} from './venueImages.api';

export function useUploadVenueImageMutation(venueId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadVenueImageRequest(venueId, file),
    onSuccess: (venue) => {
      // Write the fresh venue straight into cache — the detail page updates
      // instantly instead of waiting on a background refetch.
      queryClient.setQueryData(['venues', venueId], venue);
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}

export function useDeleteVenueImageMutation(venueId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) => deleteVenueImageRequest(venueId, imageId),
    onSuccess: (venue) => {
      queryClient.setQueryData(['venues', venueId], venue);
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}

export function useSetCoverImageMutation(venueId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) => setCoverImageRequest(venueId, imageId),
    onSuccess: (venue) => {
      queryClient.setQueryData(['venues', venueId], venue);
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}