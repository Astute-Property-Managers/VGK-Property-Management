/**
 * Verne-Grisworld-Koch Property Command - Constants & Initial Data
 */

import type {
  OnePageStrategicPlan,
  Rock,
  KPI,
  CriticalNumber,
  Property,
  Tenant,
  MaintenanceRequest,
  Vendor,
  Account,
  GeneralLedgerEntry,
  CashflowForecast,
  CashflowEntry,
  AccountCategory,
} from './types';

export const APP_NAME = 'Verne-Grisworld-Koch';
export const APP_TAGLINE = 'Property Command - Strategic Excellence for Uganda';
export const STORAGE_PREFIX = 'vgk_';

// ============================================================================
// INITIAL ONE PAGE STRATEGIC PLAN
// ============================================================================

export const INITIAL_OPSP: OnePageStrategicPlan = {
  coreValues: [
    'Integrity in all dealings',
    'Excellence in service delivery',
    'Respect for tenants and owners',
    'Continuous improvement',
    'Community impact',
  ],
  purpose:
    'To provide world-class property management services that maximize value for owners while creating exceptional living experiences for tenants in Uganda.',
  bhag: 'Be the most trusted property management firm in East Africa, managing 10,000+ units by 2035.',
  threeYearPicture:
    'By 2027: Manage 1,500 residential units across Kampala, expand to 2 additional cities, implement fully automated financial reporting, achieve 98% tenant satisfaction.',
  annualTheme: 'Systems & Scale',
  annualInitiatives: [
    'Implement VGK Command platform across all properties',
    'Reduce vacancy rate to below 3%',
    'Achieve 95% on-time rent collection',
    'Establish preventative maintenance program',
  ],
  quarterlyTheme: 'Q1 2025: Foundation & Efficiency',
  quarterlyObjectives: [
    'Onboard all 250 current units to VGK Command',
    'Train all staff on Lean Finance principles',
    'Reduce maintenance response time to under 24 hours',
    'Complete IFRS compliance audit',
  ],
  lastUpdated: new Date().toISOString(),
};

// ============================================================================
// INITIAL ROCKS (Quarterly Priorities)
// ============================================================================

export const INITIAL_ROCKS: Rock[] = [
  {
    id: 'rock-1',
    title: 'Launch VGK Command Platform',
    description: 'Successfully deploy and train all staff on the new property management system',
    owner: 'Operations Manager',
    dueDate: '2025-03-31',
    status: 'YELLOW',
    progress: 65,
    category: 'Operational',
  },
  {
    id: 'rock-2',
    title: 'Reduce Vacancy Rate to 3%',
    description: 'Fill 15 vacant units through targeted marketing and competitive pricing',
    owner: 'Leasing Manager',
    dueDate: '2025-03-31',
    status: 'GREEN',
    progress: 80,
    category: 'Growth',
  },
  {
    id: 'rock-3',
    title: 'IFRS Compliance Certification',
    description: 'Complete external audit and achieve full IFRS/URA compliance',
    owner: 'Finance Manager',
    dueDate: '2025-03-31',
    status: 'YELLOW',
    progress: 55,
    category: 'Financial',
  },
];

// ============================================================================
// INITIAL KPIs
// ============================================================================

export const INITIAL_KPIS: KPI[] = [
  {
    id: 'kpi-1',
    name: 'Occupancy Rate',
    description: 'Percentage of units currently occupied',
    currentValue: 94.5,
    targetValue: 97.0,
    unit: '%',
    frequency: 'Weekly',
    status: 'YELLOW',
    trend: 'up',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'kpi-2',
    name: 'Rent Collection Rate',
    description: 'Percentage of rent collected by the 5th of each month',
    currentValue: 92.0,
    targetValue: 95.0,
    unit: '%',
    frequency: 'Monthly',
    status: 'YELLOW',
    trend: 'stable',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'kpi-3',
    name: 'Maintenance Response Time',
    description: 'Average hours from request to assignment',
    currentValue: 18,
    targetValue: 24,
    unit: 'hours',
    frequency: 'Weekly',
    status: 'GREEN',
    trend: 'down',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'kpi-4',
    name: 'Tenant Satisfaction Score',
    description: 'Net Promoter Score from quarterly surveys',
    currentValue: 78,
    targetValue: 85,
    unit: 'NPS',
    frequency: 'Quarterly',
    status: 'YELLOW',
    trend: 'up',
    lastUpdated: new Date().toISOString(),
  },
];

