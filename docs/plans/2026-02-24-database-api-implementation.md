# Database and API Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the normalized PostgreSQL database schema using Prisma and define the core REST API routes for products, cart, and checkout in the Express backend.

**Architecture:** A robust, normalized relational database using Prisma ORM with PostgreSQL. The backend is an Express.js application providing RESTful JSON APIs for the Next.js frontend, focusing on a robust product/variant model and full custom checkout flow handling both guest and authenticated users.

**Tech Stack:** Node.js, Express.js, Prisma ORM, PostgreSQL, TypeScript.

---

### Task 1: Initialize Database and Base User/Core Models

**Files:**
- Modify: `apps/backend/prisma/schema.prisma`

**Step 1: Write the Prisma Schema for Core Entities**

```prisma // apps/backend/prisma/schema.prisma
// Add to existing schema.prisma

enum Role {
  ADMIN
  CUSTOMER
}

model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String
  firstName     String
  lastName      String
  role          Role      @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  addresses     Address[]
  orders        Order[]
  cart          Cart?
}

model Address {
  id          Int      @id @default(autoincrement())
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  street      String
  city        String
  state       String
  zip         String
  country     String
  isDefault   Boolean  @default(false)
  orders      Order[]
}

model Category {
  id          Int       @id @default(autoincrement())
  parentId    Int?
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  name        String
  slug        String    @unique
  description String?   @db.Text
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  products    ProductCategory[]
}
```

**Step 2: Run Prisma Validate (Verify Syntax)**

Run: `cd apps/backend && npx prisma validate`
Expected: "Environment variables loaded... Prisma schema loaded and validated."

**Step 3: Commit**

```bash
git add apps/backend/prisma/schema.prisma
git commit -m "feat(db): add user, address, and self-referencing category models"
```

---

### Task 2: Implement Product and Variant Models

**Files:**
- Modify: `apps/backend/prisma/schema.prisma`

**Step 1: Write the Prisma Schema for Products and Variants**

```prisma // apps/backend/prisma/schema.prisma
// Add to existing schema.prisma

model Product {
  id          Int               @id @default(autoincrement())
  name        String
  slug        String            @unique
  description String?           @db.Text
  isActive    Boolean           @default(true)
  createdAt   DateTime          @default(now())
  categories  ProductCategory[]
  options     ProductOption[]
  variants    ProductVariant[]
}

model ProductCategory {
  productId   Int
  categoryId  Int
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([productId, categoryId])
}

model ProductOption {
  id          Int                  @id @default(autoincrement())
  productId   Int
  product     Product              @relation(fields: [productId], references: [id], onDelete: Cascade)
  name        String               // e.g., 'Size', 'Color'
  values      ProductOptionValue[]
}

model ProductOptionValue {
  id          Int                  @id @default(autoincrement())
  optionId    Int
  option      ProductOption        @relation(fields: [optionId], references: [id], onDelete: Cascade)
  value       String               // e.g., 'Small', 'Red'
  variants    VariantOptionValue[]
}

model ProductVariant {
  id                Int                  @id @default(autoincrement())
  productId         Int
  product           Product              @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku               String               @unique
  price             Decimal              @db.Decimal(10, 2)
  inventoryQuantity Int                  @default(0)
  optionValues      VariantOptionValue[]
  cartItems         CartItem[]
  orderItems        OrderItem[]
}

model VariantOptionValue {
  variantId     Int
  optionValueId Int
  variant       ProductVariant     @relation(fields: [variantId], references: [id], onDelete: Cascade)
  optionValue   ProductOptionValue @relation(fields: [optionValueId], references: [id], onDelete: Cascade)

  @@id([variantId, optionValueId])
}
```

**Step 2: Run Prisma Validate**

Run: `cd apps/backend && npx prisma validate`
Expected: "Environment variables loaded... Prisma schema loaded and validated."

**Step 3: Commit**

```bash
git add apps/backend/prisma/schema.prisma
git commit -m "feat(db): add product, option, and variant models"
```

---

### Task 3: Implement Cart and Order Models

**Files:**
- Modify: `apps/backend/prisma/schema.prisma`

**Step 1: Write the Prisma Schema for Cart and Orders**

