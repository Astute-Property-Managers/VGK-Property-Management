// ============================================================================
// VGK Property Command - Type Definitions
// Combining: Verne Harnish (Scaling Up) + Robert Griswold (Property Mgmt)
//           + Richard Koch (80/20) + IFRS/CPA Uganda/URA Compliance
// ============================================================================

// ============================================================================
// STRATEGIC PLANNING TYPES (Verne Harnish - Scaling Up)
// ============================================================================

export interface OnePageStrategicPlan {
  id: string;
  coreValues: string[];
  corePurpose: string;
  bhag: string; // Big Hairy Audacious Goal (10-25 years)
  threeYearPicture: string;
  annualTheme: string;
  quarterlyTheme: string;
  lastUpdated: string; // ISO date
}

export interface Rock {
  id: string;
  description: string;
  owner: string;
  quarter: string; // e.g., "Q1 2024"
  status: 'on-track' | 'at-risk' | 'off-track';
  progress: number; // 0-100
  dueDate: string; // ISO date
  createdAt: string;
  completedAt?: string;
}

export type KPIStatus = 'GREEN' | 'YELLOW' | 'RED';
export type KPITrend = 'up' | 'down' | 'stable';
export type KPIFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface KPI {
  id: string;
  name: string;
  category: 'financial' | 'operational' | 'tenant' | 'strategic';
  currentValue: number;
  targetValue: number;
  unit: string; // '%', 'UGX', 'days', 'count', etc.
  frequency: KPIFrequency;
  status: KPIStatus;
  trend: KPITrend;
  lastUpdated: string;
  history: Array<{
    date: string;
    value: number;
  }>;
}

export interface CriticalNumber {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  unit: string;
  isVital20Percent: true; // Richard Koch's 80/20 principle
  lastUpdated: string;
  history: Array<{
    date: string;
    value: number;
  }>;
}

export interface HuddleEntry {
  id: string;
  date: string; // ISO date
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  attendees: string[];
  wins: string[];
  stucks: string[]; // Issues/blockers
  priorities: string[]; // Top 3-5 priorities
  notes: string;
  createdBy: string;
  createdAt: string;
}

// ============================================================================
// PROPERTY MANAGEMENT TYPES (Robert Griswold)
// ============================================================================

export type PropertyType = 'residential' | 'commercial' | 'mixed-use' | 'industrial';
export type PropertyStatus = 'active' | 'inactive' | 'under-renovation';

export interface Property {
  id: string;
  name: string;
  address: string;
  type: PropertyType;
  status: PropertyStatus;
  totalUnits: number;
  occupiedUnits: number;
  squareFeet: number;
  purchasePrice: number; // UGX
  purchaseDate: string; // ISO date
  currentValue: number; // UGX (for IAS 40 - Investment Property)
  monthlyIncome: number; // UGX
  monthlyExpenses: number; // UGX
  managementFee: number; // UGX or percentage
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 'paid' | 'due' | 'overdue';
export type PaymentMethod = 'mobile-money' | 'bank-transfer' | 'cash' | 'cheque';

export interface Tenant {
  id: string;
  propertyId: string;
  unitNumber: string;
  name: string;
  email: string;
  phone: string; // Format: +256XXXXXXXXX
  leaseStartDate: string; // ISO date
  leaseEndDate: string; // ISO date
  monthlyRent: number; // UGX
  deposit: number; // UGX
  paymentStatus: PaymentStatus;
  lastPaymentDate?: string; // ISO date
  lastPaymentAmount?: number; // UGX
  outstandingBalance: number; // UGX
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number; // UGX
  paymentDate: string; // ISO date
  paymentMethod: PaymentMethod;
  reference: string; // Transaction reference
  forMonth: string; // e.g., "2024-01"
  notes: string;
  recordedBy: string;
  createdAt: string;
  // GL integration
  glEntryId?: string; // Links to GeneralLedgerEntry
}

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency';
export type MaintenanceStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'landscaping' | 'appliance' | 'other';

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  unitNumber?: string;
  tenantId?: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  description: string;
  reportedDate: string; // ISO date
  scheduledDate?: string; // ISO date
  completedDate?: string; // ISO date
  assignedTo?: string; // Vendor ID
  estimatedCost: number; // UGX
  actualCost: number; // UGX
  responseTime?: number; // hours (target: <24 hours per IREM standards)
  notes: string;
  createdAt: string;
  updatedAt: string;
  // GL integration
  glEntryId?: string;
}

