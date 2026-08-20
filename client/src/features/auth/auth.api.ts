import { apiClient } from '@/lib/apiClient';
import type { AuthResponse } from './auth.types';
import type { RegisterFormValues, LoginFormValues } from './auth.schemas';

export async function registerRequest(input: RegisterFormValues): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', input);
  return data;
}

export async function loginRequest(input: LoginFormValues): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', input);
  return data;
}

export async function refreshRequest(): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/refresh');
  return data;
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post('/auth/logout');
}