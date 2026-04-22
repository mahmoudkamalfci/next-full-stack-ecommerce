import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { mockPrisma } from '../mocks/prisma.mock.js';

jest.unstable_mockModule('../../lib/prisma.js', () => ({
  prisma: mockPrisma,
}));

const { getCategoryFilters } = await import('../../services/category.service.js');

describe('getCategoryFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error when category slug is not found', async () => {
    (mockPrisma.category.findUnique as any).mockResolvedValue(null);
    await expect(getCategoryFilters('nonexistent')).rejects.toThrow('Category not found');
  });

  it('returns sizes, colors and productTypes for a valid category', async () => {
    (mockPrisma.category.findUnique as any).mockResolvedValue({
      id: 1, slug: 'men', children: [{ id: 2 }, { id: 3 }],
    });
    (mockPrisma.productOptionValue.findMany as any)
      .mockResolvedValueOnce([{ value: 'S' }, { value: 'M' }])
      .mockResolvedValueOnce([{ value: 'Red' }, { value: 'Black' }]);
    (mockPrisma.productType.findMany as any).mockResolvedValue([
      { name: 'T-Shirt' }, { name: 'Hoodie' }
    ]);

    const result = await getCategoryFilters('men');

    expect(result).toEqual({
      sizes: ['S', 'M'],
      colors: ['Red', 'Black'],
      productTypes: ['T-Shirt', 'Hoodie'],
    });
  });

  it('returns empty arrays when category has no products', async () => {
    (mockPrisma.category.findUnique as any).mockResolvedValue({
      id: 5, slug: 'empty-cat', children: [],
    });
    (mockPrisma.productOptionValue.findMany as any).mockResolvedValue([]);
    (mockPrisma.productType.findMany as any).mockResolvedValue([]);

    const result = await getCategoryFilters('empty-cat');
    expect(result).toEqual({ sizes: [], colors: [], productTypes: [] });
  });
});
