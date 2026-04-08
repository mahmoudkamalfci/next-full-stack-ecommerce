import { authenticateToken, authorizeRole } from '../../middleware/auth.js';
import { UnauthorizedError, ForbiddenError } from '../../middleware/errorHandler.js';
import type { Request, Response, NextFunction } from 'express';
import { jest, describe, it, expect } from '@jest/globals';

describe('Auth Middleware', () => {
  it('should throw UnauthorizedError if no auth header', () => {
    const req = { header: jest.fn().mockReturnValue(null) } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;
    
    expect(() => authenticateToken(req, res, next)).toThrow(UnauthorizedError);
  });
});
