import { prisma } from '@/shared/database/prisma';
import { hashValue, compareValue } from '@/shared/utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/shared/utils/jwt';
import { AppError } from '@/shared/middleware/errorHandler';
import type { RegisterInput, LoginInput } from './auth.validation';
import type { AuthResult, SafeUser } from './auth.types';

function toSafeUser(user: {
  id: string; email: string; firstName: string; lastName: string; role: SafeUser['role'];
}): SafeUser {
  const { id, email, firstName, lastName, role } = user;
  return { id, email, firstName, lastName, role };
}

async function issueTokenPair(userId: string, role: SafeUser['role']) {
  const accessToken = signAccessToken({ userId, role });
  const refreshToken = signRefreshToken({ userId, role });
  const refreshTokenHash = await hashValue(refreshToken);

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: refreshTokenHash },
  });

  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const hashedPassword = await hashValue(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role, // validated against ['CUSTOMER','VENUE_OWNER','VENDOR'] — ADMIN is never accepted here
    },
  });

  const { accessToken, refreshToken } = await issueTokenPair(user.id, user.role);
  return { user: toSafeUser(user), accessToken, refreshToken };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await compareValue(input.password, user.password);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  const { accessToken, refreshToken } = await issueTokenPair(user.id, user.role);
  return { user: toSafeUser(user), accessToken, refreshToken };
}

export async function refresh(incomingToken: string): Promise<AuthResult> {
  let payload;
  try {
    payload = verifyRefreshToken(incomingToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.refreshToken) {
    throw new AppError('Session not found — please log in again', 401);
  }

  const matches = await compareValue(incomingToken, user.refreshToken);
  if (!matches) {
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: null } });
    throw new AppError('Session invalid — please log in again', 401);
  }

  const { accessToken, refreshToken: newRefreshToken } = await issueTokenPair(user.id, user.role);
  return { user: toSafeUser(user), accessToken, refreshToken: newRefreshToken };
}

export async function logout(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
}

export async function getMe(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return toSafeUser(user);
}