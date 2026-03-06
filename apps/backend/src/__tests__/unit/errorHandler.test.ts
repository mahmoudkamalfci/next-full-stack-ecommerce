import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { AppError, notFoundHandler, globalErrorHandler } from '../../middleware/errorHandler.js';

// --- Helper to create mock Express objects ---
function createMockRes(): Response {
  const res = {
    status: function (code: number) {
      res.statusCode = code;
      return res;
    },
    json: function (body: unknown) {
      res.body = body;
      return res;
    },
    statusCode: 200,
    body: undefined as unknown,
  } as unknown as Response & { statusCode: number; body: unknown };
  return res;
}

function createMockReq(overrides?: Partial<Request>): Request {
  return {
    method: 'GET',
    originalUrl: '/some/path',
    ...overrides,
  } as unknown as Request;
}

// ─── AppError Class ─────────────────────────────────────────────────

describe('AppError', () => {
  it('should set the correct message and statusCode', () => {
    const error = new AppError('Not Found', 404);
    expect(error.message).toBe('Not Found');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });

  it('should default isOperational to true', () => {
    const error = new AppError('Something went wrong', 500);
    expect(error.isOperational).toBe(true);
  });

  it('should allow overriding isOperational to false', () => {
    const error = new AppError('Fatal crash', 500, false);
    expect(error.isOperational).toBe(false);
  });

  it('should be an instance of Error', () => {
    const error = new AppError('Test', 400);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });
});

// ─── notFoundHandler ────────────────────────────────────────────────

describe('notFoundHandler', () => {
  it('should call next with a 404 AppError containing the request method and URL', () => {
    const req = createMockReq({ method: 'GET', originalUrl: '/api/unknown' });
    const res = createMockRes();
    const next = ((err: unknown) => {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(404);
      expect((err as AppError).message).toBe('Cannot GET /api/unknown');
    }) as NextFunction;

    notFoundHandler(req, res, next);
  });

  it('should include the correct HTTP method in the error message', () => {
    const req = createMockReq({ method: 'POST', originalUrl: '/api/items' });
    const res = createMockRes();
    const next = ((err: unknown) => {
      expect((err as AppError).message).toBe('Cannot POST /api/items');
    }) as NextFunction;

    notFoundHandler(req, res, next);
  });
});

// ─── globalErrorHandler ─────────────────────────────────────────────

describe('globalErrorHandler', () => {
  // Suppress console.error during these tests
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = () => {};
  });
  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('should return the correct status and message for operational AppErrors', () => {
    const err = new AppError('Resource not found', 404);
    const req = createMockReq();
    const res = createMockRes();
    const next = (() => {}) as NextFunction;

    globalErrorHandler(err, req, res, next);

    expect((res as any).statusCode).toBe(404);
    expect((res as any).body).toEqual({
      status: 'error',
      message: 'Resource not found',
    });
  });

  it('should return 500 with generic message for non-operational errors', () => {
    const err = new Error('Something unexpected');
    const req = createMockReq();
    const res = createMockRes();
    const next = (() => {}) as NextFunction;

    globalErrorHandler(err, req, res, next);

    expect((res as any).statusCode).toBe(500);
    expect((res as any).body).toEqual({
      status: 'error',
      message: 'Internal server error',
    });
  });

  it('should handle malformed JSON body errors (entity.parse.failed)', () => {
    const err = new SyntaxError('Unexpected token');
    (err as any).type = 'entity.parse.failed';
    const req = createMockReq();
    const res = createMockRes();
    const next = (() => {}) as NextFunction;

    globalErrorHandler(err, req, res, next);

    expect((res as any).statusCode).toBe(400);
    expect((res as any).body).toEqual({
      status: 'error',
      message: 'Malformed JSON in request body',
    });
  });

  it('should include stack trace in development mode for operational errors', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const err = new AppError('Debug info', 422);
    const req = createMockReq();
    const res = createMockRes();
    const next = (() => {}) as NextFunction;

    globalErrorHandler(err, req, res, next);

    expect((res as any).statusCode).toBe(422);
    expect((res as any).body.stack).toBeDefined();
    expect((res as any).body.message).toBe('Debug info');

    process.env.NODE_ENV = originalNodeEnv;
  });
});
