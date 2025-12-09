# Verne-Grisworld-Koch (VGK) Property Command

**Strategic Property Management Platform for Uganda**

## Overview

VGK Property Command is a comprehensive property management system designed specifically for the Ugandan market, integrating:

- **Verne Harnish's Scaling Up** methodology for strategic execution
- **Robert Griswold's Property Management** best practices
- **Richard Koch's 80/20 Principle** for focused value creation
- **IREM Standards** for professional property management
- **Lean Accounting & Lean Finance** principles
- **CPA Uganda/IFRS/URA Compliance** for financial reporting

## Core Modules

### Strategic Planning & Execution
- One Page Strategic Plan (OPSP)
- Quarterly Rocks (Priorities)
- KPIs & Critical Numbers
- Daily/Weekly Huddles

### Property Operations
- Property Portfolio Management
- Tenant Relationship Management
- Maintenance Request Tracking
- Vendor/Contractor Management

### Financial Management
- Chart of Accounts (IFRS-compliant)
- General Ledger (Double-entry)
- Cashflow Forecasting
- Income Statement & Balance Sheet
- Transaction Ledger
- Lean Financial Insights

### Communication
- SMS Notifications (via API)
- WhatsApp Messaging (via API)
- Bulk Messaging Support

## Security Features

- Input sanitization (XSS prevention)
- HTML entity escaping
- Secure data validation
- CORS-ready API integration

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Build Tool**: Vite
- **Data Storage**: localStorage (demo) - Use secure backend for production

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Serve on LAN (for office network access)
npm run serve
\`\`\`

## Deployment for LAN Access

1. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Serve the `dist` folder:
   \`\`\`bash
   npm run serve
   \`\`\`

3. Access from other devices on your network using:
   \`\`\`
   http://<your-ip-address>:3000
   \`\`\`

## Configuration

### SMS/WhatsApp API
Update the `MESSAGING_API_KEY` in `src/services/messagingService.ts` with your actual API credentials.

### Financial Settings
Configure your Chart of Accounts in the application to match your specific accounting needs.

## Best Practices

1. **80/20 Focus**: Concentrate on the 20% of activities that drive 80% of results
2. **Lean Operations**: Eliminate waste, maximize value streams
3. **Compliance First**: Ensure all financial transactions support IFRS/URA reporting
4. **Proactive Communication**: Use automated reminders for rent collection
5. **Data-Driven Decisions**: Review KPIs and Critical Numbers daily

## License

Proprietary - For internal use only

## Support

For technical support or feature requests, contact your development team.
