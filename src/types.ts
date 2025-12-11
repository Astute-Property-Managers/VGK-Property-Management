/**
 * Verne-Grisworld-Koch Property Command - Type Definitions
 * Comprehensive types for Scaling Up + Property Management + IFRS Compliance
 */

// ============================================================================
// SCALING UP - STRATEGIC PLANNING TYPES
// ============================================================================

export type Status = 'GREEN' | 'YELLOW' | 'RED';

export interface OnePageStrategicPlan {
  // Core Values & Purpose
  coreValues: string[];
  purpose: string;

  // Strategic Vision
  bhag: string; // Big Hairy Audacious Goal (10-25 years)
  threeYearPicture: string;

  // Annual Priorities
  annualTheme: string;
  annualInitiatives: string[];

  // Quarterly Targets
  quarterlyTheme: string;
  quarterlyObjectives: string[];

  lastUpdated: string;
}

export interface Rock {
  id: string;
  title: string;
  description: string;
  owner: string;
  dueDate: string;
  status: Status;
  progress: number; // 0-100
  category: 'Growth' | 'Financial' | 'Operational' | 'People';
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  status: Status;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface CriticalNumber {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  history: { date: string; value: number }[];
  status: Status;
  category: 'Financial' | 'Operational' | 'Customer';
}

export interface HuddleEntry {
  id: string;
  date: string;
  type: 'Daily' | 'Weekly';
  wins: string[];
  stucks: string[];
  priorities: string[];
  attendees: string[];
  notes: string;
}

// ============================================================================
// PROPERTY MANAGEMENT TYPES (IREM/Griswold)
// ============================================================================

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'Residential' | 'Commercial' | 'Mixed';
  totalUnits: number;
  occupiedUnits: number;
  vacancyRate: number; // Calculated
  owner: string;
  acquisitionDate: string;
  notes: string;
  status: 'Active' | 'Inactive';
}

export interface Tenant {
  id: string;
  name: string;
  contact: string;
  propertyId: string;
  unitNumber: string;
  leaseStartDate: string;
  leaseEndDate: string;
  rentAmount: number;
  securityDeposit: number;
  paymentStatus: 'Paid' | 'Due' | 'Overdue';
  lastPaymentDate: string;
  nextPaymentDate: string;
  notes: string;
  paymentHistory?: PaymentRecord[];
}

export interface PaymentRecord {
  date: string;
  amount: number;
  method: 'Mobile Money' | 'Bank Transfer' | 'Cash';
  referenceNumber?: string;
  notes?: string;
  recordedAt: string;
}

export type MaintenanceRequestStatus = 'Pending' | 'Assigned' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
export type MaintenancePriority = 'Critical' | 'Urgent' | 'Routine';
export type MaintenanceCategory = 'Plumbing' | 'Electrical' | 'HVAC' | 'Structural' | 'Landscaping' | 'Security' | 'Other';

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId?: string;
  unitNumber?: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  description: string;
  status: MaintenanceRequestStatus;
  assignedVendorId?: string;
  estimatedCost?: number;
  actualCost?: number;
  dateRequested: string;
  dateCompleted?: string;
  notes: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  specialization: string[];
  rating: number; // 1-5
  notes: string;
  status: 'Active' | 'Inactive';
}

// ============================================================================
// FINANCIAL TYPES (CPA Uganda / IFRS / Lean Accounting)
// ============================================================================

export type AccountCategory = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export interface Account {
  id: string;
  number: string; // e.g., "1000", "1000.01" for hierarchy
  name: string;
  category: AccountCategory;
  type: string; // e.g., "Current Asset", "Fixed Asset", "Operating Income"
  description: string;
  balance?: number;
}

export interface GeneralLedgerEntry {
  id: string;
  date: string;
  propertyId?: string;
  accountId: string;
  description: string;
  debit: number;
  credit: number;
  relatedEntityType?: 'tenant' | 'vendor' | 'property' | 'maintenance';
  relatedEntityId?: string;
  recordedAt: string;
}

export interface CashflowEntry {
  monthYear: string; // YYYY-MM

  // Income Categories (Projected)
  projectedRentIncome: number;
  projectedOtherIncome: number;

  // Expense Categories (Projected)
  projectedMaintenanceExpenses: number;
  projectedOperatingExpenses: number;
  projectedPropertyTaxInsurance: number;
  projectedManagementFees: number;

  // Calculated Projected
  projectedNet: number;

  // Income Categories (Actual)
  actualRentIncome: number;
  actualOtherIncome: number;

  // Expense Categories (Actual)
  actualMaintenanceExpenses: number;
  actualOperatingExpenses: number;
  actualPropertyTaxInsurance: number;
  actualManagementFees: number;

  // Calculated Actual
  actualNet: number;

  // Variance
  variance: number;
}

export interface CashflowForecast {
  entries: CashflowEntry[];
  lastUpdated: string;
}

// Placeholder for future IFRS reports
export interface IncomeStatement {
  period: string;
  revenue: number;
  operatingExpenses: number;
  netOperatingIncome: number;
  otherIncome: number;
  otherExpenses: number;
  netIncome: number;
}

export interface BalanceSheet {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

// ============================================================================
// MESSAGING TYPES
// ============================================================================

export interface MessageTemplate {
  type: 'rent_reminder' | 'payment_confirmation' | 'maintenance_update' | 'general';
  content: string;
}

// ============================================================================
// APPLICATION STATE TYPES
// ============================================================================

export interface AppData {
  opsp: OnePageStrategicPlan;
  rocks: Rock[];
  kpis: KPI[];
  criticalNumbers: CriticalNumber[];
  huddles: HuddleEntry[];
  properties: Property[];
  tenants: Tenant[];
  maintenanceRequests: MaintenanceRequest[];
  vendors: Vendor[];
  chartOfAccounts: Account[];
  generalLedger: GeneralLedgerEntry[];
  cashflowForecast: CashflowForecast;
}
