# User Module & Authentication Completion Design Document
**Date:** March 29, 2026
**Topic:** Backend User Module (Security Hardening, Validation & Missing Features)

## 1. Overview
This document outlines the completion of the Backend User Module, addressing security gaps, missing endpoints, and incomplete validation identified in the code review of the initial implementation.

## 2. Infrastructure & Security

### Centralized Configuration (`src/lib/config.ts`)
- Load environment variables using `dotenv`.
- Export a `config` object with validated properties.
- **Fail Fast**: Throw an error if `JWT_SECRET` is not defined in `process.env`.

### Custom Error Classes (`src/middleware/errorHandler.ts`)
- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409) — Specifically for handling Prisma `P2002` (Unique constraint failed) errors.

### Validation Middleware (`src/middleware/validate.ts`)
- Reusable middleware using `zod`.
- Accepts a schema and validates `req.body`.
- Passes errors to the `globalErrorHandler`.

## 3. Data Flow & APIs

### User Endpoints (`/api/users/`) - `src/routes/user.routes.ts`
- `POST /register`: Accepts `email`, `password`, `firstName`, `lastName`. Validates inputs, creates user, returns token.
- `POST /login`: Accepts `email`, `password`. Verifies hash, returns token.
- `POST /forgot-password`: Accepts `email`. Generates `resetToken` and `resetTokenExpiry`, sends email via Resend.
- `POST /reset-password`: Accepts `token` and `newPassword`. Validates token/expiry, updates passwordHash.
- `GET /me`: Authenticated. Returns current user profile (excluding sensitive fields).
- `PUT /me`: Authenticated. Updates current user profile.

### Admin Endpoints (`/api/admin/users/`) - `src/routes/admin.routes.ts`
- `GET /`: Authenticated + Admin Role. Returns all users.
- `GET /:id`: Authenticated + Admin Role. Returns specific user details.
- `DELETE /:id`: Authenticated + Admin Role. Deletes a user.

## 4. Middleware Enhancements

### `authenticateToken` (`src/middleware/auth.ts`)
- Use centralized `config.JWT_SECRET`.
- Throw `UnauthorizedError` if token is missing or invalid.

### `authorizeRole` (`src/middleware/auth.ts`)
- New middleware to check `req.user.role`.
- Throw `ForbiddenError` if role is insufficient.

## 5. Testing Strategy
- **`auth.test.ts`**: Add cases for valid tokens, expired tokens, and malformed headers.
- **`user.service.test.ts`**: Add tests for password reset logic and profile updates.
- **`admin.routes.test.ts`**: Verify role-based access control (RBAC) behavior.

## 6. Cleanup
- Remove all `process.env.JWT_SECRET || 'secret'` fallbacks across the codebase.
- Ensure all controllers use the `validate` middleware.
- Refactor `UserService` to handle Prisma errors gracefully with specific `AppError` subclasses.
