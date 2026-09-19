import { prisma } from '@/shared/database/prisma';
import { AppError } from '@/shared/middleware/errorHandler';
import { cloudinary } from '@/shared/config/cloudinary';
import type { CreateVenueInput, UpdateVenueInput, VenueQueryInput } from './venues.validation';
import type { VenuePublic, VenueImagePublic } from './venues.types';
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

type VenueWithImages = Prisma.VenueGetPayload<{ include: { images: true } }>;

function toPublic(venue: VenueWithImages): VenuePublic {
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
    images: venue.images
      .map((img): VenueImagePublic => ({
        id: img.id,
        url: img.url,
        isCover: img.isCover,
        createdAt: img.createdAt.toISOString(),
      }))
      .sort((a, b) => Number(b.isCover) - Number(a.isCover)), // cover image first
    isPublished: venue.isPublished,
    createdAt: venue.createdAt.toISOString(),
  };
}

function assertOwnerOrAdmin(venueOwnerId: string, userId: string, role: Role) {
  if (role !== 'ADMIN' && venueOwnerId !== userId) {
    throw new AppError('You do not have permission to modify this venue', 403);
  }
}

export async function listVenues(query: VenueQueryInput): Promise<PaginatedVenues> {
  const { search, city, minPrice, maxPrice, minCapacity, amenities, sortBy, sortOrder, page, limit } = query;
  const where: Prisma.VenueWhereInput = {
    isPublished: true,
    city: city ? { equals: city, mode: 'insensitive' } : undefined,
    pricePerDay:
      minPrice !== undefined || maxPrice !== undefined
        ? { gte: minPrice, lte: maxPrice }
        : undefined,
    capacity: minCapacity !== undefined ? { gte: minCapacity } : undefined,
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
      include: { images: true },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.venue.count({ where }),
  ]);
  return {
    data: venues.map(toPublic),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function listMyVenues(userId: string): Promise<VenuePublic[]> {
  const venues = await prisma.venue.findMany({
    where: { ownerId: userId },
    include: { images: true },
    orderBy: { createdAt: 'desc' },
  });
  return venues.map(toPublic);
}

export async function getVenueById(id: string, userId?: string, role?: Role): Promise<VenuePublic> {
  const venue = await prisma.venue.findUnique({ where: { id }, include: { images: true } });
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
    include: { images: true },
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
  const venue = await prisma.venue.update({
    where: { id },
    data: input,
    include: { images: true },
  });
  return toPublic(venue);
}

export async function deleteVenue(id: string, userId: string, role: Role): Promise<void> {
  const existing = await prisma.venue.findUnique({ where: { id }, include: { images: true } });
  if (!existing) {
    throw new AppError('Venue not found', 404);
  }
  assertOwnerOrAdmin(existing.ownerId, userId, role);

  // The DB cascade (onDelete: Cascade on VenueImage.venue) cleans up the
  // venue_images ROWS automatically. It cannot touch Cloudinary — that's an
  // external system — so each asset is explicitly destroyed there first.
  // A failed Cloudinary delete is logged, not thrown: see Section 2.5.
  await Promise.all(
    existing.images.map((img) =>
      cloudinary.uploader.destroy(img.publicId).catch((err) => {
        console.error(`Failed to delete Cloudinary asset ${img.publicId}:`, err);
      })
    )
  );

  await prisma.venue.delete({ where: { id } });
}

function uploadBufferToCloudinary(
  buffer: Buffer, folder: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'));
      resolve({ secure_url: result.secure_url, public_id: result.public_id });
    });
    stream.end(buffer);
  });
}

export async function addVenueImage(
  venueId: string, userId: string, role: Role, fileBuffer: Buffer
): Promise<VenuePublic> {
  const venue = await prisma.venue.findUnique({ where: { id: venueId }, include: { images: true } });
  if (!venue) {
    throw new AppError('Venue not found', 404);
  }
  assertOwnerOrAdmin(venue.ownerId, userId, role);

  const { secure_url, public_id } = await uploadBufferToCloudinary(fileBuffer, `venuehub/venues/${venueId}`);

  await prisma.venueImage.create({
    data: {
      venueId,
      url: secure_url,
      publicId: public_id,
      isCover: venue.images.length === 0, // first image uploaded becomes the cover automatically
    },
  });

  const updated = await prisma.venue.findUniqueOrThrow({ where: { id: venueId }, include: { images: true } });
  return toPublic(updated);
}

export async function deleteVenueImage(
  venueId: string, imageId: string, userId: string, role: Role
): Promise<VenuePublic> {
  const venue = await prisma.venue.findUnique({ where: { id: venueId }, include: { images: true } });
  if (!venue) {
    throw new AppError('Venue not found', 404);
  }
  assertOwnerOrAdmin(venue.ownerId, userId, role);

  const image = venue.images.find((img) => img.id === imageId);
  if (!image) {
    throw new AppError('Image not found on this venue', 404);
  }

  await cloudinary.uploader.destroy(image.publicId).catch((err) => {
    console.error(`Failed to delete Cloudinary asset ${image.publicId}:`, err);
  });
  await prisma.venueImage.delete({ where: { id: imageId } });

  // If the deleted image was the cover and other images remain, promote the
  // oldest remaining one so a cover always exists whenever images do.
  if (image.isCover) {
    const remaining = venue.images.filter((img) => img.id !== imageId);
    if (remaining.length > 0) {
      const nextCover = remaining.reduce((oldest, img) =>
        img.createdAt < oldest.createdAt ? img : oldest
      );
      await prisma.venueImage.update({ where: { id: nextCover.id }, data: { isCover: true } });
    }
  }

  const updated = await prisma.venue.findUniqueOrThrow({ where: { id: venueId }, include: { images: true } });
  return toPublic(updated);
}

export async function setCoverImage(
  venueId: string, imageId: string, userId: string, role: Role
): Promise<VenuePublic> {
  const venue = await prisma.venue.findUnique({ where: { id: venueId }, include: { images: true } });
  if (!venue) {
    throw new AppError('Venue not found', 404);
  }
  assertOwnerOrAdmin(venue.ownerId, userId, role);

  const image = venue.images.find((img) => img.id === imageId);
  if (!image) {
    throw new AppError('Image not found on this venue', 404);
  }

  // Two writes need to happen together: unset whichever image was
  // previously the cover, and set the new one. A $transaction ensures a
  // crash between the two statements can never leave the venue with zero
  // covers or two covers. See Section 3.
  await prisma.$transaction([
    prisma.venueImage.updateMany({ where: { venueId, isCover: true }, data: { isCover: false } }),
    prisma.venueImage.update({ where: { id: imageId }, data: { isCover: true } }),
  ]);

  const updated = await prisma.venue.findUniqueOrThrow({ where: { id: venueId }, include: { images: true } });
  return toPublic(updated);
}