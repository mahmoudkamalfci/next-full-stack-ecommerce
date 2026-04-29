# Product Details Page Fetching & Integration Design

## Overview
This document outlines the design for fetching product data from the backend API and integrating it into the Product Details page (`app/collections/[slug]/[productSlug]/page.tsx`). The page currently uses static, hardcoded data and will be updated to fetch and display dynamic product information.

## Approach: Full Object Prop Passing
We will fetch the product data Server-Side using a custom helper (`fetchApi`) and pass the full `product` object down to the UI components (e.g., `ProductInfo`, `ProductImageCarousel`, and `ProductDetails`).

### 1. Data Fetching & Types
*   **Types:** We will reuse or create a shared `Product` type (matching the Prisma response) available in `@/types/product`.
*   **Page Component (`page.tsx`):**
    *   We will use the custom `fetchApi` function imported from `@/helpers/api` to call `/products/${params.productSlug}`.
    *   If the product is not found, we will trigger Next.js's `notFound()`.
    *   We will pass the retrieved `product` data to the child components.

### 2. Component Updates

#### `ProductImageCarousel`
*   **Props Update:** Will accept an array of image URLs or image objects.
*   **Behavior:** We will map the `product.images` array and extract the `imageUrl` properties to populate the carousel, replacing the hardcoded placeholder images.

#### `ProductDetails`
*   **Props Update:** Will accept a `description: string` prop (or full product).
*   **Behavior:** We will render the dynamic `product.description` instead of static HTML.

#### `ProductInfo`
*   **Props Update:** Will accept `product: Product` (the full product object).
*   **Dynamic Options:** We will map over `product.options` (like "Size" and "Color") to dynamically generate the available size buttons and color swatches.
*   **Selection State:** 
    *   We will manage `selectedSize` and `selectedColor` states dynamically based on the first available options, falling back to empty if none exist.
    *   We will extract color mapping logic (e.g. converting "Burgundy" to hex or CSS classes) if necessary, or just render color names.
*   **Dynamic Price & SKU:** Based on the selected options (e.g. Size + Color), we will find the matching `variant` in `product.variants` to display the exact `price` and `sku`.
*   **Add to Cart:** We will update `handleAddToCart` to construct the cart payload dynamically using the selected `variantId` and current `product` details, completely replacing the hardcoded "Core Joggers" logic.

## Error & Edge Case Handling
*   **Invalid Slug:** Server-side fetch returning 404 will trigger the Next.js `notFound()` boundary.
*   **Missing Variants:** If a specific option combination doesn't exist, we should disable the Add to Cart button or show "Out of Stock".
