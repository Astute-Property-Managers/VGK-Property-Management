# Altus - Enterprise Property Management Platform

## Tagline
**Elevate your Estate**

## Production cutover status
Altus now includes a browser frontend wired for production state persistence through backend APIs,
with local-only persistence disabled in production mode.

## Backend + database capabilities
- Authenticated API (`backend/server.mjs`)
- RBAC (`admin`, `manager`, `operator`, `auditor`)
- CRUD + archive + restore + delete lifecycle controls
- Audit logs for auth and record/state actions
- Login throttling controls
- Token revocation (`POST /api/auth/logout`)
- Strict CORS enforcement in production
- SQLite operational database (`backend/altus.db`)

## DB Browser for SQLite connectivity
Your DB Browser can open the backend database file directly:
- File path: `backend/altus.db`
- Ensure API is stopped before long read/write schema operations from DB Browser.
- Relevant tables:
  - `users`
  - `records`
  - `audit_logs`
  - `kv_state`
  - `revoked_tokens`

## Frontend production storage cutover
- In `development`: frontend uses browser localStorage.
- In `production`: frontend uses backend state API endpoints (`/api/state/:key`) and requires `VITE_API_ACCESS_TOKEN`.

## Run locally
```bash
npm install
cp .env.example .env
npm run api:start
npm run dev
```

## Required production configuration
- `VITE_APP_MODE=production`
- `VITE_API_BASE_URL=https://your-api.example.com/api`
- `VITE_API_ACCESS_TOKEN=<service access token>`
- `ALTUS_JWT_SECRET=<strong secret>`
- `ALTUS_ALLOWED_ORIGIN=https://your-frontend.example.com`
- `ALTUS_ADMIN_PASSWORD=<strong bootstrap password>`

## Core API endpoints
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/audit`
- `GET|POST|PUT|DELETE /api/:entityType[/:id]`
- `POST /api/:entityType/:id/archive`
- `POST /api/:entityType/:id/restore`
- `GET|PUT|DELETE /api/state/:key`