// ============================================================================
// INITIAL CRITICAL NUMBERS
// ============================================================================

export const INITIAL_CRITICAL_NUMBERS: CriticalNumber[] = [
  {
    id: 'cn-1',
    name: 'Net Operating Income (NOI)',
    description: 'Total rental income minus operating expenses',
    currentValue: 45000000,
    targetValue: 50000000,
    unit: 'UGX',
    status: 'YELLOW',
    category: 'Financial',
    history: [
      { date: '2024-11', value: 42000000 },
      { date: '2024-12', value: 44000000 },
      { date: '2025-01', value: 45000000 },
    ],
  },
  {
    id: 'cn-2',
    name: 'Operating Expense Ratio',
    description: 'Operating expenses as % of gross income',
    currentValue: 38,
    targetValue: 35,
    unit: '%',
    status: 'YELLOW',
    category: 'Financial',
    history: [
      { date: '2024-11', value: 40 },
      { date: '2024-12', value: 39 },
      { date: '2025-01', value: 38 },
    ],
  },
  {
    id: 'cn-3',
    name: 'Vacancy Loss',
    description: 'Monthly income lost due to vacant units',
    currentValue: 3500000,
    targetValue: 2000000,
    unit: 'UGX',
    status: 'YELLOW',
    category: 'Operational',
    history: [
      { date: '2024-11', value: 4200000 },
      { date: '2024-12', value: 3800000 },
      { date: '2025-01', value: 3500000 },
    ],
  },
];

// ============================================================================
// INITIAL PROPERTIES
// ============================================================================

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'Nakasero Heights',
    address: 'Plot 45, Nakasero Road, Kampala',
    type: 'Residential',
    totalUnits: 24,
    occupiedUnits: 22,
    vacancyRate: 8.33,
    owner: 'Kampala Properties Ltd',
    acquisitionDate: '2020-03-15',
    notes: 'Premium apartment complex with rooftop amenities',
    status: 'Active',
  },
  {
    id: 'prop-2',
    name: 'Kololo Gardens',
    address: 'Kololo Hill Drive, Kampala',
    type: 'Residential',
    totalUnits: 18,
    occupiedUnits: 18,
    vacancyRate: 0,
    owner: 'Kololo Investments',
    acquisitionDate: '2021-07-01',
    notes: 'Family-oriented complex with playground',
    status: 'Active',
  },
];

// ============================================================================
// INITIAL TENANTS
// ============================================================================

const today = new Date();
const lastMonth = new Date(today);
lastMonth.setMonth(lastMonth.getMonth() - 1);
const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Sarah Nakato',
    contact: '+256 700 123 456',
    propertyId: 'prop-1',
    unitNumber: 'A-101',
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2025-12-31',
    rentAmount: 2500000,
    securityDeposit: 5000000,
    paymentStatus: 'Paid',
    lastPaymentDate: today.toISOString().split('T')[0],
    nextPaymentDate: nextMonth.toISOString().split('T')[0],
    notes: 'Excellent tenant, always pays on time',
    paymentHistory: [
      {
        date: lastMonth.toISOString().split('T')[0],
        amount: 2500000,
        method: 'Mobile Money',
        referenceNumber: 'MM12345678',
        notes: 'December 2024 rent',
        recordedAt: lastMonth.toISOString(),
      },
    ],
  },
  {
    id: 'tenant-2',
    name: 'James Okello',
    contact: '+256 701 234 567',
    propertyId: 'prop-1',
    unitNumber: 'B-205',
    leaseStartDate: '2023-06-01',
    leaseEndDate: '2025-05-31',
    rentAmount: 1800000,
    securityDeposit: 3600000,
    paymentStatus: 'Due',
    lastPaymentDate: lastMonth.toISOString().split('T')[0],
    nextPaymentDate: today.toISOString().split('T')[0],
    notes: 'Payment due today',
    paymentHistory: [],
  },
];

// ============================================================================
// INITIAL MAINTENANCE REQUESTS
// ============================================================================

