## Backend Development Guidelines

- **Architectural Pattern:** Strictly adhere to the Router-Controller-Service architecture.
  - *Routes:* Define endpoints, apply middlewares, and forward requests to controllers.
  - *Controllers:* Manage HTTP request/response flow and validate inputs/outputs.
  - *Services:* Handle core business logic and database operations.
- **Database Operations Layer:** All database interactions must be encapsulated within specific service files located in the `services` directory. Do not perform direct database queries inside route handlers or controllers.
- **Admin Security:** Ensure that all admin-facing routes are strictly protected by authentication and authorization middlewares.
- **Comprehensive Testing:** Every API route must have accompanying test cases implemented using Jest and Supertest.

