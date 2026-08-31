import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { venueFormSchema, type VenueFormValues } from '@/features/venues/venues.schemas';
import {
  useVenueQuery, useCreateVenueMutation, useUpdateVenueMutation,
} from '@/features/venues/useVenueQueries';

export default function VenueForm() {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const { data: existingVenue } = useVenueQuery(id ?? '');
  const createMutation = useCreateVenueMutation();
  const updateMutation = useUpdateVenueMutation(id ?? '');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
  });

  useEffect(() => {
    if (isEditMode && existingVenue) {
      reset({
        name: existingVenue.name,
        description: existingVenue.description,
        address: existingVenue.address,
        city: existingVenue.city,
        country: existingVenue.country,
        capacity: existingVenue.capacity,
        pricePerDay: existingVenue.pricePerDay,
        amenitiesText: existingVenue.amenities.join(', '),
      });
    }
  }, [isEditMode, existingVenue, reset]);

  const onSubmit = (values: VenueFormValues) => {
    if (isEditMode) {
      updateMutation.mutate(values, { onSuccess: () => navigate(`/venues/${id}`) });
    } else {
      createMutation.mutate(values, { onSuccess: (venue) => navigate(`/venues/${venue.id}`) });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mx-auto mt-16 max-w-lg">
      <h1 className="text-2xl font-semibold">{isEditMode ? 'Edit venue' : 'List a new venue'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input {...register('name')} className="mt-1 w-full rounded border px-3 py-2" />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea {...register('description')} rows={3} className="mt-1 w-full rounded border px-3 py-2" />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input {...register('address')} className="mt-1 w-full rounded border px-3 py-2" />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium">City</label>
            <input {...register('city')} className="mt-1 w-full rounded border px-3 py-2" />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Country</label>
            <input {...register('country')} className="mt-1 w-full rounded border px-3 py-2" />
            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium">Capacity</label>
            <input type="number" {...register('capacity')} className="mt-1 w-full rounded border px-3 py-2" />
            {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Price per day (₹)</label>
            <input type="number" {...register('pricePerDay')} className="mt-1 w-full rounded border px-3 py-2" />
            {errors.pricePerDay && <p className="mt-1 text-sm text-red-600">{errors.pricePerDay.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Amenities (comma-separated)</label>
          <input {...register('amenitiesText')} placeholder="Parking, WiFi, Catering" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? 'Saving…' : isEditMode ? 'Save changes' : 'Create venue'}
        </button>
      </form>
    </div>
  );
}