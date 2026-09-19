export interface VenueImage {
  id: string;
  url: string;
  isCover: boolean;
  createdAt: string;
}

export interface Venue {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
  images: VenueImage[];
  isPublished: boolean;
  createdAt: string;
}

export type VenueSortField = 'createdAt' | 'pricePerDay' | 'capacity' | 'name';
export type SortOrder = 'asc' | 'desc';

export interface VenueFilters {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  amenities: string[];
  sortBy: VenueSortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}

export interface VenuePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedVenues {
  data: Venue[];
  pagination: VenuePagination;
}

// Canonical amenity vocabulary — shared by VenueForm (creation/edit) and
// VenueFiltersForm (search) so a value picked when listing a venue is
// guaranteed to match a value selectable in the filter.
export const AMENITY_OPTIONS = [
  'Parking', 'WiFi', 'AC', 'Catering', 'Sound System', 'Stage', 'Generator', 'Decor',
] as const;