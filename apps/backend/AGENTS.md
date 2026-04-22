## Backend Development Guidelines

- **Architectural Pattern:** Strictly adhere to the Router-Controller-Service architecture.
  - *Routes:* Define endpoints, apply middlewares, and forward requests to controllers.
  - *Controllers:* Manage HTTP request/response flow and validate inputs/outputs.
  - *Services:* Handle core business logic and database operations.
- **Database Operations Layer:** All database interactions must be encapsulated within specific service files located in the `services` directory. Do not perform direct database queries inside route handlers or controllers.
- **Admin Security:** Ensure that all admin-facing routes are strictly protected by authentication and authorization middlewares.
- **Comprehensive Testing:** Every API route must have accompanying test cases implemented using Jest and Supertest.
- **Error Handling:** Always prioritize using dedicated error handlers and a global error handling middleware to manage exceptions and provide consistent error responses across the application. (errorHandler.ts)
- **Database Schema Changes:** Any modifications to `schema.prisma` require:
  - Updating `seed.ts` to reflect the changes.
  - Running `npx prisma generate` to update the Prisma Client.
  - Running `npx prisma migrate dev` to apply database changes.
  - Running `npx prisma db seed` to refresh the database with updated seed data.

