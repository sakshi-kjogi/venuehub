import { apiClient } from '@/lib/apiClient';
import type { UserProfile } from './users.types';
import type { UpdateProfileFormValues, ChangePasswordFormValues } from './users.schemas';

export async function fetchProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<{ profile: UserProfile }>('/users/me');
  return data.profile;
}

export async function updateProfileRequest(input: UpdateProfileFormValues): Promise<UserProfile> {
  const { data } = await apiClient.patch<{ profile: UserProfile }>('/users/me', input);
  return data.profile;
}

export async function changePasswordRequest(input: ChangePasswordFormValues): Promise<void> {
  await apiClient.patch('/users/me/password', {
    currentPassword: input.currentPassword,
    newPassword: input.newPassword,
  });
}