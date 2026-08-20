import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/store/authStore";

// ---- Day 3: minimal fetch wrapper, kept for existing callers (e.g. Home.tsx) ----
export type ApiResponse<T> = T & {
  success: boolean;
  message?: string;
};

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${env.apiBaseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// ---- Day 4: Axios instance with auth interceptors ----
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true, // sends the httpOnly refresh cookie automatically
});

// Attach the in-memory access token to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Silent-refresh queueing ---
// Multiple requests can 401 at the same moment. We want exactly ONE refresh
// call, and every queued request retried once it resolves.
let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  queue.forEach((resolve) => resolve(token));
  queue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isUnauthorized = error.response?.status === 401;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (!isUnauthorized || isRefreshCall || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // A refresh is already in flight, wait for it instead of firing another.
      return new Promise((resolve, reject) => {
        queue.push((token) => {
          if (!token) return reject(error);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await apiClient.post("/auth/refresh");
      useAuthStore.getState().setAuth(data.user, data.accessToken);
      flushQueue(data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();
      flushQueue(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);