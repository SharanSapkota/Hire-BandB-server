# GearQuest Backend

Express + Prisma + PostgreSQL backend for bike rentals.

Features
- User signup/login with JWT
- User roles and types
- Bikes CRUD with categories and rental status

Quick start

1. Copy `.env.example` to `.env` and update `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
```

4. Run the server:

```bash
npm run dev
```

API Endpoints

- POST /api/auth/signup { name, email, password }
- POST /api/auth/login { email, password }
- GET /api/bikes
- GET /api/bikes/:id
- POST /api/bikes (auth) { name, description, rentAmount, categoryName, ... }
- PUT /api/bikes/:id (auth)
- DELETE /api/bikes/:id (auth)

Notes
- You need a running PostgreSQL instance and a DATABASE_URL set in .env.

API documentation (Swagger)

After installing dependencies and starting the server (defaults to port 4000), open:

http://localhost:4000/api-docs

The docs are generated from JSDoc comments in `src/routes/**/*.ts`.
