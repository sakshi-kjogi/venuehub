import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/shared/utils/jwt';
import { AppError } from '@/shared/middleware/errorHandler';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Not authenticated', 401));
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    next(new AppError('Invalid or expired access token', 401));
  }
}