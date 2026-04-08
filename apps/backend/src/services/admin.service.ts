import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../middleware/errorHandler.js';

export class AdminService {
  static async getAllUsers() {
    return prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true, updatedAt: true }
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true, updatedAt: true }
    });
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  static async deleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id, 10) } });
    if (!user) throw new NotFoundError('User not found');

    await prisma.user.delete({ where: { id: parseInt(id, 10) } });
    return { message: 'User deleted successfully' };
  }
}
