# User Module Completion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the backend user module by implementing missing authentication endpoints (login, password reset), profile management, and admin CRUD, while hardening security and validation.

**Architecture:** Service-Controller pattern with centralized config, custom error classes, and Zod validation middleware. Admin routes are separated into their own router.

**Tech Stack:** Node.js, Express, Prisma, Zod, JWT, bcryptjs, Resend.

---

### Task 1: Centralized Configuration
**Files:**
- Create: `apps/backend/src/lib/config.ts`

**Step 1: Write the config utility**
```typescript
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '1d',
  resetTokenExpiresIn: 3600000, // 1 hour
};
```

**Step 2: Commit**
```bash
git add apps/backend/src/lib/config.ts
git commit -m "feat: add centralized configuration"
```

---

### Task 2: Custom Error Classes
**Files:**
- Modify: `apps/backend/src/middleware/errorHandler.ts`

**Step 1: Add specific error subclasses**
```typescript
export class BadRequestError extends AppError {
  constructor(message: string) { super(message, 400); }
}
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') { super(message, 401); }
}
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') { super(message, 403); }
}
export class ConflictError extends AppError {
  constructor(message: string) { super(message, 409); }
}
```

**Step 2: Commit**
```bash
git add apps/backend/src/middleware/errorHandler.ts
git commit -m "feat: add custom error classes"
```

---

### Task 3: Validation Middleware
**Files:**
- Create: `apps/backend/src/middleware/validate.ts`

**Step 1: Implement Zod validation middleware**
```typescript
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from './errorHandler.js';

export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new BadRequestError(error.errors[0].message));
      } else {
        next(error);
      }
    }
  };
```

**Step 2: Commit**
```bash
git add apps/backend/src/middleware/validate.ts
git commit -m "feat: add validation middleware"
```

---

### Task 4: Auth Middleware Refactor & Role Support
**Files:**
- Modify: `apps/backend/src/middleware/auth.ts`

**Step 1: Update authenticateToken and add authorizeRole**
```typescript
import { config } from '../lib/config.js';
import { UnauthorizedError, ForbiddenError } from './errorHandler.js';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) throw new UnauthorizedError('Access denied');
  
  try {
    const verified = jwt.verify(token, config.jwtSecret);
    (req as any).user = verified;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
};

export const authorizeRole = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!roles.includes(user.role)) throw new ForbiddenError();
  next();
};
```

**Step 2: Commit**
```bash
git add apps/backend/src/middleware/auth.ts
git commit -m "feat: update auth middleware and add role authorization"
```

---

### Task 5: User Service Enhancements
**Files:**
- Modify: `apps/backend/src/services/user.service.ts`

**Step 1: Implement login, forgotPassword, and resetPassword**
Implement password hashing verification and token generation.

**Step 2: Commit**
```bash
git add apps/backend/src/services/user.service.ts
git commit -m "feat: complete user service auth logic"
```

---

### Task 6: User Profile Implementation
**Files:**
- Modify: `apps/backend/src/controllers/user.controller.ts`
- Modify: `apps/backend/src/routes/user.routes.ts`

**Step 1: Add profile endpoints**
Implement `GET /me` and `PUT /me`.

**Step 2: Commit**
```bash
git add apps/backend/src/controllers/user.controller.ts apps/backend/src/routes/user.routes.ts
git commit -m "feat: implement user profile endpoints"
```

---

### Task 7: Admin Routes
**Files:**
- Create: `apps/backend/src/routes/admin.routes.ts`
- Modify: `apps/backend/src/index.ts`

**Step 1: Create admin router and register in app**
Implement `GET /`, `GET /:id`, and `DELETE /:id` with `authorizeRole(['ADMIN'])`.

**Step 2: Commit**
```bash
git add apps/backend/src/routes/admin.routes.ts apps/backend/src/index.ts
git commit -m "feat: implement admin routes"
```

---

### Task 8: Verification
**Step 1: Run tests**
Run: `npm test`
Expected: ALL PASS.

**Step 2: Final Commit**
```bash
git commit --allow-empty -m "chore: complete user module authentication feature"
```
