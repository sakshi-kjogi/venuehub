import type { Role } from '@prisma/client';

export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}