export const INITIAL_MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'maint-1',
    propertyId: 'prop-1',
    tenantId: 'tenant-1',
    unitNumber: 'A-101',
    category: 'Plumbing',
    priority: 'Urgent',
    description: 'Kitchen sink leaking, water pooling under cabinet',
    status: 'Assigned',
    assignedVendorId: 'vendor-1',
    estimatedCost: 150000,
    dateRequested: today.toISOString().split('T')[0],
    notes: 'Vendor scheduled for tomorrow morning',
  },
  {
    id: 'maint-2',
    propertyId: 'prop-2',
    category: 'Landscaping',
    priority: 'Routine',
    description: 'Monthly garden maintenance and hedge trimming',
    status: 'Pending',
    estimatedCost: 200000,
    dateRequested: today.toISOString().split('T')[0],
    notes: 'Scheduled maintenance',
  },
];

// ============================================================================
// INITIAL VENDORS
// ============================================================================

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Kampala Plumbing Services',
    contactPerson: 'Moses Musoke',
    phone: '+256 702 345 678',
    email: 'moses@kplumbing.co.ug',
    specialization: ['Plumbing', 'Water Systems'],
    rating: 4.5,
    notes: 'Reliable, good pricing, 24/7 emergency service',
    status: 'Active',
  },
  {
    id: 'vendor-2',
    name: 'Elite Electrical Solutions',
    contactPerson: 'Grace Nambi',
    phone: '+256 703 456 789',
    email: 'info@eliteelectrical.ug',
    specialization: ['Electrical', 'Security Systems'],
    rating: 4.8,
    notes: 'Certified electricians, excellent work quality',
    status: 'Active',
  },
];

// ============================================================================
// INITIAL CHART OF ACCOUNTS (IFRS-Compliant)
// ============================================================================

export const INITIAL_CHART_OF_ACCOUNTS: Account[] = [
  // ASSETS
  { id: 'acc-1000', number: '1000', name: 'Cash at Bank', category: 'Asset', type: 'Current Asset', description: 'Main operating bank account', balance: 0 },
  { id: 'acc-1000-01', number: '1000.01', name: 'Cash at Bank - Centenary', category: 'Asset', type: 'Current Asset', description: 'Centenary Bank - Account ending in 1234' },
  { id: 'acc-1100', number: '1100', name: 'Accounts Receivable', category: 'Asset', type: 'Current Asset', description: 'Rent and other amounts due from tenants' },
  { id: 'acc-1200', number: '1200', name: 'Security Deposits Held', category: 'Asset', type: 'Current Asset', description: 'Tenant security deposits in escrow' },
  { id: 'acc-1500', number: '1500', name: 'Investment Property', category: 'Asset', type: 'Fixed Asset', description: 'Real estate held for rental income (IAS 40)' },

  // LIABILITIES
  { id: 'acc-2000', number: '2000', name: 'Accounts Payable', category: 'Liability', type: 'Current Liability', description: 'Amounts owed to vendors and contractors' },
  { id: 'acc-2100', number: '2100', name: 'Security Deposits Liability', category: 'Liability', type: 'Current Liability', description: 'Obligation to return tenant deposits' },
  { id: 'acc-2200', number: '2200', name: 'Accrued Expenses', category: 'Liability', type: 'Current Liability', description: 'Expenses incurred but not yet paid' },

  // EQUITY
  { id: 'acc-3000', number: '3000', name: 'Owner\'s Equity', category: 'Equity', type: 'Equity', description: 'Capital contributed by owners' },
  { id: 'acc-3100', number: '3100', name: 'Retained Earnings', category: 'Equity', type: 'Equity', description: 'Accumulated profits reinvested' },

  // INCOME
  { id: 'acc-4000', number: '4000', name: 'Rental Income - Residential', category: 'Income', type: 'Operating Revenue', description: 'Monthly rent from residential tenants' },
  { id: 'acc-4100', number: '4100', name: 'Late Fees', category: 'Income', type: 'Operating Revenue', description: 'Late payment fees' },
  { id: 'acc-4200', number: '4200', name: 'Other Income', category: 'Income', type: 'Operating Revenue', description: 'Application fees, pet fees, utility reimbursements' },

  // EXPENSES
  { id: 'acc-5000', number: '5000', name: 'Maintenance & Repairs', category: 'Expense', type: 'Operating Expense', description: 'Routine and emergency repairs' },
  { id: 'acc-5000-01', number: '5000.01', name: 'Maintenance - Plumbing', category: 'Expense', type: 'Operating Expense', description: 'Plumbing repairs and maintenance' },
  { id: 'acc-5000-02', number: '5000.02', name: 'Maintenance - Electrical', category: 'Expense', type: 'Operating Expense', description: 'Electrical repairs and maintenance' },
  { id: 'acc-5100', number: '5100', name: 'Utilities', category: 'Expense', type: 'Operating Expense', description: 'Water, electricity for common areas' },
  { id: 'acc-5200', number: '5200', name: 'Property Tax', category: 'Expense', type: 'Operating Expense', description: 'Local council property taxes' },
  { id: 'acc-5300', number: '5300', name: 'Insurance', category: 'Expense', type: 'Operating Expense', description: 'Property and liability insurance' },
  { id: 'acc-5400', number: '5400', name: 'Management Fees', category: 'Expense', type: 'Operating Expense', description: 'Property management fees' },
  { id: 'acc-5500', number: '5500', name: 'Administrative Expenses', category: 'Expense', type: 'Operating Expense', description: 'Office, software, communications' },
];

