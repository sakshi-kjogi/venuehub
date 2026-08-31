import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { Role } from '@/features/auth/auth.types';

interface RoleProtectedRouteProps {
  allowedRoles: Role[];
}

export default function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
  const { user, isBootstrapping } = useAuthStore();

  if (isBootstrapping) {
    return <div className="mt-16 text-center text-gray-500">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Authenticated, just not permitted — send them somewhere useful,
    // not back to /login (they're not logged out, they're just not allowed here).
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}