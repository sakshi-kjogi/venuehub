import { useEffect, useState } from 'react';
import { AMENITY_OPTIONS, type VenueFilters } from '../types/venue.types';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

interface DraftText {
  search: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  minCapacity: string;
}

function draftFromFilters(filters: VenueFilters): DraftText {
  return {
    search: filters.search ?? '',
    city: filters.city ?? '',
    minPrice: filters.minPrice?.toString() ?? '',
    maxPrice: filters.maxPrice?.toString() ?? '',
    minCapacity: filters.minCapacity?.toString() ?? '',
  };
}

interface VenueFiltersFormProps {
  filters: VenueFilters;
  setFilters: (patch: Partial<VenueFilters>, opts?: { resetPage?: boolean }) => void;
  resetFilters: () => void;
}

export function VenueFiltersForm({ filters, setFilters, resetFilters }: VenueFiltersFormProps) {
  const [draft, setDraft] = useState<DraftText>(() => draftFromFilters(filters));
  const debouncedDraft = useDebouncedValue(draft, 400);

  // If the URL changes from OUTSIDE this form (browser back/forward, or the
  // Reset button clearing all params), sync local draft to match it.
  useEffect(() => {
    setDraft(draftFromFilters(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.city, filters.minPrice, filters.maxPrice, filters.minCapacity]);

  // Push the debounced draft into the URL once typing has paused — but only
  // if it actually differs from what's already there, so settling on an
  // unchanged value doesn't push a redundant history/query update.
  useEffect(() => {
    const patch: Partial<VenueFilters> = {
      search: debouncedDraft.search.trim() || undefined,
      city: debouncedDraft.city.trim() || undefined,
      minPrice: debouncedDraft.minPrice ? Number(debouncedDraft.minPrice) : undefined,
      maxPrice: debouncedDraft.maxPrice ? Number(debouncedDraft.maxPrice) : undefined,
      minCapacity: debouncedDraft.minCapacity ? Number(debouncedDraft.minCapacity) : undefined,
    };
    const changed =
      patch.search !== filters.search ||
      patch.city !== filters.city ||
      patch.minPrice !== filters.minPrice ||
      patch.maxPrice !== filters.maxPrice ||
      patch.minCapacity !== filters.minCapacity;
    if (changed) {
      setFilters(patch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDraft]);

  function toggleAmenity(amenity: string) {
    const next = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    setFilters({ amenities: next });
  }

  function handleReset() {
    setDraft({ search: '', city: '', minPrice: '', maxPrice: '', minCapacity: '' });
    resetFilters();
  }

  return (
    <div className="mb-8 space-y-4 rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <input
          type="text"
          placeholder="Search name or description"
          value={draft.search}
          onChange={(e) => setDraft((d) => ({ ...d, search: e.target.value }))}
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <input
          type="text"
          placeholder="City"
          value={draft.city}
          onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ sortBy: e.target.value as VenueFilters['sortBy'] })}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          <option value="createdAt">Newest</option>
          <option value="pricePerDay">Price</option>
          <option value="capacity">Capacity</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <input
          type="number"
          min={0}
          placeholder="Min price"
          value={draft.minPrice}
          onChange={(e) => setDraft((d) => ({ ...d, minPrice: e.target.value }))}
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <input
          type="number"
          min={0}
          placeholder="Max price"
          value={draft.maxPrice}
          onChange={(e) => setDraft((d) => ({ ...d, maxPrice: e.target.value }))}
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <input
          type="number"
          min={0}
          placeholder="Min capacity"
          value={draft.minCapacity}
          onChange={(e) => setDraft((d) => ({ ...d, minCapacity: e.target.value }))}
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <select
          value={filters.sortOrder}
          onChange={(e) => setFilters({ sortOrder: e.target.value as VenueFilters['sortOrder'] })}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        {AMENITY_OPTIONS.map((amenity) => (
          <label key={amenity} className="flex items-center gap-1.5 text-sm">
            <input
              type="checkbox"
              checked={filters.amenities.includes(amenity)}
              onChange={() => toggleAmenity(amenity)}
            />
            {amenity}
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
      >
        Reset filters
      </button>
    </div>
  );
}