export type VendorCategory = 'plumbing' | 'electrical' | 'hvac' | 'landscaping' | 'cleaning' | 'security' | 'general-contractor' | 'other';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contactPerson: string;
  phone: string; // Format: +256XXXXXXXXX
  email: string;
  address: string;
  rating: number; // 1-5
  totalJobsCompleted: number;
  averageResponseTime: number; // hours
  isPreferred: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// FINANCIAL TYPES (IFRS/CPA Uganda/URA Compliance)
// ============================================================================

export type AccountCategory = 'asset' | 'liability' | 'equity' | 'income' | 'expense';
export type AccountType =
  // Assets
  | 'current-asset' | 'fixed-asset' | 'investment-property'
  // Liabilities
  | 'current-liability' | 'long-term-liability'
  // Equity
  | 'capital' | 'retained-earnings'
  // Income
  | 'rental-income' | 'other-income'
  // Expenses
  | 'operating-expense' | 'administrative-expense' | 'financial-expense';

export interface Account {
  id: string;
  code: string; // e.g., "1000", "4100"
  name: string;
  category: AccountCategory;
  type: AccountType;
  normalBalance: 'debit' | 'credit';
  currentBalance: number; // UGX
  isActive: boolean;
  parentAccountId?: string; // For hierarchical chart of accounts
  createdAt: string;
  updatedAt: string;
}

export interface GeneralLedgerEntry {
  id: string;
  date: string; // ISO date (transaction date)
  accountId: string;
  debit: number; // UGX (0 if credit entry)
  credit: number; // UGX (0 if debit entry)
  description: string;
  reference: string; // Links to source document
  sourceType: 'payment' | 'maintenance' | 'manual' | 'depreciation' | 'adjustment';
  sourceId?: string; // ID of the source record
  createdBy: string;
  createdAt: string; // ISO datetime (record creation)
  // Audit trail
  isReversed: boolean;
  reversalEntryId?: string;
}

export interface CashflowEntry {
  id: string;
  month: string; // e.g., "2024-01"
  accountId: string;
  accountName: string;
  accountCategory: AccountCategory;
  projectedAmount: number; // UGX (budget/forecast)
  actualAmount: number; // UGX (from GL)
  variance: number; // UGX (actual - projected)
  variancePercent: number; // %
  notes: string;
  lastUpdated: string;
}

// ============================================================================
// MESSAGING TYPES
// ============================================================================

export type MessageChannel = 'sms' | 'whatsapp' | 'email';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'failed';

export interface MessageTemplate {
  id: string;
  name: string;
  channel: MessageChannel;
  subject?: string; // For email
  body: string; // Supports variables like {tenantName}, {amount}, etc.
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MessageLog {
  id: string;
  recipientId: string; // Tenant ID or Vendor ID
  recipientName: string;
  recipientContact: string;
  channel: MessageChannel;
  subject?: string;
  body: string;
  status: MessageStatus;
  sentAt?: string;
  deliveredAt?: string;
  errorMessage?: string;
  createdAt: string;
}

// ============================================================================
// ANALYTICS & REPORTING TYPES
// ============================================================================

export interface PropertyMetrics {
  propertyId: string;
  propertyName: string;
  occupancyRate: number; // %
  vacancyRate: number; // %
  noi: number; // Net Operating Income (UGX)
  oer: number; // Operating Expense Ratio (%)
  averageRentPerUnit: number; // UGX
  collectionRate: number; // % of rent collected vs due
  maintenanceSpend: number; // UGX
  averageMaintenanceResponseTime: number; // hours
  tenantSatisfactionScore?: number; // 1-5
  lastUpdated: string;
}

export interface PortfolioMetrics {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  overallOccupancyRate: number; // %
  totalMonthlyIncome: number; // UGX
  totalMonthlyExpenses: number; // UGX
  portfolioNOI: number; // UGX
  portfolioValue: number; // UGX
  lastUpdated: string;
}

// ============================================================================
// API & SERVICE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  details?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface TableSortState {
  field: string;
  direction: SortDirection;
}

export interface FilterState {
  searchTerm: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
