# Product Details Fetching Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fetch dynamic product data from the backend and pass it down to product details components.

**Architecture:** Server-side fetching in the Next.js App Router using a custom `fetchApi` function, passing the complete `product` object to child UI components for dynamic rendering.

**Tech Stack:** Next.js (App Router), React, TypeScript.

---

### Task 1: Update Server Component to Fetch Data

**Files:**
- Modify: `apps/frontend/app/collections/[slug]/[productSlug]/page.tsx`

**Step 1: Write the implementation**

Update `page.tsx` to use `fetchApi` to get the product, handle 404s using `notFound()`, and pass the data down.

```tsx
import { notFound } from "next/navigation";
import { fetchApi } from "@/helpers/api";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import { ProductInfo } from "@/components/product-info";
import { ProductDetails } from "@/components/product-desc";
import type { Product } from "@/types/product"; // Assumes type exists, will fix if needed

interface ProductPageProps {
    params: Promise<{
        slug: string;
        productSlug: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { productSlug } = await params;
    
    const res = await fetchApi(`/products/${productSlug}`);
    
    if (!res.ok) {
        if (res.status === 404) notFound();
        throw new Error("Failed to fetch product");
    }

    const { data: product }: { data: Product } = await res.json();

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                <div className="w-full">
                    <ProductImageCarousel images={product.images} />
                </div>
                <ProductInfo product={product} />
            </div>
            <div>
                <ProductDetails description={product.description || ""} />
            </div>
        </div>
    );
}
```

**Step 2: Commit**

```bash
git add apps/frontend/app/collections/[slug]/[productSlug]/page.tsx
git commit -m "feat: fetch product data server-side and pass to components"
```

---

### Task 2: Update ProductImageCarousel

**Files:**
- Modify: `apps/frontend/components/product-image-carousel.tsx`

**Step 1: Write the implementation**

Update the component to accept `images: { imageUrl: string }[]` (or equivalent type) and map over it, replacing the hardcoded array. *(Note: Check the exact `images` type structure during implementation, likely `ProductImage[]`)*.

**Step 2: Commit**

```bash
git add apps/frontend/components/product-image-carousel.tsx
git commit -m "feat: render dynamic images in product carousel"
```

---

### Task 3: Update ProductDetails

**Files:**
- Modify: `apps/frontend/components/product-desc.tsx`

**Step 1: Write the implementation**

Update `ProductDetails` to accept `description: string` as a prop and render it.

**Step 2: Commit**

```bash
git add apps/frontend/components/product-desc.tsx
git commit -m "feat: render dynamic product description"
```

---

### Task 4: Update ProductInfo

**Files:**
- Modify: `apps/frontend/components/product-info.tsx`

**Step 1: Write the implementation**

Update `ProductInfo` to accept `product: Product`.
- Map `product.options` where `name === 'Size'` for the size buttons.
- Map `product.options` where `name === 'Color'` for color swatches.
- Calculate dynamic price based on the selected variant using `product.variants`.
- Update `handleAddToCart` to use the dynamic `product.name`, variant price, and dynamic `id`/`sku`.

**Step 2: Commit**

```bash
git add apps/frontend/components/product-info.tsx
git commit -m "feat: dynamic variants, options, and pricing in product info"
```
