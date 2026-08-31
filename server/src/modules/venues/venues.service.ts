import { prisma } from '@/shared/database/prisma';
import { AppError } from '@/shared/middleware/errorHandler';
import type { CreateVenueInput, UpdateVenueInput } from './venues.validation';
import type { VenuePublic } from './venues.types';
import type { Role } from '@prisma/client';

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

export async function listVenues(): Promise<VenuePublic[]> {
  const venues = await prisma.venue.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });
  return venues.map(toPublic);
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