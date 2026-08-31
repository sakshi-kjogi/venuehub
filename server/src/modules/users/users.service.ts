import { prisma } from '@/shared/database/prisma';
import { compareValue, hashValue } from '@/shared/utils/password';
import { AppError } from '@/shared/middleware/errorHandler';
import type { UpdateProfileInput, ChangePasswordInput } from './users.validation';
import type { UserProfile } from './users.types';

function toProfile(user: {
  id: string; email: string; firstName: string; lastName: string;
  phone: string | null; bio: string | null; avatarUrl: string | null;
  city: string | null; country: string | null; role: UserProfile['role'];
  createdAt: Date;
}): UserProfile {
  const { id, email, firstName, lastName, phone, bio, avatarUrl, city, country, role, createdAt } = user;
  return { id, email, firstName, lastName, phone, bio, avatarUrl, city, country, role, createdAt };
}

export async function getProfile(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return toProfile(user);
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile> {
  const user = await prisma.user.update({ where: { id: userId }, data: input });
  return toProfile(user);
}

export async function changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const currentMatches = await compareValue(input.currentPassword, user.password);
  if (!currentMatches) {
    throw new AppError('Current password is incorrect', 401);
  }

  const newHashedPassword = await hashValue(input.newPassword);

  // Revoke the existing session on password change — anyone with an old
  // refresh token (e.g. a stolen cookie) is logged out everywhere.
  await prisma.user.update({
    where: { id: userId },
    data: { password: newHashedPassword, refreshToken: null },
  });
}