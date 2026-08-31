import { Link } from 'react-router-dom';
import { useMyVenuesQuery, useDeleteVenueMutation } from '@/features/venues/useVenueQueries';

export default function MyVenues() {
  const { data: venues, isLoading } = useMyVenuesQuery();
  const deleteMutation = useDeleteVenueMutation();

  if (isLoading) return <div className="mt-16 text-center text-gray-500">Loading…</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My venues</h1>
        <Link to="/venues/new" className="rounded bg-blue-600 px-4 py-2 text-white">
          + Add venue
        </Link>
      </div>
      <div className="mt-6 space-y-3">
        {venues?.map((venue) => (
          <div key={venue.id} className="flex items-center justify-between rounded border p-4">
            <div>
              <p className="font-medium">{venue.name}</p>
              <p className="text-sm text-gray-500">{venue.city}, {venue.country}</p>
            </div>
            <div className="flex gap-3">
              <Link to={`/venues/${venue.id}/edit`} className="text-sm text-blue-600">Edit</Link>
              <button
                onClick={() => {
                  if (confirm(`Delete "${venue.name}"? This can't be undone.`)) {
                    deleteMutation.mutate(venue.id);
                  }
                }}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {venues?.length === 0 && <p className="text-gray-500">You haven't listed any venues yet.</p>}
      </div>
    </div>
  );
}