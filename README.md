# Altus - Enterprise Property Management Platform

## Tagline
**Elevate your Estate**

## What this now includes
Altus now ships with a browser frontend **and** a production-oriented backend foundation:
- Secure backend API (`backend/server.mjs`)
- SQLite operational database (`backend/altus.db` by default)
- Authentication with signed bearer tokens
- Role-based access control (admin/manager/operator/auditor)
- Full record lifecycle support: **create, read, update, archive, restore, delete**
- Immutable audit trail for login and record actions

## Architecture
- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js HTTP API (no external runtime dependency), JSON REST endpoints
- **Database:** SQLite (`node:sqlite`), WAL mode enabled

## Local startup
```bash
npm install
cp .env.example .env
npm run api:start
npm run dev
```

Frontend runs at `http://localhost:3000`, API runs at `http://localhost:8787`.

## API security and roles
- `POST /api/auth/login` returns bearer token
- Roles:
  - `admin`: full access including hard delete and audit access
  - `manager`: create/edit/archive/restore
  - `operator`: create/edit
  - `auditor`: read + audit logs

## Core API endpoints
- Health: `GET /api/health`
- Login: `POST /api/auth/login`
- Audit: `GET /api/audit?limit=200&entityType=properties&entityId=<id>`
- Generic entity CRUD:
  - `GET /api/:entityType`
  - `GET /api/:entityType/:id`
  - `POST /api/:entityType`
  - `PUT /api/:entityType/:id`
  - `POST /api/:entityType/:id/archive`
  - `POST /api/:entityType/:id/restore`
  - `DELETE /api/:entityType/:id`

Supported entities include properties, tenants, maintenance, vendors, rocks, kpis,
critical-numbers, huddles, transactions, and owner-statements.

## Production hardening checklist
Before internet-facing go-live for sensitive financial/property operations:
- Replace default admin password and JWT secret from `.env`
- Put API behind TLS reverse proxy and WAF
- Move DB to managed PostgreSQL for HA/replication (recommended)
- Configure backup/restore policies and DR drills
- Stream audit logs to centralized SIEM
- Add MFA and password rotation policies
- Run SAST/DAST/pentest and patch SLAs

## Notes on persistence migration
Frontend still contains browser storage for legacy compatibility. Production should point frontend to backend APIs (`VITE_API_BASE_URL`) and progressively disable local-only persistence in operational environments.
