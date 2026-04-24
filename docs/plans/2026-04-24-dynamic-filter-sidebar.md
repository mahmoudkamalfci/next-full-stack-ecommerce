# Dynamic Filter Sidebar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fetch filter options dynamically from `/categories/${slug}/filters` and wire up URL-based multi-select filtering so product results update server-side when the user picks sizes, colors, or product types.

**Architecture:** `CollectionPage` (Server Component) fetches filters and products in parallel via `Promise.all`, passes filter data as props to `ProductsSidebar`. `ProductsSidebar` (Client Component) reads active filters from `useSearchParams()` and calls `router.push()` with updated array params on toggle.

**Tech Stack:** Next.js 14 App Router, TypeScript, `useSearchParams` / `useRouter`, existing `fetchApi` helper, Shadcn Accordion + checkbox inputs.

---

## Task 1: Add `CategoryFilters` type

**Files:**
- Modify: `apps/frontend/types/index.ts`

**Step 1: Add the type**

Append to `apps/frontend/types/index.ts`:

```ts
export interface CategoryFilters {
  sizes: string[];
  colors: string[];
  productTypes: string[];
}

export interface CategoryFiltersResponse {
  data: CategoryFilters;
}
```

**Step 2: Verify TypeScript sees it**

```bash
cd apps/frontend && npx tsc --noEmit
```
Expected: no new errors.

**Step 3: Commit**

```bash
git add apps/frontend/types/index.ts
git commit -m "feat(types): add CategoryFilters type"
```

---

## Task 2: Update CollectionPage — parallel fetch + forward array filter params

**Files:**
- Modify: `apps/frontend/app/collections/[slug]/page.tsx`

**Step 1: Add imports**

```ts
import type { CategoryFiltersResponse } from "@/types";
```

**Step 2: Extend searchParams interface**

```ts
searchParams: Promise<{
  page?: string;
  sizes?: string | string[];
  colors?: string | string[];
  types?: string | string[];
  minPrice?: string;
  maxPrice?: string;
}>;
```

**Step 3: Add toArray helper above the component**

```ts
function toArray(val: string | string[] | undefined): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}
```

**Step 4: Replace the single fetchApi call with Promise.all**

```ts
const { slug } = await params;
const resolvedSearchParams = await searchParams;
const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;

const sizes  = toArray(resolvedSearchParams.sizes);
const colors = toArray(resolvedSearchParams.colors);
const types  = toArray(resolvedSearchParams.types);

// Build products query
const productsParams = new URLSearchParams();
productsParams.set('limit', '10');
productsParams.set('page', String(page));
productsParams.set('categorySlug', slug);
sizes.forEach(s  => productsParams.append('sizes[]', s));
colors.forEach(c => productsParams.append('colors[]', c));
types.forEach(t  => productsParams.append('types[]', t));
if (resolvedSearchParams.minPrice) productsParams.set('minPrice', resolvedSearchParams.minPrice);
if (resolvedSearchParams.maxPrice) productsParams.set('maxPrice', resolvedSearchParams.maxPrice);

const [productsRes, filtersRes] = await Promise.all([
  fetchApi(`/products?${productsParams.toString()}`),
  fetchApi(`/categories/${slug}/filters`),
]);

const data: ProductsResponse = await productsRes.json();
const { data: filters }: CategoryFiltersResponse = await filtersRes.json();
const products = data.data;
```

**Step 5: Pass filters to the sidebar**

```tsx
<ProductsSidebar filters={filters} />
```

**Step 6: Verify TypeScript**

```bash
cd apps/frontend && npx tsc --noEmit
```

**Step 7: Commit**

```bash
git add apps/frontend/app/collections/[slug]/page.tsx
git commit -m "feat(collection): parallel fetch filters + forward array filter params to products API"
```

---

## Task 3: Rewrite ProductsSidebar — dynamic data + URL toggling

**Files:**
- Modify: `apps/frontend/components/products-sidebar.tsx`

**Step 1: New imports and props interface**

```ts
"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import type { CategoryFilters } from "@/types";

interface ProductsSidebarProps {
  filters: CategoryFilters;
}
```

**Step 2: Read active filters from URL**

