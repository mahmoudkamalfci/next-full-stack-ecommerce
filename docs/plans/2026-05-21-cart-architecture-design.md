# Cart Architecture Design

## Overview
A highly scalable cart architecture designed to handle guest and authenticated users efficiently by minimizing disk I/O and providing a snappy frontend experience using optimistic UI updates.

## System Responsibilities

| Layer | Technology | Primary Responsibility |
| --- | --- | --- |
| **Local State** | Zustand + `localStorage` | Guest cart persistence and optimistic UI updates |
| **Hydration** | Custom React Hook | Preventing Next.js server/client render mismatches |
| **Transient Data** | Redis (Hashes) | High-speed active cart storage to protect disk I/O |
| **Source of Truth** | PostgreSQL | Pricing, inventory validation, and finalized orders |

---

## Execution Plan

1. **Configure Zustand and Hydration:** Frontend.
Update the existing Zustand store to accept remote data, then create the hydration bridge to safely render the Next.js UI.
* Add a `setCartFromApi(items: CartProduct[]) => void` action to the `useCartStore`.
* Create the `useHydratedCartStore` hook to delay rendering `localStorage` data until the component has mounted on the client.
* Update cart badge and drawer components to consume the `useHydratedCartStore` hook and display a skeleton loader while hydrating.

2. **Build the Redis Storage Layer:** Backend.
Set up the Express routes to handle authenticated cart mutations without hitting PostgreSQL for every click.
* Configure a Redis client in the Node.js environment.
* Create a `POST /api/cart/items` endpoint that accepts a `productId` and `quantity`.
* Implement Redis Hash commands (`HSET`, `HINCRBY`) using a key pattern like `cart:userId:{id}` to store the cart items.
* Create a `GET /api/cart` endpoint that fetches the Redis hash, queries PostgreSQL for the current product prices and metadata, and returns the fully hydrated cart.

3. **Implement the Cart Merge Endpoint:** Backend.
Build the conflict resolution logic required when a guest transitions to an authenticated user.
* Create a `POST /api/cart/merge` endpoint in Express.
* Extract the `guestItems` array from the request body (trusting only `productId` and `quantity`).
* Fetch the user's existing remote cart from Redis.
* Iterate through the guest items and add their quantities to any matching items in the remote cart.
* Save the newly merged state back to Redis and return the hydrated cart array.

4. **Wire Up Auth Sync and Optimistic UI:** Frontend.
Connect the frontend state to the newly created backend endpoints.
* Create a `CartSyncProvider` component that wraps the layout and listens for authentication status changes.
* If the user is logged in on mount, fetch `GET /api/cart` and call `setCartFromApi`.
* Update the login handler: immediately after successful authentication, grab the guest cart from Zustand, send it to `POST /api/cart/merge`, and overwrite the store with the response.
* Implement an asynchronous wrapper on the "Add to Cart" button that updates Zustand instantly, debounces for 500ms, and then pushes the payload to the backend API.
