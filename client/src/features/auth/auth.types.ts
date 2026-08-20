export type Role = 'CUSTOMER' | 'VENUE_OWNER' | 'VENDOR' | 'ADMIN';

export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResponse {
  user: SafeUser;
  accessToken: string;
}