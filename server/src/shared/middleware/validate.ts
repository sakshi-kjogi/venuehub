import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '@/shared/middleware/errorHandler';

type ValidationSource = 'body' | 'query';

export function validate(schema: ZodSchema, source: ValidationSource = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const input = source === 'query' ? req.query : req.body;
    const result = schema.safeParse(input);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');
      return next(new AppError(`Validation failed: ${message}`, 400));
    }

    if (source === 'query') {
      req.query = result.data as typeof req.query;
    } else {
      req.body = result.data;
    }
    next();
  };
}