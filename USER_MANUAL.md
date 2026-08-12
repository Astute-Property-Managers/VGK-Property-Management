# Altus — User Manual

**Version 1.1**
**Property Management System for Uganda**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard Overview](#dashboard-overview)
4. [Strategic Planning Module](#strategic-planning-module)
5. [Property Operations Module](#property-operations-module)
6. [Financial Management Module](#financial-management-module)
7. [Best Practices](#best-practices)
8. [Compliance & Reporting](#compliance--reporting)
9. [Troubleshooting](#troubleshooting)
10. [Glossary](#glossary)
11. [Quick Reference Guide](#quick-reference-guide)
12. [Support & Updates](#support--updates)
13. [Appendices](#appendices)

---

## Introduction

### About Altus

Altus is a comprehensive property management system designed specifically for Ugandan property managers. It combines:

- **Verne Harnish's Scaling Up** methodology for strategic execution
- **Robert Griswold's** property management best practices
- **80/20 Pareto Principle** for focus on what matters
- **IFRS-compliant** accounting (ICPAU/CPA Uganda standards)
- **URA-ready** tax reporting

### Who Should Use This System?

- Property managers managing multiple rental properties in Uganda
- Property owners tracking their portfolio performance
- Real estate companies requiring professional financial reporting
- Anyone seeking to scale their property management operations

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for initial setup)
- Network access to LAN server (for deployment)

### How to Read This Manual

Sections are organized by module, in the order they appear in the sidebar. Items marked **[Admin]** are for the system administrator, not day-to-day users. Items marked **[Accountant]** should be confirmed with your CPA before acting.

---

## Getting Started

### First-Time Setup

1. **Access the System**
   - Open your web browser
   - Navigate to the application URL
   - The system loads with sample data for demonstration — replace it with your real data before going live

2. **Understand the Interface**
   - **Sidebar Navigation**: Access all modules on the left
   - **Header**: Shows current date and system title
   - **Main Content Area**: Displays the selected module

3. **Initial Data Entry — in this order**
   - Start with **Properties** (add your property portfolio)
   - Then **Tenants** (add current tenants with their lease details)
   - Then **Vendors** (your core contractor list)
   - Configure **Chart of Accounts** only if needed (a default IFRS structure is provided)

> **Tip:** Resist the urge to enter historical data. Load current balances and live records first; backfill history only if your accountant requires it.

---

## Dashboard Overview

### What You See

The Dashboard provides at-a-glance insight into your entire operation.

#### Quick Stats
- **Total Properties**: Number of properties in your portfolio
- **Occupancy Rate**: Percentage of units occupied (Target: 95%+)
- **Overdue Payments**: Tenants with late rent (requires immediate action)
- **Active Maintenance**: Open maintenance requests

#### Strategic Metrics
- **Rocks Preview**: Top 3 quarterly priorities with status
- **KPIs Preview**: Key performance indicators with trend indicators
- **Critical Numbers**: The 3–5 metrics that predict business success

#### Quick Actions
- Add New Property
- Record Payment
- Create Maintenance Request

### How to Use It

- **Daily check**: Start each day by reviewing the dashboard
- **Focus areas**: Red indicators require immediate attention
- **Drill down**: Click any metric to access the detailed view

---

## Strategic Planning Module

### 1. One Page Strategic Plan (OPSP)

**Purpose**: Your entire strategy on one page — from purpose to quarterly objectives.

#### How to Use

1. **Navigate**: Click "Strategic Planning" → "OPSP" in the sidebar
2. **Edit**: Click the "Edit Plan" button
3. **Fill in the sections**:
   - **Core Values**: What you stand for (3–5 values)
   - **Purpose**: Why your business exists
   - **BHAG**: Big Hairy Audacious Goal (10–25 year vision)
   - **3-Year Picture**: What success looks like in 3 years
   - **Annual Theme**: Focus for this year (e.g., "Year of Growth")
   - **Annual Initiatives**: 3–7 key projects for the year
   - **Quarterly Theme**: Current quarter focus
   - **Quarterly Objectives**: 3–5 objectives for this quarter (these become Rocks)
4. **Save**: Click "Save Plan" when done
5. **Share**: Print or screenshot to share with your team

**Best Practice**: Review and update quarterly. Use it in weekly huddles to keep the team aligned.

---

### 2. Rocks (Quarterly Priorities)

**Purpose**: Track the 3–5 most important priorities for the quarter.

#### How to Use

1. **Add a new Rock**:
   - Click "+ Add New Rock"
   - **Title**: Short, clear description (e.g., "Reduce Vacancy to 5%")
   - **Description**: Why this matters and what success looks like
   - **Owner**: The one person accountable for completion
   - **Due Date**: End of quarter (~90 days)
   - **Category**: Growth, Financial, Operational, or People
   - **Status**: GREEN (on track), YELLOW (at risk), RED (off track)
   - **Progress**: 0–100% completion

2. **Update weekly**:
   - During weekly huddles, update status and progress
   - Change the color based on current state
   - Add notes about blockers or help needed

3. **Complete a Rock**:
   - Set progress to 100%
   - Status automatically becomes GREEN
   - Celebrate the win in the next huddle

**Best Practices**:
- Limit to 3–5 Rocks (too many = no focus)
- One owner per Rock (clear accountability)
- Review status in every weekly huddle

---

### 3. KPIs (Key Performance Indicators)

**Purpose**: Measure the activities that predict future success.

#### How to Use

1. **Add a KPI**:
   - Click "+ Add New KPI"
   - **Name**: Clear metric name (e.g., "Rent Collection Rate")
   - **Description**: What it measures and why it matters
   - **Current Value**: Today's number
   - **Target Value**: Goal to achieve
   - **Unit**: %, UGX, #, days, etc.
   - **Frequency**: How often you track it (Daily/Weekly/Monthly/Quarterly)
   - **Trend**: Improving (📈), declining (📉), or stable (➡️)

2. **Update regularly**:
   - Edit the KPI to enter a new current value
   - The system auto-calculates achievement % and status
   - GREEN = hitting target, YELLOW = close, RED = missing

3. **Track history**:
   - The system saves each update
   - Review trends over time to spot patterns

#### Recommended KPIs

| KPI | Formula | Target |
|---|---|---|
| Rent Collection Rate | (Paid tenants / Total tenants) × 100 | 95%+ |
| Occupancy Rate | (Occupied units / Total units) × 100 | 95%+ |
| Average Days to Collect | Avg. time from due date to payment | < 3 days |
| Maintenance Response Time | Days from request to completion | < 5 days |
| Operating Expense Ratio (OER) | (Total expenses / Total income) × 100 | < 50% |

---

### 4. Critical Numbers

**Purpose**: The 3–5 numbers that, if achieved, guarantee business success.

#### How to Use

1. **Define Critical Numbers**:
   - Click "+ Add Critical Number"
   - Similar to KPIs, but MORE important — these are non-negotiable targets
   - Update at least weekly

2. **View history**:
   - Click the 📊 icon on any number
   - See the trend chart over time
   - Spot patterns and make decisions

**Difference from KPIs**:
- **KPIs**: 5–10 metrics you track
- **Critical Numbers**: THE 3–5 that matter most right now
- Critical Numbers may change as the business evolves

**Example Critical Numbers**:
- Cash Balance (liquidity health)
- Net Operating Income (profitability)
- Rent Collection Rate (cash flow)
- Occupancy Rate (revenue potential)
- Tenant Satisfaction Score (retention)

---

### 5. Huddles (Daily & Weekly Meetings)

**Purpose**: Maintain a rhythm of communication and accountability.

#### Daily Huddle (5–15 minutes, same time and place every day)

1. **Log the huddle**:
   - Click "+ Log New Huddle"
   - Select "Daily Huddle"
   - Set today's date
   - Add attendees

2. **Structure** (about 5 minutes each):
   - **Wins**: What went well yesterday? (celebrate)
   - **Stucks**: What's blocking progress? (get help)
   - **Priorities**: Top 1–3 things to accomplish today

3. **Rules**:
   - Stand up (keeps it short)
   - No problem-solving (take it offline)
   - Focus on today and tomorrow only

#### Weekly Huddle (60–90 minutes)

1. **Structure**:
   - **Wins**: Celebrate the week's successes (5 min)
   - **Rocks Review**: Update all quarterly priorities (20 min)
   - **KPIs / Critical Numbers**: Review metrics (15 min)
   - **Stucks**: Identify and resolve blockers (20 min)
   - **Priorities**: Set focus for next week (10 min)

2. **Log it in the system**:
   - Select "Weekly Huddle"
   - Document all wins, stucks, and priorities
   - Add notes on decisions made

**Best Practice**: Daily huddles prevent fires; weekly huddles keep Rocks on track; consistency creates accountability.

---

## Property Operations Module

### 6. Properties

**Purpose**: Manage your property portfolio.

#### Adding a Property

1. Click "+ Add New Property"
2. Fill in the details:
   - **Name**: Clear identifier (e.g., "Kampala Heights")
   - **Address**: Full address
   - **Type**: Residential, Commercial, or Mixed
   - **Total Units**: Number of rentable units
   - **Occupied Units**: Currently rented (keep this in sync with your tenant records)
   - **Owner**: Property owner name
   - **Acquisition Date**: When the property was acquired
   - **Status**: Active or Inactive
3. Click "Save Property"

#### Viewing Property Performance

- **Vacancy Rate**: Automatically calculated
- **Occupancy**: Visual indicator (GREEN = good, RED = attention needed)
- **Tenant Count**: Number of current tenants
- Click a property name to drill into its tenants

**Best Practices**:
- Keep property details up to date
- Review vacancy rates weekly
- Target vacancy < 5% (IREM standard)

---

### 7. Tenants

**Purpose**: The core of your business — rent collection and tenant management.

#### Adding a Tenant

1. Click "+ Add New Tenant"
2. Fill in the required information:
   - **Name**: Full name
   - **Contact**: Phone (+256 format)
   - **Property**: Select from dropdown
   - **Unit Number**: e.g., A-101
   - **Lease Dates**: Start and end dates
   - **Rent Amount**: Monthly rent in UGX
   - **Security Deposit**: Amount held
   - **Next Payment Date**: When rent is due
3. Click "Save Tenant"

> **Before you add a tenant — screening (Griswold standard):** verify identity (national ID), confirm income or employment, take references from a previous landlord where possible, and sign a written lease agreement *before* handing over keys. Record the lease start/end dates in the system on day one.

#### Recording Rent Payment

**This is the most important daily task.**

1. Find the tenant in the list
2. Click the "💰 Pay" button
3. Enter payment details:
   - **Amount**: Usually monthly rent, but partial payments are allowed
   - **Method**: Mobile Money, Bank Transfer, or Cash
   - **Reference Number**: Mobile Money transaction ID or cheque number
   - **Notes**: e.g., "Rent for January 2026"
4. Click "Record Payment"

**What happens automatically**:
- ✅ Payment added to the tenant's history
- ✅ Next payment date calculated (~30 days forward — adjust manually for leases that run calendar-month to calendar-month)
- ✅ Payment status updated to "Paid"
- ✅ **General Ledger entries created** (Debit: Cash, Credit: Rental Income)
- ✅ Financial reports updated in real time

#### Payment Status Indicators

- **🟢 Paid**: Rent paid, next due date in the future
- **🟡 Due**: Payment due today or within 3 days
- **🔴 Overdue**: Payment past due (URGENT)

#### Sending Rent Reminders

1. The system shows the overdue count in red
2. Click "📱 Send Rent Reminders"
3. Confirm the number of tenants
4. SMS is sent via the configured gateway

**SMS message example**:
> "Dear [Name], this is a friendly reminder that your rent payment of UGX 500,000 for Kampala Heights — Unit A-101 is overdue. Please make payment at your earliest convenience. Thank you!"

**[Admin]** Reminders require a configured SMS gateway with available credits. See Troubleshooting if sending fails.

#### Viewing Payment History

- Click the tenant's name or "Edit"
- Scroll to the payment history section
- See all payments with dates, amounts, and methods

#### Lease Lifecycle: Renewals, Move-Outs, and Deposits

The system tracks lease dates and deposits — use these workflows around them:

**Lease renewals** (start 60 days before lease end):
1. Filter or scan tenant records for leases ending in the next 60 days
2. Contact the tenant to confirm renewal or notice
3. On renewal: edit the tenant record and update lease end date (and rent amount if adjusted)
4. On non-renewal: schedule the unit turn (see below)

**Move-out and security deposit refund**:
1. Inspect the unit with the tenant; document condition (photos recommended — keep them with the lease file)
2. Deduct legitimate costs (damage beyond normal wear, unpaid rent) from the deposit
3. Refund the balance promptly; record the refund through your accountant as a manual GL entry (Debit: Security Deposits Payable 2100, Credit: Cash 1000)
4. Remove or archive the tenant record and update the property's **Occupied Units** count — occupancy stats depend on it

**Unit turn** (preparing the unit for the next tenant):
1. Create a Maintenance Request for each repair needed (category and priority as appropriate)
2. Complete cleaning, painting, and repairs — track costs against the property
3. Re-list and screen the next tenant (target: vacancy under 30 days)

**Best Practices**:
- **Record payments daily** — don't let them pile up
- **Send reminders on Day 3** of overdue status
- **Follow up personally** after Day 7 overdue
- **Target: 95%+ collection rate** (Griswold standard)

---

### 8. Maintenance Requests

**Purpose**: Track maintenance from request to completion. Response time drives tenant satisfaction.

#### Creating a Request

1. Click "+ New Request"
2. Fill in the details:
   - **Property**: Select property
   - **Unit Number**: Specific unit (if applicable)
   - **Category**: Plumbing, Electrical, HVAC, Structural, Landscaping, Security, Other
   - **Priority**:
     - **Critical**: Life/safety issue (no water, electrical hazard) — respond immediately
     - **Urgent**: Affects habitability (leaking roof, broken lock) — respond within 24 hours
     - **Routine**: Cosmetic/minor (paint touch-up) — schedule within a week
   - **Description**: Clear explanation of the issue
   - **Status**: Pending (update it as work progresses)
3. Click "Save Request"

#### Managing the Request

1. **Assign a vendor**:
   - Edit the request
   - Select a vendor from the dropdown
   - Status → "Assigned"

2. **Track progress**:
   - Vendor arrives → Status: "In Progress"
   - Waiting on parts or access → Status: "On Hold"
   - Fixed → Status: "Completed", and enter the Date Completed

3. **Record costs**:
   - **Estimated Cost**: Quote from the vendor
   - **Actual Cost**: Final invoice amount
   - Track the variance to improve future estimates

#### Viewing Performance

**Stats dashboard**:
- **Average Response Time**: Days from request to completion
- **Targets**: < 5 days for routine, < 24 hours for urgent (Griswold standard)
- **Pending Count**: Requests awaiting assignment
- **In Progress**: Active work

**Filters**:
- By status (see all Pending, etc.)
- By priority (focus on Critical first)

**Best Practices**:
- **Critical requests**: Respond within 1 hour
- **Urgent requests**: Respond same day
- **Routine requests**: Acknowledge within 24 hours, complete within 5–7 days
- **Track response time** as a KPI
- **Build vendor relationships** for faster response

---

### 9. Vendors

**Purpose**: Manage your contractor network. 20% of vendors do 80% of the work.

#### Adding a Vendor

1. Click "+ Add Vendor"
2. Fill in the information:
   - **Name**: Company or person name
   - **Contact Person**: Who to call
   - **Phone**: +256 format
   - **Email**: For invoices and communication
   - **Specializations**: Add multiple (Plumbing, Electrical, etc.)
   - **Rating**: 1–5 stars based on performance
   - **Status**: Active or Inactive
   - **Notes**: Pricing, response time, quality observations
3. Click "Save Vendor"

#### Rating Vendors

Update ratings based on:
- **Quality of work**: Did they fix it right the first time?
- **Response time**: How quickly did they arrive?
- **Pricing**: Fair and transparent?
- **Communication**: Professional and responsive?
- **Reliability**: Do they show up when promised?

**Rating scale**:
- ⭐ Poor — don't use again
- ⭐⭐ Below average — use only if desperate
- ⭐⭐⭐ Average — acceptable
- ⭐⭐⭐⭐ Good — preferred vendor
- ⭐⭐⭐⭐⭐ Excellent — priority vendor (your 20%)

#### The 80/20 Rule

- Your **top 20% of vendors** (4–5 star rated) should handle **80% of the work**
- Invest in those relationships:
  - Regular work → better pricing
  - Priority response times
  - Trust and reliability

**Best Practices**:
- Maintain 3–5 vendors per category
- Rate them after every job
- Promote 4–5 star vendors to "go-to" status
- Keep a backup vendor for each category
- Negotiate bulk pricing with top vendors

---

## Financial Management Module

### 10. Cashflow Forecast

**Purpose**: "Cash is oxygen" — Verne Harnish. Never run out.

#### Understanding the View

The **12-month table** shows, for each month:
- **Projected Income**: What you expect to collect
  - Rent income
  - Other income (parking, late fees, etc.)
- **Projected Expenses**: What you expect to pay
  - Maintenance
  - Operating expenses (utilities, management)
  - Property tax & insurance
  - Management fees
- **Projected Net**: Income − Expenses
- **Actual**: Real numbers from the General Ledger (auto-calculated)
- **Variance**: Actual − Projected (are you on track?)

#### How to Use

1. **Set projections** (do this quarterly):
   - Click "Edit" on any month
   - Enter projected amounts for all categories
   - Base them on historical trends plus expected changes
   - Click "Save Forecast"

2. **Monitor actuals**:
   - The system automatically pulls from the General Ledger
   - Compare to projections monthly
   - Green variance = beating forecast ✅
   - Red variance = below forecast ⚠️

3. **Take action**:
   - Negative variance? Review expenses, push collections
   - Low-cash month coming? Plan ahead; delay non-essential expenses
   - Surplus cash? Reinvest, or build the maintenance reserve

**Charts**:
- **Net Cashflow**: Line chart of projected vs actual
- **Income vs Expenses**: Bar chart of the breakdown

**Best Practices**:
- **Forecast at least 13 weeks ahead** (Harnish minimum)
- **Update projections monthly** based on actual trends
- **Alert yourself if cash will go negative** in the next 90 days
- **Maintain 3–6 months** of operating expenses in reserve

---

### 11. Financial Overview

**Purpose**: Business health at a glance — the Lean Finance dashboard.

#### Critical Metrics (The 20% That Matters)

**1. Net Operating Income (NOI)**
- **Formula**: Total Income − Operating Expenses
- **What it means**: Profit before financing and taxes
- **Target**: Positive and growing
- **Why it matters**: The primary profitability metric

**2. Operating Expense Ratio (OER)**
- **Formula**: (Total Expenses / Total Income) × 100
- **What it means**: What % of income goes to expenses
- **Target**: ≤ 50% (IREM standard)
- **Actions**:
  - > 50% = review expenses, find waste
  - < 40% = excellent efficiency

**3. Rent Collection Rate**
- **Formula**: (Paid tenants / Total tenants) × 100
- **Target**: 95%+ (Griswold standard)
- **Why it matters**: Cash-flow health
- **Actions**:
  - < 95% = send reminders, follow up on overdue accounts
  - < 90% = review your tenant screening process

**4. Vacancy Rate**
- **Formula**: (Vacant units / Total units) × 100
- **Target**: < 5% (IREM standard)
- **Why it matters**: Lost revenue opportunity
- **Actions**:
  - > 5% = marketing push, review pricing
  - > 10% = investigate property-level issues

#### Property Box Scores

A **Lean Finance one-page view** for each property:
- Income breakdown (Rent, Other)
- Expense breakdown (Maintenance, Operating, Tax/Insurance, Management)
- NOI per property
- OER per property
- Occupancy rate

**Use this to**:
- Compare property performance
- Identify underperformers
- Make informed decisions on pricing, maintenance, and marketing

#### Charts

- **NOI by Property**: Bar chart comparing profitability
- **Expense Breakdown**: Pie chart showing where money goes

**Best Practices**:
- Review **weekly** in huddles
- Investigate any **red indicator** immediately
- Use for **monthly owner reports**
- Track trends over time to spot issues early

---

### 12. Chart of Accounts

**Purpose**: IFRS-compliant account structure for proper bookkeeping.

#### Pre-Configured Structure

The system ships with an **ICPAU-aligned** Chart of Accounts:

**Assets (1000s)**
| No. | Account |
|---|---|
| 1000 | Cash at Bank |
| 1100 | Accounts Receivable |
| 1500 | Security Deposits Held |
| 1600 | Property, Plant & Equipment |

**Liabilities (2000s)**
| No. | Account |
|---|---|
| 2000 | Accounts Payable |
| 2100 | Security Deposits Payable |
| 2200 | Accrued Expenses |

**Equity (3000s)**
| No. | Account |
|---|---|
| 3000 | Owner's Equity |
| 3100 | Retained Earnings |

**Income (4000s)**
| No. | Account |
|---|---|
| 4000 | Rental Income |
| 4100 | Late Payment Fees |
| 4200 | Other Income |

**Expenses (5000s)**
| No. | Account |
|---|---|
| 5000 | Maintenance & Repairs |
| 5100 | Utilities |
| 5200 | Property Tax |
| 5300 | Insurance |
| 5400 | Management Fees |
| 5500 | Operating Expenses |

#### Adding Custom Accounts

1. Click "+ Add Account"
2. Fill in the details:
   - **Number**: Follow the numbering scheme (e.g., 1000.01 for a sub-account)
   - **Name**: Clear description
   - **Category**: Asset, Liability, Equity, Income, or Expense
   - **Type**: Specific type (e.g., "Current Asset")
   - **Description**: Purpose and usage
3. Click "Save Account"

**Best Practices**:
- **Don't modify default accounts** unless necessary
- Use **sub-accounts** for detail (1000.01, 1000.02)
- Keep the structure **simple** — only add accounts you actually use
- Follow **IFRS numbering** conventions
- **[Accountant]** Consult your CPA before major changes

---

### 13. General Ledger

**Purpose**: The complete audit trail of all transactions — the foundation of double-entry bookkeeping.

#### Understanding the Ledger

Every financial transaction creates **two entries**:
- **Debit** (left side): Increases Assets/Expenses; decreases Liabilities/Income/Equity
- **Credit** (right side): Decreases Assets/Expenses; increases Liabilities/Income/Equity

**Example — tenant pays rent (UGX 500,000)**:
- **Debit**: Cash at Bank (1000) +500,000 → Asset increases
- **Credit**: Rental Income (4000) +500,000 → Income increases
- **Result**: Debits = Credits (balanced)

#### Viewing Transactions

**Filters**:
- **Account**: All entries for a specific account
- **Property**: Filter by property
- **Date Range**: Focus on a specific period

**The table shows**: Date · Account (number and name) · Description · Property · Debit · Credit

**Totals**:
- Sum of all debits
- Sum of all credits
- **These MUST balance** — if they don't, an error exists

#### Automatic Entries

The system creates GL entries automatically when you:
- **Record a rent payment** → Debit: Cash, Credit: Rental Income
- **Pay for maintenance** → Debit: Maintenance Expense, Credit: Cash
- **Collect a late fee** → Debit: Cash, Credit: Late Fee Income

#### Manual Entries

For transactions the forms don't cover (e.g., security deposit refunds, opening balances, corrections), your accountant creates manual journal entries.

**Best Practices**:
- **Review monthly** for accuracy
- **Verify debits = credits** always
- **Use for tax prep** (URA compliance)
- **Keep for audit trail** (ICPAU requirement)
- **Export for accountant** review

---

## Best Practices

### Daily Routine (30 minutes)

**Morning (15 min)**
1. Check the Dashboard — review overdue payments
2. Hold the Daily Huddle (5–10 min with the team)
3. Record any payments received

**Evening (15 min)**
1. Log any maintenance requests received
2. Update Rock progress if applicable
3. Set tomorrow's priorities

### Weekly Routine (2 hours)

**Monday morning (60–90 min)**
1. Weekly Huddle — review Rocks, KPIs, Critical Numbers
2. Send rent reminders to overdue tenants
3. Review cashflow for the coming week

**Friday afternoon (30 min)**
1. Update all KPIs with the week's data
2. Review maintenance requests — assign any pending
3. Check the Financial Overview for the week's performance

### Monthly Routine (half day)

**First week of the month**
1. Review the previous month's financial performance
2. Compare cashflow actual vs projected
3. Update cashflow projections if needed
4. Generate owner reports (Financial Overview)
5. Review and update Critical Numbers
6. Plan focus areas for the month

**Last week of the month**
1. Send next month's rent reminders
2. Review lease renewals coming due in the next 60 days
3. Schedule preventive maintenance

### Quarterly Routine (full day)

**Start of quarter**
1. Review the previous quarter's Rocks — celebrate completions
2. Update the OPSP (especially quarterly objectives)
3. Set new Rocks (3–5 max)
4. Review and adjust annual initiatives if needed
5. Update KPI targets if appropriate
6. Strategic planning session with the team

**End of quarter**
1. Full-quarter financial review
2. Update the 3-year picture in the OPSP if needed
3. Vendor performance review — update ratings
4. Property portfolio analysis — identify improvements

---

## Compliance & Reporting

> **⚠️ Important:** Tax rules in Uganda change frequently (most recently via the Tax Amendment Acts 2026, effective 1 July 2026). The summaries below are for orientation only and were accurate as of **August 2026**. Always confirm your filing position with your CPA and current URA guidance before filing.[^1^][^2^]

### Uganda Revenue Authority (URA) Compliance

#### Rental Income Tax

The rate depends on **who owns the property — not whether it is residential or commercial**:

**Individual landlords (resident individuals)**:[^1^][^3^]
- **12%** of **gross annual rental income above UGX 2,820,000**
- The first UGX 2,820,000 of annual rental income is tax-free
- **No expense deductions are allowed** — the 12% applies to gross rent above the threshold, regardless of actual costs
- Rental tax is assessed **separately** from the individual's employment or business income
- **New from FY 2026/27**: individuals may opt to file **monthly provisional rental income tax returns** instead of one annual return — useful for spreading cash-flow impact[^2^]

**Company landlords**:[^3^][^4^]
- **30%** corporation tax rate on chargeable rental income
- Expense deductions are allowed but **capped at 50% of gross rental income** — if actual expenses exceed 50% of rent, only 50% is deductible
- Dividends paid out of after-tax profits attract a further 15% withholding tax

**How to report using Altus**:
1. Navigate to the General Ledger
2. Filter by Account 4000 (Rental Income)
3. Set the date range to the tax period (Uganda's tax year ends 30 June)
4. Export or print for your accountant
5. Your accountant files with URA

#### Value Added Tax (VAT)

- Registration is required once taxable turnover exceeds **UGX 300 million** in a 12-month period (threshold raised from UGX 150M, effective **1 July 2026**)[^2^]
- Residential rent is generally exempt from VAT; commercial rent may be taxable once registered
- **[Accountant]** Confirm your VAT position with your tax advisor

#### Record-Keeping Requirements

**URA expects**:
- Complete transaction records (✅ General Ledger)
- Tenant lease agreements (keep signed physical/digital copies)
- Payment receipts (✅ Tenant payment history)
- Expense invoices (keep physical/digital copies)
- Bank and Mobile Money statements (reconcile against the system)

**Retention period**: Minimum **5 years** under the Tax Procedure Code Act; keeping 6+ years is prudent.

### ICPAU / CPA Uganda Compliance

#### Financial Reporting Standards

The system follows **IFRS** (International Financial Reporting Standards):

- **IAS 40 (Investment Property)**: Properties held for rental income. The system tracks acquisition date and value; **[Accountant]** confirm fair value model vs cost model with your CPA.
- **IFRS 16 (Leases)**: Lease liability calculations. The system tracks lease start/end dates; **[Accountant]** confirm balance-sheet recognition.
- **IAS 16 (Property, Plant & Equipment)**: Capital vs operating expenditure. Maintenance expenses are tracked in GL account 5000; **[Accountant]** confirm capitalization thresholds.

#### Double-Entry Bookkeeping

✅ **The system enforces**:
- Every transaction has a debit and a credit
- Debits always equal credits
- Complete audit trail
- Account classification (Asset, Liability, Equity, Income, Expense)

### Data Protection (Tenants' Personal Data)

Tenant records — names, phone numbers, payment histories — are **personal data** under Uganda's **Data Protection and Privacy Act, 2019**. Practical obligations:

- Collect only the tenant data you actually need
- Use it only for managing the tenancy (e.g., rent reminders), not unrelated purposes
- Keep it accurate and up to date
- Restrict access to people who need it for their work
- **[Admin]** The current version stores data in the browser's localStorage, which is **not encrypted** — do not use shared computers, and plan the move to the database backend (see Appendix B) before scaling

### Monthly Reporting

#### For Property Owners

**Generate the monthly report** (~30 minutes):

1. **Financial Overview**: Screenshot or print the Box Score for each property — NOI, OER, income/expenses
2. **Rent Roll**: From Tenants, export or print the tenant list — occupancy, payment status, rent amounts
3. **Maintenance Summary**: From Maintenance, filter by property and date range — requests completed, costs, response times
4. **Cashflow**: Current month actual vs projected, plus the next 3 months' forecast

**Send to the owner**: Combine into a single email or PDF.

#### For Internal Management

**Monthly dashboard review**:
- Financial Overview metrics (NOI, OER, Collection Rate, Vacancy)
- KPI status (all should be GREEN or YELLOW)
- Critical Numbers trend (improving or declining?)
- Rocks progress (on track for the quarter?)

---

## Troubleshooting

### Common Issues

#### "Debits and Credits Don't Balance"

**Cause**: Manual entry error or system issue
**Solution**:
1. Navigate to the General Ledger
2. Check the totals at the bottom of the table
3. If unbalanced, contact the system administrator
4. **Do not proceed with financial reporting until resolved**

#### "Rent Reminders Not Sending"

**Cause**: SMS gateway not configured or out of credits
**Solution**:
1. **[Admin]** Verify the SMS provider's API key is set in the messaging configuration
2. **[Admin]** Verify SMS credits are available with the provider
3. In the meantime, send reminders manually by phone

#### "Can't See a Recent Payment in Reports"

**Cause**: Page not refreshed after payment entry
**Solution**:
1. Refresh the browser (F5 or Ctrl+R)
2. The system calculates in real time from the General Ledger
3. If still missing after a refresh, verify the payment was actually saved

#### "Occupancy Rate Is Incorrect"

**Cause**: The property's "Occupied Units" count is out of sync with tenant records (e.g., after a move-out)
**Solution**:
1. Navigate to Properties
2. Edit the property
3. Update "Occupied Units" to match current tenants
4. The rate recalculates from this number

#### "Can't Find a Deleted Item"

**Cause**: Deletion is permanent (no trash/recycle bin)
**Solution**:
- **Prevention**: The system confirms before deleting — read the prompt carefully
- **Recovery**: Not possible in the localStorage version
- **[Admin]** For production: implement database backups (nightly recommended)

### Data Backup

**Current system (localStorage)**:
- Data is stored in the browser's localStorage
- **Risk**: Clearing the browser or reinstalling = **data loss**
- **Mitigation**: Regular manual backups

**Manual backup process**:
1. Open browser Developer Tools (F12)
2. Application tab → Local Storage
3. Copy all data
4. Save to a text file (weekly minimum), stored somewhere safe

**[Admin] Production recommendation**:
- Migrate to a database backend (PostgreSQL)
- Implement automated nightly backups
- Keep at least 30 days of backups

### Performance Issues

#### "System Running Slow"
1. Close other browser tabs
2. Clear the browser cache (Ctrl+Shift+Delete)
3. Check your internet connection
4. Restart the browser

#### "Charts Not Displaying"
1. Refresh the page
2. Check that data exists for the chart
3. Try a different browser
4. Clear the cache and reload

### Getting Help

| Issue type | Who to contact |
|---|---|
| Technical (database, backups, access, SMS, performance) | System administrator |
| Tax compliance, reporting standards, IFRS/ICPAU, chart of accounts | Your accountant / CPA |
| Best practices, process optimization, tenant relations | Property management consultant |

---

## Glossary

### Property Management Terms

- **Gross Rental Income**: Total rent collected before expenses
- **Net Operating Income (NOI)**: Income after operating expenses, before financing and taxes
- **Operating Expense Ratio (OER)**: Percentage of income spent on operations
- **Occupancy Rate**: Percentage of units with paying tenants
- **Vacancy Rate**: Percentage of units without tenants
- **Rent Roll**: List of all tenants with rent amounts
- **Unit Turn**: Process of preparing a unit for a new tenant after move-out
- **Security Deposit**: Refundable deposit held against damage and unpaid rent
- **Lease**: Legal agreement between landlord and tenant

### Scaling Up Terms (Verne Harnish)

- **OPSP**: One Page Strategic Plan — your entire strategy on one page
- **BHAG**: Big Hairy Audacious Goal — a 10–25 year vision
- **Rocks**: Top 3–5 quarterly priorities (from Stephen Covey's "big rocks" metaphor)
- **KPI**: Key Performance Indicator — a measurable metric
- **Critical Number**: The 3–5 metrics that predict business success
- **Huddle**: Short, regular meeting to maintain alignment
  - **Daily Huddle**: 5–15 minutes, tactical
  - **Weekly Huddle**: 60–90 minutes, strategic
- **Rhythm**: Regular cadence of meetings and reporting

### Accounting & Tax Terms

- **IFRS**: International Financial Reporting Standards
- **ICPAU**: Institute of Certified Public Accountants of Uganda
- **CPA Uganda**: Certified Public Accountant (Uganda)
- **URA**: Uganda Revenue Authority (tax authority)
- **TIN**: Taxpayer Identification Number — required for URA filings
- **Double-Entry Bookkeeping**: Every transaction has a debit and a credit
- **General Ledger (GL)**: Complete record of all financial transactions
- **Chart of Accounts**: List of all accounts used in bookkeeping
- **Debit**: Left-side entry (increases Assets/Expenses)
- **Credit**: Right-side entry (increases Liabilities/Income/Equity)
- **Trial Balance**: Report verifying debits = credits
- **Accrual Accounting**: Record revenue when earned, expenses when incurred
- **Cash Basis**: Record revenue when received, expenses when paid

### Financial Ratios

- **NOI**: Net Operating Income = Income − Operating Expenses
- **OER**: Operating Expense Ratio = (Expenses / Income) × 100
- **ROI**: Return on Investment = (Gain − Cost) / Cost × 100
- **Cap Rate**: Capitalization Rate = NOI / Property Value
- **Debt Service Coverage Ratio**: NOI / Debt Payments

### Lean Finance Terms

- **Lean**: Eliminate waste, focus on value
- **Value Stream**: Flow of value to the customer (tenant)
- **80/20 Principle (Pareto)**: 80% of results come from 20% of efforts
- **Box Score**: One-page financial summary per property
- **Visual Management**: Make metrics visible to all

---

## Quick Reference Guide

### Critical Daily Tasks
- [ ] Check Dashboard for overdue payments
- [ ] Hold Daily Huddle (5–10 min)
- [ ] Record any rent payments received
- [ ] Log any maintenance requests

### Weekly Must-Do's
- [ ] Hold Weekly Huddle (review Rocks/KPIs)
- [ ] Send rent reminders to overdue tenants
- [ ] Update Rock progress
- [ ] Review and update KPIs
- [ ] Assign pending maintenance requests

### Monthly Checklist
- [ ] Review previous month's financials
- [ ] Compare cashflow actual vs projected
- [ ] Generate owner reports
- [ ] Update Critical Numbers
- [ ] Review maintenance costs
- [ ] Send next month's rent reminders
- [ ] Check leases expiring in the next 60 days

### Quarterly Priorities
- [ ] Review previous quarter's Rocks
- [ ] Update OPSP (quarterly objectives)
- [ ] Set new Rocks (3–5 max)
- [ ] Full financial review
- [ ] Vendor performance review
- [ ] Portfolio analysis meeting

### Annual / Tax-Year Checklist (Uganda tax year ends 30 June)
- [ ] Export full-year GL for your accountant
- [ ] File rental income tax with URA (or set up monthly provisional filing)
- [ ] Confirm VAT registration status against the UGX 300M threshold
- [ ] Verify records retention (minimum 5 years)
- [ ] Review insurance cover on all properties

---

## Support & Updates

### System Version
- Current Version: 1.1
- Manual last updated: August 2026
- Next manual review: November 2026

### Contact Information
- **Technical Support**: [Your IT Contact]
- **Accounting Support**: [Your CPA Contact]
- **Management Training**: [Your Consultant Contact]

> **Action required:** Replace the bracketed placeholders above with real contacts before distributing this manual.

### Training Resources
- *Scaling Up* by Verne Harnish (book)
- *Property Management for Dummies* by Robert Griswold (book)
- *The 80/20 Principle* by Richard Koch (book)
- **IREM** — Institute of Real Estate Management (irem.org)
- **ICPAU** — Institute of CPAs Uganda (icpau.co.ug)
- **URA** — Uganda Revenue Authority (ura.go.ug)

---

## Appendices

### Appendix A: Keyboard Shortcuts (Planned)

Not yet implemented in v1.1 — target for a future release:

- **Ctrl+N**: New item (context-aware)
- **Ctrl+S**: Save current form
- **Ctrl+F**: Search/Filter
- **Esc**: Close modal/dialog
- **Tab**: Navigate form fields
- **Enter**: Submit form

### Appendix B: Known Limitations & Roadmap (for Administrators)

Current limitations of v1.1:
- **Browser-based storage (localStorage)**: single-computer, single-browser; unencrypted; lost if the browser profile is cleared
- **No user accounts or roles**: anyone with access to the browser can see all data
- **No automated backups**: manual export only (see Troubleshooting → Data Backup)
- **Deletion is permanent**: no undo or recycle bin

Recommended roadmap:
1. Migrate to a database backend (PostgreSQL) with user authentication and role-based access
2. Automated nightly backups (30-day retention minimum)
3. Soft-delete / audit log for all record changes
4. Encrypted storage for tenant personal data (Data Protection and Privacy Act alignment)

---

**Document Version**: 1.1
**Last Updated**: August 2026
**Changes in v1.1**: Corrected URA rental income tax section (individual vs company treatment, UGX 2,820,000 threshold, monthly provisional filing option from FY 2026/27); updated VAT registration threshold to UGX 300M (effective 1 July 2026); added lease lifecycle workflows (renewals, move-outs, deposits, unit turn); added data protection guidance; separated administrator and accountant notes from end-user content; added annual tax-year checklist.

---

*For questions, suggestions, or support, contact your system administrator.*

[^1^]: PwC Tax Summaries — Uganda, Individual, Taxes on personal income: https://taxsummaries.pwc.com/uganda/individual/taxes-on-personal-income
[^2^]: EY Global Tax Alert — Uganda issues Tax Amendment Acts for 2026 (monthly provisional rental tax filing; VAT threshold UGX 300M): https://globaltaxnews.ey.com/news/2026-1253-uganda-issues-tax-amendment-acts-for-2026 (see also KPMG: https://kpmg.com/us/en/taxnewsflash/news/2026/06/uganda-tax-amendments-2026-2027-budget.html)
[^3^]: PwC Uganda (via Daily Monitor, Oct 2025) — rental tax rules effective from 1 July 2022: https://www.monitor.co.ug/uganda/business/prosper/rental-income-tax-will-drive-up-housing-costs-5237570
[^4^]: EY Uganda — CPA Prosper Ahabwe, "How rental income tax may hurt real estate investment": https://kakandealex.substack.com/p/how-rental-income-tax-may-hurt-real