// ============================================================================
// INITIAL GENERAL LEDGER ENTRIES
// ============================================================================

export const INITIAL_GENERAL_LEDGER_ENTRIES: GeneralLedgerEntry[] = [
  // Example: Rent payment received
  {
    id: 'gl-1',
    date: lastMonth.toISOString().split('T')[0],
    propertyId: 'prop-1',
    accountId: 'acc-1000',
    description: 'Rent payment - Sarah Nakato - December 2024',
    debit: 2500000,
    credit: 0,
    relatedEntityType: 'tenant',
    relatedEntityId: 'tenant-1',
    recordedAt: lastMonth.toISOString(),
  },
  {
    id: 'gl-2',
    date: lastMonth.toISOString().split('T')[0],
    propertyId: 'prop-1',
    accountId: 'acc-4000',
    description: 'Rent payment - Sarah Nakato - December 2024',
    debit: 0,
    credit: 2500000,
    relatedEntityType: 'tenant',
    relatedEntityId: 'tenant-1',
    recordedAt: lastMonth.toISOString(),
  },
];

// ============================================================================
// INITIAL CASHFLOW FORECAST (12 months)
// ============================================================================

function generateCashflowEntries(): CashflowEntry[] {
  const entries: CashflowEntry[] = [];
  const startDate = new Date();
  startDate.setDate(1); // First of current month

  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(startDate);
    monthDate.setMonth(startDate.getMonth() + i);
    const monthYear = monthDate.toISOString().slice(0, 7); // YYYY-MM

    const projectedRentIncome = 65000000;
    const projectedOtherIncome = 2000000;
    const projectedMaintenanceExpenses = 8000000;
    const projectedOperatingExpenses = 12000000;
    const projectedPropertyTaxInsurance = 3500000;
    const projectedManagementFees = 3250000;

    const projectedNet =
      projectedRentIncome +
      projectedOtherIncome -
      (projectedMaintenanceExpenses +
        projectedOperatingExpenses +
        projectedPropertyTaxInsurance +
        projectedManagementFees);

    // Only populate actuals for past months (simplified for demo)
    const isPast = i === 0;
    const actualRentIncome = isPast ? 63000000 : 0;
    const actualOtherIncome = isPast ? 1800000 : 0;
    const actualMaintenanceExpenses = isPast ? 9200000 : 0;
    const actualOperatingExpenses = isPast ? 11500000 : 0;
    const actualPropertyTaxInsurance = isPast ? 3500000 : 0;
    const actualManagementFees = isPast ? 3250000 : 0;

    const actualNet = isPast
      ? actualRentIncome +
        actualOtherIncome -
        (actualMaintenanceExpenses +
          actualOperatingExpenses +
          actualPropertyTaxInsurance +
          actualManagementFees)
      : 0;

    const variance = isPast ? actualNet - projectedNet : 0;

    entries.push({
      monthYear,
      projectedRentIncome,
      projectedOtherIncome,
      projectedMaintenanceExpenses,
      projectedOperatingExpenses,
      projectedPropertyTaxInsurance,
      projectedManagementFees,
      projectedNet,
      actualRentIncome,
      actualOtherIncome,
      actualMaintenanceExpenses,
      actualOperatingExpenses,
      actualPropertyTaxInsurance,
      actualManagementFees,
      actualNet,
      variance,
    });
  }

  return entries;
}

export const INITIAL_CASHFLOW_FORECAST: CashflowForecast = {
  entries: generateCashflowEntries(),
  lastUpdated: new Date().toISOString(),
};
