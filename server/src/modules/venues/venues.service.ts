import { prisma } from '@/shared/database/prisma';
import { AppError } from '@/shared/middleware/errorHandler';
import type { CreateVenueInput, UpdateVenueInput, VenueQueryInput } from './venues.validation';
import type { VenuePublic } from './venues.types';
import type { Prisma, Role } from '@prisma/client';

export interface PaginatedVenues {
  data: VenuePublic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function toPublic(venue: {
  id: string; ownerId: string; name: string; description: string; address: string;
  city: string; country: string; capacity: number; pricePerDay: unknown;
  amenities: string[]; images: string[]; isPublished: boolean; createdAt: Date;
}): VenuePublic {
  return {
    id: venue.id,
    ownerId: venue.ownerId,
    name: venue.name,
    description: venue.description,
    address: venue.address,
    city: venue.city,
    country: venue.country,
    capacity: venue.capacity,
    pricePerDay: Number(venue.pricePerDay), // Decimal -> plain number for JSON
    amenities: venue.amenities,
    images: venue.images,
    isPublished: venue.isPublished,
    createdAt: venue.createdAt,
  };
}

function assertOwnerOrAdmin(venueOwnerId: string, userId: string, role: Role) {
  if (role !== 'ADMIN' && venueOwnerId !== userId) {
    throw new AppError('You do not have permission to modify this venue', 403);
  }
}

export async function listVenues(query: VenueQueryInput): Promise<PaginatedVenues> {
  const { search, city, minPrice, maxPrice, minCapacity, amenities, sortBy, sortOrder, page, limit } = query;

  // isPublished: true is a fixed, unconditional constraint — never merged
  // with or overridable by any of the dynamic filters below.
  const where: Prisma.VenueWhereInput = {
    isPublished: true,
    city: city ? { equals: city, mode: 'insensitive' } : undefined,
    pricePerDay:
      minPrice !== undefined || maxPrice !== undefined
        ? { gte: minPrice, lte: maxPrice }
        : undefined,
    capacity: minCapacity !== undefined ? { gte: minCapacity } : undefined,
    // hasEvery, not hasSome: selecting "Parking" + "AC" means venues with
    // BOTH, not either — filters narrow results, they don't broaden them.
    amenities: amenities && amenities.length > 0 ? { hasEvery: amenities } : undefined,
    OR: search
      ? [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      : undefined,
  };

  const skip = (page - 1) * limit;

  const [venues, total] = await Promise.all([
    prisma.venue.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.venue.count({ where }),
  ]);

  return {
    data: venues.map(toPublic),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function listMyVenues(userId: string): Promise<VenuePublic[]> {
  const venues = await prisma.venue.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
  });
  return venues.map(toPublic);
}

export async function getVenueById(id: string, userId?: string, role?: Role): Promise<VenuePublic> {
  const venue = await prisma.venue.findUnique({ where: { id } });
  if (!venue) {
    throw new AppError('Venue not found', 404);
  }
  const isOwnerOrAdmin = userId && (role === 'ADMIN' || venue.ownerId === userId);
  if (!venue.isPublished && !isOwnerOrAdmin) {
    throw new AppError('Venue not found', 404); // 404, not 403 — don't reveal unpublished venues exist
  }
  return toPublic(venue);
}

export async function createVenue(userId: string, input: CreateVenueInput): Promise<VenuePublic> {
  const venue = await prisma.venue.create({
    data: { ...input, ownerId: userId },
  });
  return toPublic(venue);
}

export async function updateVenue(
  id: string, userId: string, role: Role, input: UpdateVenueInput
): Promise<VenuePublic> {
  const existing = await prisma.venue.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Venue not found', 404);
  }
  assertOwnerOrAdmin(existing.ownerId, userId, role);

  const venue = await prisma.venue.update({ where: { id }, data: input });
  return toPublic(venue);
}

export async function deleteVenue(id: string, userId: string, role: Role): Promise<void> {
  const existing = await prisma.venue.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Venue not found', 404);
  }
  assertOwnerOrAdmin(existing.ownerId, userId, role);

  await prisma.venue.delete({ where: { id } });
}