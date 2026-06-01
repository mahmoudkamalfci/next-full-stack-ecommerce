# Logout on 401 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Automatically log out and redirect the user to `/login` when any API request returns a 401 status code (Invalid token), with zero modifications required in individual server actions.

**Architecture:** We will intercept 401 status codes on the server side in `fetchApi`. Upon detecting a 401, we will delete the HttpOnly `"token"` cookie and set a transient non-HttpOnly `"session_expired"` cookie. The root-level client component `CartSyncProvider` will monitor authentication state changes. If `isAuthenticated` is falsy and `"session_expired"` is set, it will clear the Zustand cart and redirect the user.

**Tech Stack:** Next.js App Router (Server Actions, Cookies API), Zustand (State Management), React (useEffect).

---

### Task 1: Update API Fetch Helper

**Files:**
- Modify: `apps/frontend/helpers/api.ts`

**Step 1: Write implementation to handle 401 responses**
Import `cookies` dynamically (or statically if appropriate) and check the status code in `fetchApi`. If `401`, delete `"token"` and set `"session_expired"` to `"true"`.

Add the following to `apps/frontend/helpers/api.ts`:
```typescript
import { cookies } from "next/headers";
```

And update the status checking logic in `fetchApi` before the `.ok` check:
```typescript
    if (res.status === 401) {
        try {
            const cookieStore = await cookies();
            cookieStore.delete("token");
            cookieStore.set("session_expired", "true", {
                path: "/",
                httpOnly: false, // Accessible to client-side JS
                maxAge: 10,      // Transient, expires in 10 seconds
            });
        } catch (e) {
            // Fail silently if cookies cannot be modified (e.g., during render)
        }
    }
```

**Step 2: Verify the change**
Run compilation/lint checks to ensure there are no TypeScript syntax errors:
Run: `npm run build` or equivalent type-checking inside the frontend app directory.

**Step 3: Commit**
```bash
git add apps/frontend/helpers/api.ts
git commit -m "feat: handle 401 unauthorized status in fetchApi helper"
```

---

### Task 2: Implement Client-Side Global Redirect in `CartSyncProvider`

**Files:**
- Modify: `apps/frontend/components/CartSyncProvider.tsx`

**Step 1: Add Session Expired check & Zustand Cart clearing**
Add a check in the `else` branch of the `useEffect` inside `CartSyncProvider` to check for `"session_expired"`, delete the cookie, clear the local cart store, and redirect.

Update `apps/frontend/components/CartSyncProvider.tsx`:
```typescript
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
```

**Step 2: Verify the change**
Verify that all tests pass and TypeScript check succeeds.

**Step 3: Commit**
```bash
git add apps/frontend/components/CartSyncProvider.tsx
git commit -m "feat: redirect user and clear cart in CartSyncProvider on session expiration"
```
