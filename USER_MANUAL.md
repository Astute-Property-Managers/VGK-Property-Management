# Altus — User Manual

**Version 1.2**
**Property Management System for Uganda**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard Overview](#dashboard-overview)
4. [Strategic Planning Module](#strategic-planning-module)
5. [Property Operations Module](#property-operations-module)
6. [Financial Management Module](#financial-management-module)
7. [Analytics Module](#analytics-module)
8. [Best Practices](#best-practices)
9. [Compliance & Reporting](#compliance--reporting)
10. [Troubleshooting](#troubleshooting)
11. [Glossary](#glossary)
12. [Quick Reference Guide](#quick-reference-guide)
13. [Support & Updates](#support--updates)
14. [Appendices](#appendices)

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
- **[Admin]** Server: Node.js ≥ 22.5 (Node 24 LTS recommended) for the backend API and SQLite database

### How to Read This Manual

Sections are organized by module, in the order they appear in the sidebar. Items marked **[Admin]** are for the system administrator, not day-to-day users. Items marked **[Accountant]** should be confirmed with your CPA before acting.

### Development vs Production Mode

Altus runs in two modes:

| | Development | Production |
|---|---|---|
| Where data lives | Browser localStorage | Server database (SQLite) via the API |
| Sign-in required | No | Yes (username + password) |
| Multi-user roles | No | Yes (see Roles below) |
| Audit trail of actions | No | Yes |
| Archive / restore records | No | Yes |
| Typical use | Demo, training, single-user trial | Live operations |

The screens work the same in both modes — this manual describes the screens once and flags mode-specific behavior where it matters.

---

## Getting Started

### Signing In (Production)

1. Open the application URL in your browser
2. Enter your username and password
3. You stay signed in for up to 8 hours; sign out when leaving a shared computer
4. After 5 failed sign-in attempts, the account locks for 15 minutes

**Roles** (assigned by your administrator):

| Role | What you can do |
|---|---|
| **Admin** | Everything: manage records, archive/restore, permanently delete, manage settings, view audit log |
| **Manager** | Day-to-day operations plus archive/restore; cannot permanently delete |
| **Operator** | Day-to-day data entry: create and update records; cannot archive or delete |
| **Auditor** | Read-only access to all records plus the audit log |

**[Admin]** New deployments start with one admin account (credentials from environment configuration). Change the bootstrap password immediately, and create a separate account per person — shared accounts defeat the audit trail.

### First-Time Setup

1. **Access the System** — open your browser, navigate to the application URL (sign in, in production)
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

> **See also:** Module 18 (80/20 Analytics) lets you mark up to 5 KPIs as your "Vital Few" for daily focus.

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
   - **Acquisition Date**: When property was acquired
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

> **Before you add a tenant:** run them through **Tenant Screening** (Module 8) and complete a **Move-In Inspection** (Module 10) on handover day. Tenants who skip screening are where collection problems come from.

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

#### The Tenant Lifecycle (Which Screen Does What)

| Stage | Screen | Module |
|---|---|---|
| Applicant applies and is vetted | Tenant Screening | 8 |
| Lease signed, tenant added | Tenants | 7 |
| Unit condition documented at handover | Move-In Inspection | 10 |
| Rent collected monthly | Tenants (💰 Pay) | 7 |
| Lease ending — renewal pipeline | Lease Renewals | 9 |
| Tenant leaves — inspection + deposit refund | Move-Out Inspection | 10 |
| Repairs before re-letting | Maintenance | 11 |

**Best Practices**:
- **Record payments daily** — don't let them pile up
- **Send reminders on Day 3** of overdue status
- **Follow up personally** after Day 7 overdue
- **Target: 95%+ collection rate** (Griswold standard)

---

### 8. Tenant Screening

**Purpose**: Vet applicants *before* they become tenants — the Griswold standard application workflow. Good screening is the cheapest rent-collection tool you have.

#### Creating an Application

1. Click "+ New Application"
2. **Basic Information**: Applicant name (required), email, phone, property (required), unit number
3. **Employment Verification**: Current employer, job title, monthly income (UGX); tick **Employment Verified** once confirmed with the employer
4. **Credit & Background**: Credit score (if available) and background check status (Pending / Clear / Issues Found)
5. **Rental History**: Previous landlord and contact; tick **Rental History Verified** after speaking to them; flag **Eviction History** if any
6. **References**: Add references (name, relationship, contact); tick **Verified** for each one actually checked
7. Click "Submit Application"

#### The Completion Score

Each application shows a completion percentage — 25% each for:
- Employment verified
- Rental history verified
- Credit score on file
- At least 2 verified references

**Do not approve an application below 100%.** An incomplete file means an unvetted tenant.

#### Reviewing and Deciding

1. Click "Review" on an application
2. Work through the sections, add **Review Notes** (concerns, recommendations)
3. Set status:
   - **In Progress** → still collecting information
   - **Pending Review** → file complete, awaiting decision
   - **Approved** → proceed to lease signing, then add them in Tenants (Module 7)
   - **Rejected** → a **Denial Reason is required** (keep it factual and professional)

**Stats at the top** show your pipeline: In Progress / Pending Review / Approved / Rejected.

**Best Practices**:
- Verify identity against a national ID before anything else
- Rent should not exceed roughly one-third of verified monthly income
- Always call the previous landlord — the current one may give a glowing reference to get rid of a problem tenant
- Keep screening records: they are your defense if a decision is ever questioned

---

### 9. Lease Renewals

**Purpose**: Never be surprised by an expiring lease. Implements Griswold's **120-day standard**: start the renewal conversation four months before lease end.

#### How the Pipeline Works

1. Click **"🔄 Scan for Upcoming Renewals"** — the system finds every tenant whose lease ends within 120 days and adds them to the pipeline (already-tracked tenants are skipped)
2. Each renewal moves through statuses:
   - **Upcoming** → detected, no action yet
   - **Notice Sent** → renewal notice sent (click "Send Notice" — logged automatically)
   - **Negotiating** → tenant responded, terms under discussion
   - **Accepted** → renewal agreed; update the tenant's lease end date (and rent) in Module 7
   - **Declined** → tenant leaving; schedule a Move-Out Inspection (Module 10)
   - **Expired** → lease lapsed without resolution (treat as urgent)

**Days Left** is color-coded: red < 30, orange < 60, yellow < 90 days.

#### Managing a Renewal

Click "Manage" on any renewal:

1. **Renewal Proposal**
   - **Proposed Rent (UGX)**: the system instantly shows the increase, e.g. `+50,000 UGX (10.0%)`
   - **Proposed Lease Term**: months (default 12)
2. **Status & Response**: track the tenant's response (Interested / Negotiating / Declined) and tick **Owner Approval Received** when the property owner signs off on the new terms
3. **Communication Log**: record every touchpoint — Email, Call, In-Person, or SMS — with a summary and who made contact. This log is your evidence if a dispute arises about who was told what, when.
4. **Notes**: anything else worth remembering

**Best Practices**:
- Run the scan **monthly** (it's in the Monthly Checklist)
- Send notices at the 120-day mark, not the 30-day mark — early notice gives you time to re-let without vacancy
- Justify every rent increase with market comparison and property improvements; document the reasoning in Notes
- If a good tenant hesitates at an increase, a smaller increase usually beats a vacant unit

---

### 10. Move-In / Move-Out Inspections

**Purpose**: Document unit condition at both ends of a tenancy. This is what makes security-deposit deductions defensible instead of argumentative.

#### Move-In Inspection (on handover day)

1. Click "+ New Move-In"
2. Select tenant and property (required), unit number, and **Inspected By** (required)
3. Work through the **checklist** — pre-loaded with the standard 12 items (Living Room, Kitchen, Bathroom, Bedroom: walls, floors, windows, cabinets, appliances, plumbing, toilet, shower, sink, closet)
   - Rate each: Excellent / Good / Fair / Poor / Damaged
   - Add notes per item; add custom items for anything unusual
4. **Security Deposit**: enter the amount and tick **Deposit Received**
5. Save — then have the tenant sign a printed copy

> Do this **with the tenant present**, on the day they get the keys, before their furniture goes in. Photos of every room, stored with the lease file, settle 95% of later deposit disputes.

#### Move-Out Inspection (when the tenant leaves)

1. Click "+ New Move-Out"
2. Same checklist, plus per-item **Repair Required** and **Estimated Repair Cost**
3. **Deposit Deductions**: add each deduction with a category:
   - Cleaning
   - Repairs
   - Unpaid Rent
   - Other
4. The **Deposit Calculation** panel computes automatically:
   - Security Deposit Held − Total Deductions = **Refund to Tenant**
5. Record unpaid rent, utilities, or other charges separately
6. Save; refund the balance promptly

**The dashboard cards** show totals: move-ins, move-outs, deposits currently held, and deposits returned.

#### Booking the Refund

**[Accountant]** The refund is a manual GL entry (Module 17): Debit **Security Deposits Payable (2100)**, Credit **Cash (1000)** for the refund amount; any deductions kept for repairs are recognized against the relevant expense or income account per your CPA.

After move-out, update the property's **Occupied Units** count (Module 6) and raise Maintenance requests for repairs (Module 11).

**Best Practices**:
- Same inspector for move-in and move-out where possible, using the same checklist
- Deduct only for damage beyond normal wear and tear — and price deductions from actual vendor quotes
- Refund within the timeframe stated in the lease; delays sour your reputation and invite disputes

---

### 11. Maintenance Requests

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

> Completed maintenance with costs flows into **Owner Statements** (Module 15) and the **80/20 Analytics** (Module 18) automatically — accurate cost entry here pays off twice.

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

### 12. Vendors

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

### 13. Cashflow Forecast

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

### 14. Financial Overview

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
  - < 90% = review your tenant screening process (Module 8)

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
- Use for **monthly owner reports** (or generate full statements — Module 15)
- Track trends over time to spot issues early

---

### 15. Owner Statements

**Purpose**: One-click monthly financial statements per property — the document you send each property owner. Replaces the manual screenshot-and-stitch reporting routine.

#### Generating a Statement

1. Select the **Property** and the **Period** (month, e.g. 2026-07)
2. Click **Generate Statement**

The system assembles the statement automatically:

| Section | Where the data comes from |
|---|---|
| **Rent Roll** | Every tenant of the property: rent due, amount received, Paid / Partial / Unpaid status, and the month's **collection rate** |
| **Maintenance Summary** | Maintenance requests **completed within the month**, with vendor and actual cost |
| **Expense Ledger** | General Ledger expense entries (5000-series accounts) for the property in the month |
| **Management Fee** | Calculated at **10% of rent received** |
| **Net Owner Disbursement** | Gross income − expenses − maintenance − management fee |
| **Variance Analysis** | This month's net income vs last month's (requires the previous month's statement to exist) |

#### Reviewing and Sending

1. Click "View Details" on the statement
2. Check the summary cards: Gross Income, Total Deductions, Net Disbursement, Collection Rate
3. Add **Manager Commentary** — two or three sentences on notable events (a big repair, a new tenant, a vacancy) and your recommendation. Owners read this first.
4. Send to the owner

> **Note:** The "📄 Export PDF" button is a **planned feature** — for now, print the statement view to PDF from your browser (Ctrl+P → Save as PDF) and attach that to your email.

**Best Practices**:
- Generate statements in the **first week of the month** for the month just ended (it's in the Monthly Checklist)
- Reconcile the statement against the General Ledger before sending — the statement is only as good as your payment recording discipline
- A collection rate below 95% on any statement deserves an explanation in the commentary
- Keep every statement: they form the owner's annual record for their own tax affairs

---

### 16. Chart of Accounts

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

### 17. General Ledger

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

For transactions the forms don't cover (e.g., security deposit refunds — see Module 10, opening balances, corrections), your accountant creates manual journal entries.

**Best Practices**:
- **Review monthly** for accuracy
- **Verify debits = credits** always
- **Use for tax prep** (URA compliance)
- **Keep for audit trail** (ICPAU requirement)
- **Export for accountant** review

---

## Analytics Module

### 18. 80/20 Analytics Engine

**Purpose**: Apply Koch's Pareto Principle to your portfolio — find the vital few tenants, properties, and KPIs that drive (or threaten) 80% of your results. No data entry needed: everything is computed from the records you already keep.

#### Tab 1: Tenant 80/20 Analysis

- **Top-line stats**: Total tenants, how many are in the top 20%, what share of revenue that 20% generates, and the count of high-risk tenants
- **Pareto chart**: Top 10 tenants by total rent paid
- **Top 20% Revenue Contributors**: ranked table — revenue, net contribution (revenue minus their maintenance costs), on-time payment %, and risk level. **These tenants pay the bills — treat them accordingly** (priority maintenance, personal renewal conversations)
- **🚨 High-Risk Tenants**: the riskiest 20%, ranked by a 0–100 **risk score** built from payment status, on-time rate, and maintenance frequency, mapped to **eviction risk** (Low / Medium / High). Work this list weekly: reminders, payment plans, or — for chronic cases — non-renewal at lease end (Module 9)

#### Tab 2: Property 80/20 Analysis

- **Pareto chart**: Income vs NOI per property
- **Performance Rankings**: every property with Income, NOI, OER, Net Yield, Occupancy, and income rank — top-20% properties are starred ⭐
- **🐄 Cash Cows vs ⚠️ Underperformers**: your best and bottom 20% by NOI side by side
- **Use it for portfolio decisions**: an underperformer with high OER and low occupancy for several quarters is a candidate for repricing, renovation, or disposal

#### Tab 3: Vital Few KPIs

- Select up to **5 KPIs** (from Module 3) as your **Vital Few**
- They pin to the top with achievement bars; everything else stays in "Trivial Many"
- **Use it in daily huddles**: glance at the Vital Few; only dig into the rest weekly

**Best Practices**:
- Review Tenant 80/20 **weekly** (who pays us, who might leave, who might need to go)
- Review Property 80/20 **monthly** (where to invest, where to fix, what to exit)
- Keep Vital Few to 5 — the whole point is focus

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
4. Check 80/20 Analytics → high-risk tenants list

**Friday afternoon (30 min)**
1. Update all KPIs with the week's data
2. Review maintenance requests — assign any pending
3. Check the Financial Overview for the week's performance
4. Review new screening applications — keep the pipeline moving

### Monthly Routine (half day)

**First week of the month**
1. Review the previous month's financial performance
2. Compare cashflow actual vs projected
3. Update cashflow projections if needed
4. **Generate Owner Statements** (Module 15) and send them
5. Review and update Critical Numbers
6. Plan focus areas for the month

**Last week of the month**
1. Send next month's rent reminders
2. **Run "Scan for Upcoming Renewals"** (Module 9) — leases expire whether you watch or not
3. Schedule preventive maintenance
4. Review Property 80/20 rankings

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
4. Property portfolio analysis (80/20 Analytics) — identify improvements

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

Tenant records — names, phone numbers, screening files, payment histories — are **personal data** under Uganda's **Data Protection and Privacy Act, 2019**. Practical obligations:

- Collect only the tenant data you actually need
- Use it only for managing the tenancy (e.g., rent reminders), not unrelated purposes
- Keep it accurate and up to date
- Restrict access: in production, give each staff member their own account with the **lowest role** that lets them do their job; the auditor role exists for read-only review
- Screening files are especially sensitive — reject decisions must record a factual **Denial Reason**, never speculation
- **[Admin]** Neither the browser localStorage (development) nor the SQLite file (production) is encrypted at rest. Protect the server machine itself: full-disk encryption, locked screen, OS updates, and restricted physical access.

### Monthly Reporting

#### For Property Owners

Use **Owner Statements (Module 15)** — generate one per property, add commentary, print to PDF, send. Done in minutes instead of the old screenshot routine.

#### For Internal Management

**Monthly dashboard review**:
- Financial Overview metrics (NOI, OER, Collection Rate, Vacancy)
- KPI status (all should be GREEN or YELLOW)
- Critical Numbers trend (improving or declining?)
- Rocks progress (on track for the quarter?)
- 80/20 Analytics: high-risk tenants, underperforming properties

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

#### "Can't Sign In" / "Locked Out"

- 5 failed attempts lock the account for **15 minutes** — wait, then try again carefully
- If you forgot the password, ask your administrator to reset it
- **[Admin]** Accounts can be deactivated; a deactivated account is signed out everywhere immediately, even mid-session

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

#### "Something Was Deleted by Mistake"

- **Production mode**: use **Archive** instead of Delete wherever possible — archived records can be **restored** (managers and admins). Permanent delete is admin-only and cannot be undone, but the action is recorded in the **audit log** (who, what, when).
- **Development mode**: deletion is permanent and there is no audit log — be careful.

### Data Backup

**Production mode**:
- All data lives in the SQLite file at `backend/altus.db` on the server
- **[Admin]** Back it up by copying the file while the API is stopped (or use an online backup tool such as `sqlite3 .backup`); **nightly, with at least 30 days of retention**
- Keep one copy off the server (another machine or cloud storage)

**Development mode**:
- Data lives in the browser's localStorage — clearing the browser erases everything
- Manual backup: Developer Tools (F12) → Application → Local Storage → copy to a text file (weekly minimum)

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
| Technical (server, backups, accounts, SMS, performance) | System administrator |
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
- **Owner Statement**: Monthly per-property financial report sent to the property owner
- **Net Owner Disbursement**: What the owner actually receives after expenses and management fees

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
- **Net Yield**: NOI / Total Income × 100
- **Debt Service Coverage Ratio**: NOI / Debt Payments

### Lean Finance & 80/20 Terms

- **Lean**: Eliminate waste, focus on value
- **Value Stream**: Flow of value to the customer (tenant)
- **80/20 Principle (Pareto)**: 80% of results come from 20% of efforts
- **Vital Few**: The small number of KPIs/tenants/properties that drive most results
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
- [ ] Review 80/20 high-risk tenants list
- [ ] Progress screening applications in the pipeline

### Monthly Checklist
- [ ] Review previous month's financials
- [ ] Compare cashflow actual vs projected
- [ ] **Generate and send Owner Statements**
- [ ] Update Critical Numbers
- [ ] Review maintenance costs
- [ ] Send next month's rent reminders
- [ ] **Run "Scan for Upcoming Renewals"** (120-day pipeline)
- [ ] Review Property 80/20 rankings

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
- [ ] **[Admin]** Verify backup routine is running and test a restore

---

## Support & Updates

### System Version
- Current Version: 1.2
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

Not yet implemented — target for a future release:

- **Ctrl+N**: New item (context-aware)
- **Ctrl+S**: Save current form
- **Ctrl+F**: Search/Filter
- **Esc**: Close modal/dialog
- **Tab**: Navigate form fields
- **Enter**: Submit form

### Appendix B: Known Limitations & Roadmap (for Administrators)

Current limitations:
- **SQLite is single-server**: fine for one office/LAN; not designed for multiple simultaneous sites
- **No automated backups yet**: backup of `backend/altus.db` is a manual administrator task (nightly recommended)
- **Owner Statement PDF export**: placeholder — use the browser's Print → Save as PDF
- **Photo storage**: inspection photos must be kept outside the system alongside the lease file
- **No encryption at rest**: protect the server machine (disk encryption, physical access)

Recommended roadmap:
1. Automated nightly database backups (30-day retention minimum)
2. Native PDF export for Owner Statements
3. Photo upload attached to inspections and maintenance requests
4. Encryption at rest for the database (Data Protection and Privacy Act alignment)
5. PostgreSQL backend if multi-site or high-concurrency use emerges

---

**Document Version**: 1.2
**Last Updated**: August 2026
**Changes in v1.2**: Documented the production architecture — sign-in, roles (admin/manager/operator/auditor), audit log, archive/restore; added five modules: Tenant Screening, Lease Renewals (120-day pipeline), Move-In/Move-Out Inspections, Owner Statements, and the 80/20 Analytics Engine; updated backup and deletion guidance for the database backend; refreshed best-practice routines and checklists.
**Changes in v1.1**: Corrected URA rental income tax section (individual vs company treatment, UGX 2,820,000 threshold, monthly provisional filing option from FY 2026/27); updated VAT registration threshold to UGX 300M (effective 1 July 2026); added lease lifecycle workflows; added data protection guidance; separated administrator and accountant notes from end-user content; added annual tax-year checklist.

---

*For questions, suggestions, or support, contact your system administrator.*

[^1^]: PwC Tax Summaries — Uganda, Individual, Taxes on personal income: https://taxsummaries.pwc.com/uganda/individual/taxes-on-personal-income
[^2^]: EY Global Tax Alert — Uganda issues Tax Amendment Acts for 2026 (monthly provisional rental tax filing; VAT threshold UGX 300M): https://globaltaxnews.ey.com/news/2026-1253-uganda-issues-tax-amendment-acts-for-2026 (see also KPMG: https://kpmg.com/us/en/taxnewsflash/news/2026/06/uganda-tax-amendments-2026-2027-budget.html)
[^3^]: PwC Uganda (via Daily Monitor, Oct 2025) — rental tax rules effective from 1 July 2022: https://www.monitor.co.ug/uganda/business/prosper/rental-income-tax-will-drive-up-housing-costs-5237570
[^4^]: EY Uganda — CPA Prosper Ahabwe, "How rental income tax may hurt real estate investment": https://kakandealex.substack.com/p/how-rental-income-tax-may-hurt-real
