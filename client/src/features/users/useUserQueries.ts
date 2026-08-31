import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, updateProfileRequest, changePasswordRequest } from './users.api';
import { useAuthStore } from '@/store/authStore';

export function useProfileQuery() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: (profile) => {
      queryClient.setQueryData(['profile'], profile);
      // Keep the Navbar/dashboard's cached name in sync immediately.
      if (accessToken) {
        setAuth(
          { id: profile.id, email: profile.email, firstName: profile.firstName, lastName: profile.lastName, role: profile.role },
          accessToken
        );
      }
    },
  });
}

export function useChangePasswordMutation() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: changePasswordRequest,
    onSuccess: () => {
      // Backend revoked the refresh token — reflect that locally too, so the
      // next API call's 401 doesn't trigger a confusing silent-refresh loop.
      clearAuth();
    },
  });
}