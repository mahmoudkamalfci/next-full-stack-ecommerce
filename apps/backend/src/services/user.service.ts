import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../lib/config.js';
import { ConflictError, BadRequestError, NotFoundError } from '../middleware/errorHandler.js';

export class UserService {
  static async register(email: string, password: string, firstName: string, lastName: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      const user = await prisma.user.create({
        data: { email, passwordHash, firstName, lastName }
      });
      
      const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
      return { user, token };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError('Email already registered');
      }
      throw error;
    }
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestError('Invalid email or password');

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) throw new BadRequestError('Invalid email or password');

    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
    return { user, token };
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'If that email is registered, a reset link will be sent.' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry: new Date(Date.now() + config.resetTokenExpiresIn)
      }
    });

    console.log(`Password reset token for ${email}: ${resetToken}`); // For dev purposes
    return { message: 'If that email is registered, a reset link will be sent.' };
  }

  static async resetPassword(token: string, newPassword: string) {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetToken: resetTokenHash,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) throw new BadRequestError('Invalid or expired password reset token');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return { message: 'Password has been reset successfully' };
  }

  static async getProfile(userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');

    const { passwordHash, resetToken, resetTokenExpiry, ...safeUser } = user;
    return safeUser;
  }

  static async updateProfile(userId: number, data: { firstName?: string; lastName?: string }) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data
    });
    
    const { passwordHash, resetToken, resetTokenExpiry, ...safeUser } = updatedUser;
    return safeUser;
  }
}
