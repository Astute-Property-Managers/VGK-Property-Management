# Altus - Property Management Platform

## Tagline
**Elevate your Estate**

## Overview
Altus is a browser-based property management application for Uganda inspired by the work of Verne Harnish (Scaling Up), Robert Griswold (property management), and Richard Koch (80/20 focus).

## Core Capabilities
- Strategic planning: OPSP, Rocks, KPIs, Critical Numbers, Huddles
- Property operations: properties, tenants, screening, lease renewals, move-in/out, maintenance, vendors
- Financial management: cashflow, chart of accounts, ledger, financial overview, owner statements
- 80/20 analytics dashboard

## Development
```bash
npm install
npm run dev
```

## Build and preview
```bash
npm run build
npm run preview
```

## Storage
Current browser mode uses localStorage for persistence.

## Production readiness notes
To make Altus fully production-ready for sensitive operational and financial workloads:
- Move storage to a secure backend API and database
- Add authentication and role-based authorization
- Add audit logging and backup/restore strategy
- Enforce transport security and secrets management
