import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useLogoutMutation } from "@/features/auth/useAuthMutations";

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-gray-900">
          VenueHub
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-900">
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-gray-900">
                Profile
              </Link>
              <span className="text-gray-400">|</span>
              <span>{user.firstName}</span>
              <button
                onClick={() => {
                  logoutMutation.mutate();
                  navigate("/login");
                }}
                className="hover:text-gray-900"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-900">
                Log in
              </Link>
              <Link to="/register" className="hover:text-gray-900">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}