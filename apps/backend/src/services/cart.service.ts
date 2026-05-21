import redisClient from '../lib/redis.js';

export const addCartItem = async (userId: string, productId: string, quantity: number) => {
  const key = `cart:${userId}`;
  await redisClient.hIncrBy(key, productId, quantity);
  return getCart(userId);
};

export const getCart = async (userId: string) => {
  const key = `cart:${userId}`;
  const rawCart = await redisClient.hGetAll(key);
  // Optional: join with Postgres for pricing
  return rawCart;
};

export const mergeCart = async (userId: string, guestItems: { productId: string, quantity: number }[]) => {
  const key = `cart:${userId}`;
  for (const item of guestItems) {
    await redisClient.hIncrBy(key, item.productId, item.quantity);
  }
  return getCart(userId);
};
