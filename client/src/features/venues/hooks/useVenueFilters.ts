import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { VenueFilters, VenueSortField, SortOrder } from '../types/venue.types';

const SORT_FIELDS: VenueSortField[] = ['createdAt', 'pricePerDay', 'capacity', 'name'];
const SORT_ORDERS: SortOrder[] = ['asc', 'desc'];
const DEFAULT_SORT_BY: VenueSortField = 'createdAt';
const DEFAULT_SORT_ORDER: SortOrder = 'desc';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

function parseFilters(params: URLSearchParams): VenueFilters {
  const search = params.get('search') ?? undefined;
  const city = params.get('city') ?? undefined;
  const minPriceRaw = params.get('minPrice');
  const maxPriceRaw = params.get('maxPrice');
  const minCapacityRaw = params.get('minCapacity');
  const amenitiesRaw = params.get('amenities');
  const amenities = amenitiesRaw
    ? amenitiesRaw.split(',').map((a) => a.trim()).filter((a) => a.length > 0)
    : [];
  const sortByRaw = params.get('sortBy');
  const sortBy = SORT_FIELDS.includes(sortByRaw as VenueSortField)
    ? (sortByRaw as VenueSortField)
    : DEFAULT_SORT_BY;
  const sortOrderRaw = params.get('sortOrder');
  const sortOrder = SORT_ORDERS.includes(sortOrderRaw as SortOrder)
    ? (sortOrderRaw as SortOrder)
    : DEFAULT_SORT_ORDER;
  const pageRaw = Number(params.get('page'));
  const page = Number.isInteger(pageRaw) && pageRaw >= 1 ? pageRaw : DEFAULT_PAGE;
  const limitRaw = Number(params.get('limit'));
  const limit = Number.isInteger(limitRaw) && limitRaw >= 1 && limitRaw <= 50 ? limitRaw : DEFAULT_LIMIT;
  return {
    search,
    city,
    minPrice: minPriceRaw ? Number(minPriceRaw) : undefined,
    maxPrice: maxPriceRaw ? Number(maxPriceRaw) : undefined,
    minCapacity: minCapacityRaw ? Number(minCapacityRaw) : undefined,
    amenities,
    sortBy,
    sortOrder,
    page,
    limit,
  };
}

function serializeFilters(filters: VenueFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.city) params.set('city', filters.city);
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters.minCapacity !== undefined) params.set('minCapacity', String(filters.minCapacity));
  if (filters.amenities.length > 0) params.set('amenities', filters.amenities.join(','));
  if (filters.sortBy !== DEFAULT_SORT_BY) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder !== DEFAULT_SORT_ORDER) params.set('sortOrder', filters.sortOrder);
  if (filters.page !== DEFAULT_PAGE) params.set('page', String(filters.page));
  if (filters.limit !== DEFAULT_LIMIT) params.set('limit', String(filters.limit));
  return params;
}

/**
 * Filter state lives entirely in the URL query string. `filters` is derived
 * fresh from `useSearchParams` on every render (no separate useState to
 * drift out of sync).
 *
 * `setFilters`/`setFilter` both use the FUNCTIONAL updater form of
 * `setSearchParams` — (prevParams) => nextParams — instead of closing over
 * the `filters` value from the render that scheduled the update. Without
 * this, two filter changes fired in the same tick (e.g. a debounced search
 * value and a city value settling together) would both read the same
 * stale `filters` snapshot, and the second call would silently overwrite
 * the first's change. The functional form always computes from the latest
 * committed search params, so same-tick updates merge instead of clobbering
 * each other.
 *
 * Changing any filter resets `page` back to 1, unless the change IS to
 * `page` itself — changing a filter while on page 3 of the old results
 * should never leave you stranded on an empty page 3 of the new ones.
 */
export function useVenueFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const setFilters = useCallback(
    (patch: Partial<VenueFilters>, opts: { resetPage?: boolean } = {}) => {
      const resetPage = opts.resetPage ?? !('page' in patch);
      setSearchParams((prev) => {
        const current = parseFilters(prev);
        const next: VenueFilters = {
          ...current,
          ...patch,
          page: patch.page !== undefined ? patch.page : resetPage ? DEFAULT_PAGE : current.page,
        };
        return serializeFilters(next);
      });
    },
    [setSearchParams]
  );

  const setFilter = useCallback(
    <K extends keyof VenueFilters>(key: K, value: VenueFilters[K]) => {
      setFilters({ [key]: value } as Partial<VenueFilters>);
    },
    [setFilters]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { filters, setFilter, setFilters, resetFilters };
}