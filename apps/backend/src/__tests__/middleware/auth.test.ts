import { authenticateToken } from '../../middleware/auth.js';
import type { Request, Response, NextFunction } from 'express';
import { jest, describe, it, expect } from '@jest/globals';

describe('Auth Middleware', () => {
  it('should return 401 if no auth header', () => {
    const req = { header: jest.fn().mockReturnValue(null) } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;
    
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
