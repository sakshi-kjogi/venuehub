import { useParams, Link } from 'react-router-dom';
import { useVenueQuery } from '@/features/venues/useVenueQueries';
import { useAuthStore } from '@/store/authStore';
import { VenueImageManager } from '@/features/venues/components/VenueImageManager';

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: venue, isLoading, isError } = useVenueQuery(id!);
  const user = useAuthStore((s) => s.user);

  if (isLoading) return <div className="mt-16 text-center text-gray-500">Loading…</div>;
  if (isError || !venue) return <div className="mt-16 text-center text-red-600">Venue not found.</div>;

  const canEdit = user && (user.role === 'ADMIN' || user.id === venue.ownerId);
  const coverImage = venue.images.find((img) => img.isCover) ?? venue.images[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {coverImage && (
        <img
          src={coverImage.url}
          alt={venue.name}
          className="mb-6 h-64 w-full rounded-lg object-cover"
        />
      )}

      <h1 className="text-3xl font-bold">{venue.name}</h1>
      <p className="mt-1 text-gray-500">{venue.address}, {venue.city}, {venue.country}</p>
      <p className="mt-4 text-gray-700">{venue.description}</p>
      <div className="mt-4 flex gap-6 text-sm text-gray-600">
        <span>Capacity: {venue.capacity}</span>
        <span className="font-medium text-blue-600">₹{venue.pricePerDay.toLocaleString()} / day</span>
      </div>
      {venue.amenities.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Amenities</h2>
          <ul className="mt-1 list-inside list-disc text-gray-700">
            {venue.amenities.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </div>
      )}
      {canEdit && (
        <>
          <Link to={`/venues/${venue.id}/edit`} className="mt-6 inline-block rounded bg-gray-800 px-4 py-2 text-white">
            Edit venue
          </Link>
          <VenueImageManager venueId={venue.id} images={venue.images} />
        </>
      )}
    </div>
  );
}