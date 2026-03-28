# User Module & Authentication Design Document
**Date:** March 29, 2026
**Topic:** Backend User Module (CRUD & JWT Authentication)

## 1. Architecture & File Structure
This module follows a service-controller split pattern. All logic resides within the `apps/backend/src` directory:
- `routes/user.routes.ts`: Express router definitions mapping to controller methods.
- `controllers/user.controller.ts`: Handles HTTP request/response parsing and basic validation.
- `services/user.service.ts`: Core business logic (Prisma DB calls, bcrypt hashing, JWT signing, Resend emails).
- `middleware/auth.ts`: Express middleware for `authenticateToken` and `requireAdmin`.

## 2. Data Model (Prisma)
The existing `User` model in `schema.prisma` will be extended with:
- `resetToken` (String, optional)
- `resetTokenExpiry` (DateTime, optional)

## 3. Data Flow & APIs

### Auth Endpoints (`/api/users/`)
- `POST /register`: Accepts `email`, `password`, `firstName`, `lastName`. Hashes password, creates User, returns JWT.
- `POST /login`: Accepts `email`, `password`. Verifies hash, returns JWT.
- `POST /forgot-password`: Accepts `email`. Generates random token, updates User, sends email via Resend.
- `POST /reset-password`: Accepts `token` and `newPassword`. Validates token/expiry, updates passwordHash, clears token fields.

### CRUD Endpoints
- `GET /me`: Requires JWT. Returns current user profile.
- `PUT /me`: Requires JWT. Updates current user profile.
- `GET /`: Requires Admin role. Returns all users.
- `GET /:id`: Requires Admin role. Returns specific user.
- `DELETE /:id`: Requires Admin role. Deletes a user.

## 4. Dependencies & Security
- **Dependencies**: `bcryptjs`, `jsonwebtoken`, `resend`, `zod` (for validation).
- **Token Strategy**: JSON Payload Approach. Tokens are returned in the JSON body, and the client sends them as `Authorization: Bearer <token>`.
- **Error Handling**: Controllers catch errors and pass them to the existing `globalErrorHandler`. Custom errors with status codes (400, 401, 404, 500) will be thrown by the service layer.
