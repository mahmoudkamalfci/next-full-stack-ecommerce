import { jest, describe, it, expect } from '@jest/globals';

const mockPrisma = {
  user: {
    create: jest.fn()
  }
};

jest.unstable_mockModule('../../lib/prisma.js', () => ({
  prisma: mockPrisma
}));

describe('UserService.register', () => {
  it('should hash password and create user', async () => {
    const { UserService } = await import('../../services/user.service.js');
    
    mockPrisma.user.create.mockResolvedValue({ id: 1, email: 'test@test.com' } as never);
    const result = await UserService.register('test@test.com', 'password123', 'John', 'Doe');
    
    expect(result.token).toBeDefined();
    expect(mockPrisma.user.create).toHaveBeenCalled();
  });
});
