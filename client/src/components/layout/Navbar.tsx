import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-gray-900">
          VenueHub
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}