import { useAuthStore } from '@/store/authStore';
import { useLogoutMutation } from '@/features/auth/useAuthMutations';

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogoutMutation();

  return (
    <div className="mx-auto mt-16 max-w-md">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome, {user?.firstName} {user?.lastName} — role: {user?.role}
      </p>
      <button
        onClick={() => logoutMutation.mutate()}
        className="mt-6 rounded bg-gray-800 px-4 py-2 text-white"
      >
        Log out
      </button>
    </div>
  );
}