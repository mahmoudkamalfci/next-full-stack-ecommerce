import redisClient from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';

export const addCartItem = async (userId: string, productId: string, quantity: number) => {
  const key = `cart:${userId}`;
  await redisClient.hIncrBy(key, productId, quantity);
  return getCart(userId);
};

export const getCart = async (userId: string) => {
  const key = `cart:${userId}`;
  const rawCart = await redisClient.hGetAll(key);
  
  const variantIds = Object.keys(rawCart).map(Number).filter(id => !isNaN(id));
  if (variantIds.length === 0) return [];

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: {
        include: {
          images: true
        }
      },
      optionValues: {
        include: {
          optionValue: {
            include: {
              option: true
            }
          }
        }
      },
      images: true
    }
  });

  const items = variants.map(variant => {
    const quantity = parseInt(rawCart[variant.id.toString()] || '1');
    const image = variant.images[0]?.imageUrl || variant.product.images[0]?.imageUrl || '';
    
    let size = '';
    let color = '';
    
    variant.optionValues.forEach(ov => {
      const name = ov.optionValue.option.name.toLowerCase();
      if (name.includes('size')) size = ov.optionValue.value;
      if (name.includes('color')) color = ov.optionValue.value;
    });

    return {
      id: variant.id.toString(),
      sku: variant.sku,
      name: variant.product.name,
      price: Number(variant.price),
      image,
      quantity,
      size,
      color
    };
  });

  return items;
};

export const mergeCart = async (userId: string, guestItems: { productId: string, quantity: number }[]) => {
  const key = `cart:${userId}`;
  for (const item of guestItems) {
    await redisClient.hIncrBy(key, item.productId, item.quantity);
  }
  return getCart(userId);
};

export const updateCartItem = async (userId: string, productId: string, quantity: number) => {
  const key = `cart:${userId}`;
  if (quantity <= 0) {
    await redisClient.hDel(key, productId);
  } else {
    await redisClient.hSet(key, productId, quantity);
  }
  return getCart(userId);
};

export const removeCartItem = async (userId: string, productId: string) => {
  const key = `cart:${userId}`;
  await redisClient.hDel(key, productId);
  return getCart(userId);
};

export const clearCart = async (userId: string) => {
  const key = `cart:${userId}`;
  await redisClient.del(key);
  return [];
};

