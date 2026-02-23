# Altus - Enterprise Property Management Platform

## Tagline
**Elevate your Estate**

## Product Intent
Altus is being engineered as an enterprise-grade, browser-based property management platform for real operations in Uganda, inspired by Verne Harnish (Scaling Up), Robert Griswold (property management), and Richard Koch (80/20 principle).

## Current Architecture (This Repository)
- React + TypeScript + Vite front-end
- Modular domain views (strategy, operations, finance, analytics)
- Centralized client data and security services
- Runtime guardrails for production configuration
- Error boundary + baseline client observability hooks

## Enterprise Target Architecture
1. **Frontend (this app):** secure browser UI and workflow orchestration
2. **Backend API (required for production):** authenticated service layer, role-based authorization, audit logging, reporting endpoints
3. **Database:** managed relational store (PostgreSQL preferred for scale; SQLite acceptable for small controlled environments)
4. **Integrations:** SMS/WhatsApp gateways, accounting exports, BI feeds
5. **Operations:** CI/CD, infrastructure monitoring, backups, incident response

## Local Development
```bash
npm install
cp .env.example .env
npm run dev
```

## Production Build Validation
```bash
npm run build
npm run preview
```

## Production Deployment Requirements (Mandatory)
- Set `VITE_APP_MODE=production`
- Set `VITE_API_BASE_URL` to your secured backend endpoint
- Disable demo/local browser-only persistence in deployment architecture
- Configure real messaging credentials and endpoints
- Enforce TLS, RBAC, audit logs, backups, and security monitoring

## Security and Compliance Direction
- Align with Uganda Data Protection and Privacy Act controls
- Enforce least privilege access
- Encrypt data in transit and at rest
- Maintain immutable audit trails for financial operations
