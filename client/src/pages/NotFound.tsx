import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-gray-900">404 — Page Not Found</h1>
      <p className="mt-4 text-gray-600">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="mt-6 inline-block text-blue-600 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}