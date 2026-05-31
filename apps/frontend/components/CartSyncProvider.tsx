"use client"

import { useEffect, ReactNode } from "react";
import { useCartStore } from "../stores/useCartStore";
import { syncCartAction } from "../actions/cart";

export function CartSyncProvider({ children, isAuthenticated }: { children: ReactNode, isAuthenticated: boolean }) {
  const setCartFromApi = useCartStore(state => state.setCartFromApi);

  useEffect(() => {

    if (isAuthenticated) {
      syncCartAction().then(data => {

        if (data && Array.isArray(data)) {
          setCartFromApi(data);
        }
      });
    }
  }, [isAuthenticated, setCartFromApi]);

  return <>{children}</>;
}
