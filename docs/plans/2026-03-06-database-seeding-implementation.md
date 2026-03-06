# Database Seeding Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Provide a robust seating script that uses `@faker-js/faker` to populate the PostgreSQL database with realistic mock data for testing, development, and frontend building.

**Architecture:** A single file `seed.ts` will clear existing data and generate users, categories, options, and variants sequentially.

**Tech Stack:** Node.js, Prisma, Typescript, @faker-js/faker.

---

### Task 1: Setup Seeding Infrastructure

**Files:**
- Modify: `apps/backend/package.json`
- Modify: `apps/backend/prisma.config.ts`

**Step 1: Install faker as a dev dependency**

Run: `cd apps/backend && npm install --save-dev @faker-js/faker`
Expected: Completion of npm install.

**Step 2: Update Prisma Config**

Update `apps/backend/prisma.config.ts` to include the seed command:

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
  seed: {
    command: "npx tsx prisma/seed.ts",
  },
});
```

**Step 3: Run Typescript compiler check**
Run: `cd apps/backend && npx tsc --noEmit`
Expected: Passes without errors.

**Step 4: Commit**

```bash
git add apps/backend/package.json apps/backend/package-lock.json apps/backend/prisma.config.ts
git commit -m "chore: setup faker dependency and prisma seeding config"
```

---

### Task 2: Create Seed Foundations (Clean Slate)

**Files:**
- Create: `apps/backend/prisma/seed.ts`

**Step 1: Write initial seeder skeleton with clean slate logic**

```typescript
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  // The order is important here because of constraints
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.variantOptionValue.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productOptionValue.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleared.');
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Step 2: Dry Run Seed**
Run: `cd apps/backend && npx prisma db seed`
Expected: Execution output containing "Clearing database..." and "Seeding complete."

**Step 3: Commit**

```bash
git add apps/backend/prisma/seed.ts
git commit -m "feat(db): establish base seeder with database wipe capabilities"
```

---

### Task 3: Seed Users and Categories

**Files:**
- Modify: `apps/backend/prisma/seed.ts`

**Step 1: Add User & Category Seeding Logic**

Add inside `main()` after `console.log('Database cleared.');`:

```typescript
  console.log('Seeding Users...');
  const users = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          passwordHash: faker.internet.password(), // mocked for now
          addresses: {
             create: {
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                zip: faker.location.zipCode(),
                country: faker.location.country(),
                isDefault: true
             }
          }
        },
      })
    )
  );

  console.log('Seeding Categories...');
  const categoriesToCreate = ['Electronics', 'Clothing', 'Home', 'Toys', 'Sports'];
  const categories = await Promise.all(
    categoriesToCreate.map((name) =>
      prisma.category.create({
        data: {
          name,
          slug: faker.helpers.slugify(name).toLowerCase(),
          description: faker.commerce.productDescription()
        },
      })
    )
  );
```

**Step 2: Run Prisma Seed**
Run: `cd apps/backend && npx prisma db seed`
Expected: No errors, successful completion.

**Step 3: Commit**

```bash
git add apps/backend/prisma/seed.ts
git commit -m "feat(db): implement seeding for users, addresses and categories"
```

---

### Task 4: Seed Products and Deep Relationships

**Files:**
- Modify: `apps/backend/prisma/seed.ts`

**Step 1: Generate Products with Options and Variants**

Add inside `main()` after Categories seeding:

```typescript
  console.log('Seeding Products and Variants...');
  
  for (let i = 0; i < 15; i++) {
    const productName = faker.commerce.productName();
    
    // Choose random category
    const category = faker.helpers.arrayElement(categories);

    // Create the base product
    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: faker.helpers.slugify(productName + '-' + faker.string.alphanumeric(4)).toLowerCase(),
        description: faker.commerce.productDescription(),
        categories: {
            create: {
                category: { connect: { id: category.id } }
            }
        }
      }
    });

    // Create Options: Size and Color
    const sizeOption = await prisma.productOption.create({
        data: {
            productId: product.id,
            name: 'Size',
            values: {
                create: [
                    { value: 'S' },
                    { value: 'M' },
                    { value: 'L' }
                ]
            }
        },
        include: { values: true }
    });

    const colorOption = await prisma.productOption.create({
        data: {
            productId: product.id,
            name: 'Color',
            values: {
                create: [
                    { value: 'Red' },
                    { value: 'Blue' }
                ]
            }
        },
        include: { values: true }
    });

    // Generate Cartesian Product of Option Values to form Variants
    for (const size of sizeOption.values) {
        for (const color of colorOption.values) {
            await prisma.productVariant.create({
               data: {
                   productId: product.id,
                   sku: `${product.id}-${size.value}-${color.value}`.toUpperCase(),
                   price: faker.commerce.price({ min: 10, max: 200 }),
                   inventoryQuantity: faker.number.int({ min: 0, max: 100 }),
                   optionValues: {
                       create: [
                           { optionValue: { connect: { id: size.id } } },
                           { optionValue: { connect: { id: color.id } } }
                       ]
                   }
               }
            });
        }
    }
  }
```

**Step 2: Run Seed Script**
Run: `cd apps/backend && npx prisma db seed`
Expected: Successful schema execution generating the deep hierarchical structure.

**Step 3: Commit**

```bash
git add apps/backend/prisma/seed.ts
git commit -m "feat(db): seed products, attributes, options, and combination variants"
```
