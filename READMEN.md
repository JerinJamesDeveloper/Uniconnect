# UniConnect API

Node.js + Express API using a clean layered architecture:

- `src/routes` → HTTP routes (Express routers)
- `src/controllers` → request/response handling
- `src/services` → business logic
- `src/models` → Sequelize models (SQLite by default)

## Run

1) Ensure `.env` exists (this repo includes a starter `.env`).
2) Start the server:

`npm run dev`

API base: `http://localhost:3000/api`

## Starter endpoints

- `GET /health` or `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me` (Bearer token)
- `GET /api/courses` (Bearer token)

## Optional admin seed

Set these in `.env` to auto-create an initial admin user on server start:

- `SEED_ADMIN=true`
- `ADMIN_EMAIL=...`
- `ADMIN_PASSWORD=...`
