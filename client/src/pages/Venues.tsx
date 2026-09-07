import { Link } from 'react-router-dom';
import { useVenuesQuery } from '@/features/venues/useVenueQueries';
import { useVenueFilters } from '@/features/venues/hooks/useVenueFilters';
import { VenueFiltersForm } from '@/features/venues/components/VenueFiltersForm';
import { Pagination } from '@/features/venues/components/Pagination';

export default function Venues() {
  const { filters, setFilter, setFilters, resetFilters } = useVenueFilters();
  const { data: result, isLoading, isError, isPlaceholderData } = useVenuesQuery(filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Venues</h1>

      <VenueFiltersForm filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

      {isLoading && <div className="mt-16 text-center text-gray-500">Loading venues…</div>}
      {isError && <div className="mt-16 text-center text-red-600">Could not load venues.</div>}

      {result && (
        <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : ''}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((venue) => (
              <Link
                key={venue.id}
                to={`/venues/${venue.id}`}
                className="block rounded-lg border border-gray-200 p-4 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold">{venue.name}</h2>
                <p className="text-sm text-gray-500">{venue.city}, {venue.country}</p>
                <p className="mt-2 text-sm text-gray-700">Capacity: {venue.capacity}</p>
                <p className="mt-1 font-medium text-blue-600">₹{venue.pricePerDay.toLocaleString()} / day</p>
              </Link>
            ))}
          </div>

          {result.data.length === 0 && (
            <p className="mt-8 text-gray-500">No venues match your filters.</p>
          )}

          <Pagination
            page={result.pagination.page}
            totalPages={result.pagination.totalPages}
            onPageChange={(page) => setFilter('page', page)}
          />
        </div>
      )}
    </div>
  );
}