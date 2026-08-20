import { create } from 'zustand';
import type { SafeUser } from '@/features/auth/auth.types';

interface AuthState {
  user: SafeUser | null;
  accessToken: string | null;
  isBootstrapping: boolean; // true until the initial silent-refresh attempt completes
  setAuth: (user: SafeUser, accessToken: string) => void;
  clearAuth: () => void;
  finishBootstrap: () => void;
}

// Deliberately NOT wrapped in Zustand's `persist` middleware — the access
// token must never survive a page reload in storage. App.tsx re-establishes
// the session on mount via the httpOnly refresh cookie instead.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isBootstrapping: true,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  clearAuth: () => set({ user: null, accessToken: null }),
  finishBootstrap: () => set({ isBootstrapping: false }),
}));