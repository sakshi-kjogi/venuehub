import { env } from "@/config/env";

export type ApiResponse<T> = T & {
  success: boolean;
  message?: string;
};

/**
 * Minimal fetch wrapper. Intentionally simple today, this proves
 * connectivity to the backend. A more complete client (auth headers,
 * TanStack Query integration, typed error handling) arrives on Day 4
 * once there's an actual auth token to attach to requests.
 */
export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${env.apiBaseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}