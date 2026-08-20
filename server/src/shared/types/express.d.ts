import type { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
      };
    }
  }
}

// Required to make this a module (not a global script) so declaration merging works correctly.
export {};