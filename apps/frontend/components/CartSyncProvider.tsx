"use client"

import { useEffect, ReactNode } from "react";
import { useCartStore } from "../stores/useCartStore";
import { syncCartAction } from "../actions/cart";

export function CartSyncProvider({ children, isAuthenticated }: { children: ReactNode, isAuthenticated: boolean }) {
  const setCartFromApi = useCartStore(state => state.setCartFromApi);
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    if (isAuthenticated) {
      syncCartAction().then(data => {
        if (data && Array.isArray(data)) {
          setCartFromApi(data);
        }
      });
    } else {
      // Check if the session_expired cookie is present
      const isExpired = document.cookie.split("; ").find(row => row.trim().startsWith("session_expired="));
      if (isExpired) {
        // Clear the session_expired cookie
        document.cookie = "session_expired=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        
        // Clear local Zustand cart
        clearCart();
        
        // Redirect to login page
        window.location.href = "/login";
      }
    }
  }, [isAuthenticated, setCartFromApi, clearCart]);

  return <>{children}</>;
}
