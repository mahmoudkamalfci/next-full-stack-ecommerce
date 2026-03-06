# Database Seeding Design

## Objective
Provide a robust seating script that uses `@faker-js/faker` to populate the PostgreSQL database with realistic mock data for testing, development, and frontend building.

## Approach
We will use a **Simple Single Script (Sequential Seeding)** approach.
The script will live in `apps/backend/prisma/seed.ts` and will wipe existing data before generating interconnected rows sequentially to satisfy required relational constraints.

## Architecture & Configuration
- **Dependency**: Install `@faker-js/faker` as a development dependency in the `apps/backend` package.
- **Execution Engine**: We will execute the Typescript seed script using `tsx` (TypeScript Execute), which is already installed and used for dev mode.
- **Prisma Configuration**: Update `apps/backend/prisma.config.ts` to instruct Prisma on how to run the seeder:
  ```typescript
  export default defineConfig({
    // ...
    seed: {
      command: "npx tsx prisma/seed.ts",
    },
  });
  ```

## Data Generation Flow
The exact generation sequence ensures relations are established properly:

1. **Clean Slate**: Use a bulk-delete strategy (e.g. `prisma.user.deleteMany()`, `prisma.product.deleteMany()`, etc.) to clear tables to allow re-running multiple times without duplicate key errors.
2. **Users & Addresses**: Generate ~10 users with nested Addresses using `faker.person`, `faker.internet`, and `faker.location`.
3. **Categories**: Generate top-level categories and sub-categories (using `parentId`).
4. **Products & Options**:
   - Generate ~20 products (`faker.commerce.productName`).
   - For each product, define options such as "Size" (values: S, M, L) and "Color" (values: Red, Blue, Green).
   - Create `ProductVariants` for each combination (e.g., SKU "PROD1-S-RED").
   - Link these variants back to their precise `VariantOptionValue` associations.
   - Attach random categories via `ProductCategory`.
5. **Carts & Orders**: Simulate frontend sessions by attaching Carts to several Users and finalizing some Orders with generated timestamps.

## Trade-offs
- **Single File**: Since all logic remains in `seed.ts`, the file may exceed ~300 lines of code. However, it simplifies execution logic drastically and ensures data generation steps run strictly in sequence, a necessity given Prisma's strict foreign-key verification.