```ts
export const ProductsSidebar = ({ filters }: ProductsSidebarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeSizes  = searchParams.getAll("sizes");
  const activeColors = searchParams.getAll("colors");
  const activeTypes  = searchParams.getAll("types");

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
```

**Step 3: Toggle helper (adds/removes a value from an array param)**

```ts
  function toggleParam(key: string, value: string, current: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    next.forEach(v => params.append(key, v));
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }
```

**Step 4: Price apply handler**

```ts
  function applyPrice() {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice); else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice); else params.delete("maxPrice");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }
```

**Step 5: Full JSX — replace the entire return block**

```tsx
  return (
    <div className="p-4 rounded-lg">
      <p className="mb-4 flex items-center">
        <SlidersHorizontal className="inline-block w-4 h-4 me-2" />
        Filters
      </p>
      <Accordion type="multiple" className="w-full">

        {/* Price */}
        <AccordionItem value="price">
          <AccordionTrigger className="font-bold">Price</AccordionTrigger>
          <AccordionContent>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="flex items-center border border-border rounded-md px-3 py-2">
                  <span className="inline-block text-sm text-muted-foreground me-1 text-nowrap">E.£</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    onBlur={applyPrice}
                    className="w-full bg-transparent outline-none text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
              <span className="text-muted-foreground">to</span>
              <div className="flex-1">
                <div className="flex items-center border border-border rounded-md px-3 py-2">
                  <span className="text-sm text-muted-foreground me-1 text-nowrap">E.£</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    onBlur={applyPrice}
                    className="w-full bg-transparent outline-none text-sm"
                    placeholder="9999"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Product Types */}
        <AccordionItem value="types">
          <AccordionTrigger>Product Types</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {filters.productTypes.map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`type-${type}`}
                  className="me-2"
                  checked={activeTypes.includes(type)}
                  onChange={() => toggleParam("types", type, activeTypes)}
                />
                <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Sizes */}
        <AccordionItem value="sizes">
          <AccordionTrigger>Sizes</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {filters.sizes.map((size) => (
              <div key={size} className="flex items-center">
                <input
                  type="checkbox"
                  id={`size-${size}`}
                  className="me-2"
                  checked={activeSizes.includes(size)}
                  onChange={() => toggleParam("sizes", size, activeSizes)}
                />
                <label htmlFor={`size-${size}`} className="text-sm">{size}</label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Colors */}
        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {filters.colors.map((color) => (
              <div key={color} className="flex items-center">
                <input
                  type="checkbox"
                  id={`color-${color}`}
                  className="me-2"
                  checked={activeColors.includes(color)}
                  onChange={() => toggleParam("colors", color, activeColors)}
                />
                <label htmlFor={`color-${color}`} className="text-sm">{color}</label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
};
```

Note: `type="multiple"` on Accordion allows multiple sections open at once — better UX for filters.

**Step 6: Verify TypeScript**

```bash
cd apps/frontend && npx tsc --noEmit
```

**Step 7: Commit**

```bash
git add apps/frontend/components/products-sidebar.tsx
git commit -m "feat(sidebar): dynamic filters from API + URL-based multi-select filtering"
```

---

## Task 4: Smoke test in the browser

**Step 1: Start dev servers (backend + frontend)**

```bash
# from repo root
npm run dev
```

**Step 2: Open a collection page**

`http://localhost:3000/collections/men` (use a slug that exists in your DB)

**Verify checklist:**
- [ ] Sidebar shows sizes/colors/types from the API (not hardcoded values)
- [ ] No console errors
- [ ] Checking a size updates URL to `?sizes=M&page=1` and product grid updates
- [ ] Checking two sizes gives `?sizes=M&sizes=L&page=1`
- [ ] Unchecking a size removes it from the URL
- [ ] Combining size + color works: `?sizes=M&colors=Red&page=1`
- [ ] After navigation, checked boxes remain checked (hydrated from URL)
- [ ] Price blur updates URL with `minPrice`/`maxPrice`
- [ ] Page resets to 1 on every filter change

**Step 3: Final commit if any tweaks were needed**

```bash
git add -A
git commit -m "fix(sidebar): smoke test tweaks"
```
