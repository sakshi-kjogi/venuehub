import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.memoryStorage(), // buffer only — never written to local disk, streamed straight to Cloudinary
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError('Only JPEG, PNG, or WebP images are allowed', 400));
    }
    cb(null, true);
  },
});

/**
 * Wraps multer's single-file middleware so its errors (file too large,
 * wrong field name, etc.) are converted into our own AppError shape
 * instead of raw Multer errors, keeping every error response in the app
 * consistent regardless of which layer raised it.
 */
export function venueImageUpload(req: Request, res: Response, next: NextFunction) {
  upload.single('image')(req, res, (err: unknown) => {
    if (!err) return next();
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('Image must be 5MB or smaller', 400));
    }
    if (err instanceof AppError) {
      return next(err);
    }
    return next(new AppError('Image upload failed', 400));
  });
}