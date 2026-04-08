# Product Catalog API Design

## Overview
This document outlines the design for the customer-facing Product Catalog Backend API within `apps/backend`. The goal is to provide endpoints for fetching products (with search/filters), categories, and single product details, adhering strictly to the `AGENTS.md` guidelines (Router -> Controller -> Service pattern).

## 1. Architecture & Data Flow

**Architectural Pattern:** 
Strict adherence to the Router-Controller-Service architecture.
*   **Routes:** Define the API endpoints (`/api/products`, `/api/categories`), apply middlewares, and forward requests to controllers.
*   **Controllers:** Manage the HTTP request/response flow, utilizing Zod schemas for query validation before hitting the service.
*   **Services:** Handle core business logic and Prisma database operations.

**Directory Structure:**
```text
apps/backend/src/
├── routes/
│   ├── product.routes.ts
│   └── category.routes.ts
├── controllers/
│   ├── product.controller.ts
│   └── category.controller.ts
├── services/
│   ├── product.service.ts
│   └── category.service.ts
```

## 2. API Endpoints & Validations

### 2.1 `GET /api/products` (Catalog Listing)
*   **Purpose:** Fetches a paginated list of products.
*   **Validation (Zod parameters):**
    *   `limit` (number, default: 20)
    *   `page` (number, default: 1)
    *   `q` (string, optional) - text search.
    *   `categorySlug` (string, optional) - filter by category slug.
*   **Response payload:** `{ data: [...], pagination: { total, page, totalPages } }`
*   **Data Fetched:** Lightweight properties (id, name, slug, price derived from variants).

### 2.2 `GET /api/products/:slug` (Product Details)
*   **Purpose:** Fetches complete details for a single product to populate the frontend Product details page and variant selectors.
*   **Validation:** Verify `slug` parameter exists.
*   **Data Fetched:** Deep Prisma fetch including related entities (`categories`, `options`, `variants`, `optionValues`).
*   **Error Handling:** Throws standard `404 Not Found` handled by the controller/middleware if `slug` does not exist.

### 2.3 `GET /api/categories`
*   **Purpose:** Fetches category listings to create frontend sidebars or navigation menus.
*   **Data Fetched:** Active categories, utilizing the schema's `children` relationship to output a hierarchical nested tree.

## 3. Testing Strategy
*   Implementation framework: Jest & Supertest.
*   Test files created in `src/__tests__/routes/`.
*   **Test Cases required per endpoint:**
    *   `GET /api/products`: 200 pass criteria (valid data, filtering logic test), 400 parameter errors (e.g., negative page numbers).
    *   `GET /api/products/:slug`: 200 deep object validation, 404 valid handler check.
    *   `GET /api/categories`: 200 hierarchy validation.