```prisma // apps/backend/prisma/schema.prisma
// Add to existing schema.prisma

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

model Cart {
  id          Int        @id @default(autoincrement())
  userId      Int?       @unique // Nullable for guests
  user        User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessionId   String?    @unique // Present for guests
  updatedAt   DateTime   @updatedAt
  items       CartItem[]
}

model CartItem {
  id               Int            @id @default(autoincrement())
  cartId           Int
  cart             Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productVariantId Int
  productVariant   ProductVariant @relation(fields: [productVariantId], references: [id])
  quantity         Int            @default(1)
}

model Order {
  id                Int         @id @default(autoincrement())
  userId            Int?        // Nullable for guests
  user              User?       @relation(fields: [userId], references: [id])
  guestEmail        String?
  shippingAddressId Int?
  shippingAddress   Address?    @relation(fields: [shippingAddressId], references: [id])
  totalAmount       Decimal     @db.Decimal(10, 2)
  status            OrderStatus @default(PENDING)
  createdAt         DateTime    @default(now())
  items             OrderItem[]
}

model OrderItem {
  id               Int            @id @default(autoincrement())
  orderId          Int
  order            Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productVariantId Int
  productVariant   ProductVariant @relation(fields: [productVariantId], references: [id])
  quantity         Int
  unitPrice        Decimal        @db.Decimal(10, 2) // Price captured at checkout
}
```

**Step 2: Apply Migration**

Run: `cd apps/backend && npx prisma migrate dev --name init_ecommerce_schema`
Expected: "Your database is now in sync with your schema." (Requires PostgreSQL DB to be running/configured in `.env`).

**Step 3: Commit**

```bash
git add apps/backend/prisma/schema.prisma apps/backend/prisma/migrations/
git commit -m "feat(db): add cart, checkout, and order models"
```

---

### Task 4: Setup API Route Structure

**Files:**
- Modify: `apps/backend/src/index.ts`
- Create: `apps/backend/src/routes/categories.ts`
- Create: `apps/backend/src/routes/products.ts`
- Create: `apps/backend/src/routes/cart.ts`
- Create: `apps/backend/src/routes/checkout.ts`

**Step 1: Scaffold Route Files**

```bash
mkdir -p apps/backend/src/routes
touch apps/backend/src/routes/categories.ts apps/backend/src/routes/products.ts apps/backend/src/routes/cart.ts apps/backend/src/routes/checkout.ts
```

Set up basic routers in each file. Example for `products.ts`:
```typescript // apps/backend/src/routes/products.ts
import { Router } from 'express';
export const productRouter = Router();
productRouter.get('/', (req, res) => { res.json({ msg: 'products' }) });
```
(Repeat basic export for `categories`, `cart`, `checkout`)

**Step 2: Wire Routes in `index.ts`**

```typescript // apps/backend/src/index.ts
// Add alongside existing imports
import { productRouter } from './routes/products';
import { categoryRouter } from './routes/categories';
import { cartRouter } from './routes/cart';
import { checkoutRouter } from './routes/checkout';

// ... existing code ...
const app = express();
app.use(express.json());

// Add routes
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
```

**Step 3: Verify Server Compiles/Starts**

Run: `cd apps/backend && npm run build`
Expected: Output without TypeScript errors.

**Step 4: Commit**

```bash
git add apps/backend/src/
git commit -m "feat(api): scaffold core ecommerce API routes"
```

---

### Task 5: Implement Product Controller Logic (The "Heavy Lifter")

**Files:**
- Modify: `apps/backend/src/routes/products.ts`

**Step 1: Implement `GET /api/products/:slug`**

```typescript // apps/backend/src/routes/products.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const productRouter = Router();

productRouter.get('/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        categories: { include: { category: true } },
        options: {
          include: { values: true }
        },
        variants: {
          include: {
            optionValues: {
               include: { optionValue: true }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});
```

**Step 2: TypeScript Check**

Run: `cd apps/backend && npm run build`
Expected: Clean compilation.

**Step 3: Commit**

```bash
git add apps/backend/src/routes/products.ts
git commit -m "feat(api): implement deep product variant fetching by slug"
```

---

## Next Steps Context:
After this plan is complete, the subsequent plans should handle the business logic for merging guest carts into user carts upon login (`POST /api/cart/merge`), and the transaction logic for checkout (`POST /api/checkout`) to decrement stock and create the `OrderItem` pricing snapshots.
