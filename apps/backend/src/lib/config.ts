import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'test') {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

export const config = {
  jwtSecret: process.env.JWT_SECRET || 'test-secret',
  jwtExpiresIn: '1d',
  resetTokenExpiresIn: 3600000, // 1 hour
};
