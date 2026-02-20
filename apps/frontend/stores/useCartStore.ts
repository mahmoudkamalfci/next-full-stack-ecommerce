import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product } from '../types'

interface CartState {
  items: Product[]
  totalPrice: number
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,

      // Action: Add Item
      addItem: (product: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item: Product) => item.id === product.id);

        if (existingItem) {
          // If item exists, increase quantity
          const updatedItems = currentItems.map((item: Product) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          );
          set({ items: updatedItems });
        } else {
          // If new, add to array
          set({ items: [...currentItems, { ...product, quantity: product.quantity || 1 }] });
        }
      },

      // Action: Remove Item
      removeItem: (id: string) => {
        set({ items: get().items.filter((item: Product) => item.id !== id) });
      },

      // Action: Update Quantity
      updateQuantity: (id: string, quantity: number) => {
        set({
          items: get().items.map((item: Product) =>
            item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
          ),
        });
      },
      
      // Action: Clear Cart
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      skipHydration: true, // IMPORTANT for Next.js (see below)
    }
  )
)