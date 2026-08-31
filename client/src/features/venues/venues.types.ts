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
  images: string[];
  isPublished: boolean;
  createdAt: string;
}