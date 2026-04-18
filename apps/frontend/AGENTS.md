# Frontend – Agent Rules

Guidelines for AI agents working inside `apps/frontend`.  
Follow every rule below **without exception** unless the user explicitly overrides it.

---

## 1. Package Management

**Always use `pnpm` to install dependencies.**

```bash
# ✅ Correct
pnpm add <package>
pnpm add -D <package>

# ❌ Never use
npm install <package>
yarn add <package>
```

> **Why:** This monorepo uses `pnpm` workspaces. Using `npm` or `yarn` will bypass the shared lockfile and may corrupt the dependency graph.

---

## 2. Async Components & Suspense

**Every async Server Component must be wrapped in a `<Suspense>` boundary with a meaningful fallback.**

### Rule

- Any component that is declared `async` (i.e., an async Server Component) **must** be wrapped by `<Suspense>` at its call site.
- The `fallback` prop **must** receive a dedicated skeleton component — never `null`, a spinner string, or an empty fragment.

### Skeleton conventions

- Create a matching `*-skeleton.tsx` file alongside the component (e.g., `products-cats.tsx` → `products-cats-skeleton.tsx`).
- The skeleton must mirror the real component's layout and grid so the page does not shift on hydration.
- Use the shadcn `<Skeleton>` primitive (`components/ui/skeleton.tsx`) for all placeholder shapes.

### Example

```tsx
// ✅ Correct — async component wrapped in Suspense with a skeleton fallback
import { Suspense } from "react";
import ProductCats from "@/components/products-cats";
import ProductCatsSkeleton from "@/components/products-cats-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<ProductCatsSkeleton />}>
      <ProductCats />
    </Suspense>
  );
}
```

```tsx
// ❌ Wrong — async component rendered without a Suspense boundary
import ProductCats from "@/components/products-cats";

export default function Page() {
  return <ProductCats />;
}
```

---

## Quick Reference

| Rule | Requirement |
|------|-------------|
| Install packages | `pnpm add <pkg>` — never `npm` or `yarn` |
| Async Server Component | Must be wrapped in `<Suspense fallback={<...Skeleton />}>` |
| Skeleton file | Co-located `*-skeleton.tsx` using shadcn `<Skeleton>` |
| Skeleton layout | Must match the real component's structure to prevent layout shift |
