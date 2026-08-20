import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function ProtectedRoute() {
  const { user, isBootstrapping } = useAuthStore();

  if (isBootstrapping) {
    // Avoid a flash-redirect to /login while the silent-refresh attempt is
    // still in flight on initial page load.
    return <div className="mt-16 text-center text-gray-500">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}