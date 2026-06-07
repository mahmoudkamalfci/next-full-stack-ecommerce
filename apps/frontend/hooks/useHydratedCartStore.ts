import { useState, useEffect } from 'react';
import { useCartStore } from '../stores/useCartStore';

export const useHydratedCartStore = () => {
  const [isHydrated, setHydrated] = useState(false);
  const cart = useCartStore();

  useEffect(() => {
    setHydrated(true);
  }, []);

  return { isHydrated, cart };
};
