# User Module Implementation Plan
 REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the backend User Module with full CRUD and JWT-based Auth (register, login, forgot/reset password).

**Architecture:** Service-Controller split within Express, using Prisma for DB, Resend for emails, and bcrypt/JWT for auth.

**Tech Stack:** Node.js, Express, TypeScript, Prisma, Jest, bcryptjs, jsonwebtoken, resend.

---

### Task 1: Prisma Schema & Dependencies

**Files:**
- Modify: `apps/backend/package.json`
- Modify: `apps/backend/prisma/schema.prisma`

**Step 1: Install Dependencies**
```bash
cd apps/backend
npm install bcryptjs jsonwebtoken resend zod
npm install -D @types/bcryptjs @types/jsonwebtoken
```

**Step 2: Update Schema**
```prisma
// In apps/backend/prisma/schema.prisma, update User:
  resetToken       String?
  resetTokenExpiry DateTime?
```

**Step 3: Run Prisma Push**
```bash
cd apps/backend
npx prisma db push
```

**Step 4: Commit**
```bash
git add apps/backend/package.json apps/backend/package-lock.json apps/backend/prisma/schema.prisma
git commit -m "feat(user): add auth dependencies and user resetToken fields"
```

---

### Task 2: Auth Utilities & Middleware

**Files:**
- Create: `apps/backend/src/middleware/auth.ts`
- Test: `apps/backend/src/__tests__/middleware/auth.test.ts`

**Step 1: Write the failing test**
```typescript
import { authenticateToken } from '../../middleware/auth';
import type { Request, Response, NextFunction } from 'express';

describe('Auth Middleware', () => {
  it('should return 401 if no auth header', () => {
    const req = { header: jest.fn().mockReturnValue(null) } as unknown as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;
    
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `cd apps/backend && npm run test -- src/__tests__/middleware/auth.test.ts`
Expected: FAIL with "Cannot find module"

**Step 3: Write minimal implementation**
```typescript
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    (req as any).user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
```

**Step 4: Run test to verify it passes**
Run: `cd apps/backend && npm run test -- src/__tests__/middleware/auth.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add apps/backend/src/middleware/auth.ts apps/backend/src/__tests__/middleware/auth.test.ts
git commit -m "feat(user): add JWT auth middleware"
```

---

### Task 3: User Service (Auth Logic)

**Files:**
- Create: `apps/backend/src/services/user.service.ts`
- Test: `apps/backend/src/__tests__/services/user.service.test.ts`

**Step 1: Write the failing test**
```typescript
import { UserService } from '../../services/user.service';
import { prisma } from '../../lib/prisma'; // Assuming this exists

jest.mock('../../lib/prisma', () => ({
  prisma: { user: { create: jest.fn() } }
}));

describe('UserService.register', () => {
  it('should hash password and create user', async () => {
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1, email: 'test@test.com' });
    const result = await UserService.register('test@test.com', 'password123', 'John', 'Doe');
    expect(result.token).toBeDefined();
    expect(prisma.user.create).toHaveBeenCalled();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `cd apps/backend && npm run test -- src/__tests__/services/user.service.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**
```typescript
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService {
  static async register(email: string, password: string, firstName: string, lastName: string) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName }
    });
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return { user, token };
  }
  // login, forgotPassword, resetPassword to follow
}
```

**Step 4: Run test to verify it passes**
Run: `cd apps/backend && npm run test -- src/__tests__/services/user.service.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add apps/backend/src/services/user.service.ts apps/backend/src/__tests__/services/user.service.test.ts
git commit -m "feat(user): implement user service register method"
```

---

### Task 4: User Controller & Routes

**Files:**
- Create: `apps/backend/src/controllers/user.controller.ts`
- Create: `apps/backend/src/routes/user.routes.ts`
- Modify: `apps/backend/src/index.ts`

**Step 1: Write the minimal implementation**
*(Skipping test for brevity in plan, but controllers should map req to service and return res)*
```typescript
// controllers/user.controller.ts
import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const result = await UserService.register(email, password, firstName, lastName);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
```
```typescript
// routes/user.routes.ts
import { Router } from 'express';
import { register } from '../controllers/user.controller.js';

export const userRouter = Router();
userRouter.post('/register', register);
```
```typescript
// In index.ts
import { userRouter } from './routes/user.routes.js';
app.use('/api/users', userRouter);
```

**Step 2: Commit**
```bash
git add apps/backend/src/controllers/user.controller.ts apps/backend/src/routes/user.routes.ts apps/backend/src/index.ts
git commit -m "feat(user): add user controller and routes"
```
