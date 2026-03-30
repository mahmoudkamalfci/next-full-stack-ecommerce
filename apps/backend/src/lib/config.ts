import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '1d',
  resetTokenExpiresIn: 3600000, // 1 hour
};
