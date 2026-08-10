import { Request, Response, NextFunction } from "express";
import { logger } from "@/shared/utils/logger";
import { isProduction } from "@/config/env";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes expected errors (e.g. "not found")
                                 // from unexpected bugs, for logging purposes
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error-handling middleware. Must be registered LAST, after all
 * routes, and must keep all four parameters (err, req, res, next) — Express
 * identifies error-handling middleware specifically by that four-argument
 * signature.
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isOperational = err instanceof AppError ? err.isOperational : false;

  if (!isOperational) {
    // Unexpected errors (bugs) get logged with full detail — operational
    // errors (like "venue not found") are expected and don't need alarm-level logging.
    logger.error(`Unhandled error on ${req.method} ${req.path}`, err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    // Stack traces are only ever exposed in development — leaking them in
    // production is an information-disclosure risk.
    ...(isProduction ? {} : { stack: err.stack }),
  });
}