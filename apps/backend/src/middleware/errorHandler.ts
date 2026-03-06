import { Request, Response, NextFunction } from 'express';

/**
 * Custom application error with HTTP status code support.
 * Throw this from any route handler to return a structured error response.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Catch-all handler for requests that don't match any route.
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
}

/**
 * Global error handling middleware.
 * Must be registered AFTER all routes — Express identifies error middleware
 * by the (err, req, res, next) four-argument signature.
 */
export function globalErrorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Determine status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isOperational = err instanceof AppError ? err.isOperational : false;

  // Always log the error for observability
  console.error(`[ERROR] ${new Date().toISOString()} — ${err.message}`);
  if (!isOperational) {
    // Log the full stack for unexpected (programmer) errors
    console.error(err.stack);
  }

  // Handle malformed JSON body from express.json()
  if ((err as any).type === 'entity.parse.failed') {
    res.status(400).json({
      status: 'error',
      message: 'Malformed JSON in request body',
    });
    return;
  }

  res.status(statusCode).json({
    status: 'error',
    message: isOperational ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
