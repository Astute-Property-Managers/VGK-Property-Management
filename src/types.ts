/**
 * Altus - Type Definitions
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
// TENANT SCREENING TYPES (Griswold Standard)
// ============================================================================

export type ScreeningStatus = 'In Progress' | 'Approved' | 'Rejected' | 'Pending Review';

export interface TenantScreeningApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  propertyId: string;
  unitNumber: string;
  applicationDate: string;
  status: ScreeningStatus;

  // Employment Verification
  currentEmployer?: string;
  jobTitle?: string;
  monthlyIncome?: number;
  employmentVerified: boolean;

  // Credit & Background
  creditScore?: number;
  creditCheckDate?: string;
  backgroundCheckStatus?: 'Pending' | 'Clear' | 'Issues Found';
  backgroundCheckDate?: string;

  // Rental History
  previousLandlord?: string;
  previousLandlordContact?: string;
  rentalHistoryVerified: boolean;
  evictionHistory: boolean;

  // References
  references: {
    name: string;
    relationship: string;
    contact: string;
    verified: boolean;
  }[];

  // Decision
  reviewNotes: string;
  reviewedBy?: string;
  reviewDate?: string;
  denialReason?: string;
}

// ============================================================================
// LEASE RENEWAL TYPES
// ============================================================================

export type LeaseRenewalStatus = 'Upcoming' | 'Notice Sent' | 'Negotiating' | 'Accepted' | 'Declined' | 'Expired';

export interface LeaseRenewal {
  id: string;
  tenantId: string;
  propertyId: string;
  unitNumber: string;

  // Current Lease Info
  currentLeaseEndDate: string;
  currentRentAmount: number;

  // Renewal Details
  renewalStatus: LeaseRenewalStatus;
  notificationDate?: string; // Date 120-day notice was sent
  proposedRentAmount?: number;
  proposedLeaseTermMonths?: number;

  // Communication Log
  communicationLog: {
    date: string;
    type: 'Email' | 'Call' | 'In-Person' | 'SMS';
    summary: string;
    contactedBy: string;
  }[];

  // Decision
  tenantResponse?: 'Interested' | 'Declined' | 'Negotiating';
  ownerApproval?: boolean;
  finalRentAmount?: number;
  newLeaseStartDate?: string;
  newLeaseEndDate?: string;

  notes: string;
}

// ============================================================================
// MOVE-IN / MOVE-OUT TYPES
// ============================================================================

export interface MoveInInspection {
  id: string;
  tenantId: string;
  propertyId: string;
  unitNumber: string;
  inspectionDate: string;
  inspectedBy: string;

  // Checklist Items
  checklist: {
    area: string; // e.g., "Living Room", "Kitchen", "Bathroom"
    item: string; // e.g., "Walls", "Floor", "Appliances"
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Damaged';
    notes: string;
  }[];

  // Photos
  photos: {
    area: string;
    url: string; // Base64 or file path
    description: string;
  }[];

  // Baseline Inventory
  inventory: {
    item: string;
    quantity: number;
    condition: string;
  }[];

  // Deposit Confirmation
  securityDepositAmount: number;
  securityDepositReceived: boolean;

  // Signatures
  tenantSignature?: string;
  managerSignature?: string;
  signedDate?: string;
}

export interface MoveOutInspection {
  id: string;
  tenantId: string;
  propertyId: string;
  unitNumber: string;
  moveOutDate: string;
  inspectionDate: string;
  inspectedBy: string;

  // Exit Checklist
  checklist: {
    area: string;
    item: string;
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Damaged';
    damageAssessment?: string;
    repairRequired: boolean;
    estimatedRepairCost?: number;
  }[];

  // Photos
  photos: {
    area: string;
    url: string;
    description: string;
  }[];

  // Deposit Calculation
  securityDepositHeld: number;
  deductions: {
    description: string;
    amount: number;
    category: 'Cleaning' | 'Repairs' | 'Unpaid Rent' | 'Other';
  }[];
  totalDeductions: number;
  depositRefundAmount: number;

  // Outstanding Charges
  unpaidRent: number;
  unpaidUtilities: number;
  otherCharges: number;

  // Refund Details
  refundMethod?: 'Bank Transfer' | 'Check' | 'Mobile Money';
  refundDate?: string;
  refundReference?: string;

  notes: string;
}

// ============================================================================
// OWNER STATEMENTS TYPES
// ============================================================================

export interface OwnerStatement {
  id: string;
  ownerId: string;
  propertyId: string;
  statementPeriod: string; // YYYY-MM
  generatedDate: string;
  generatedBy: string;

  // Rent Roll
  rentRoll: {
    unitNumber: string;
    tenantName: string;
    rentAmount: number;
    amountReceived: number;
    status: 'Paid' | 'Partial' | 'Unpaid';
  }[];
  totalRentDue: number;
  totalRentReceived: number;
  collectionRate: number; // percentage

  // Expenses
  expenses: {
    date: string;
    category: string;
    description: string;
    amount: number;
    relatedMaintenanceId?: string;
  }[];
  totalExpenses: number;

  // Maintenance Summary
  maintenanceSummary: {
    requestId: string;
    date: string;
    description: string;
    vendor: string;
    cost: number;
  }[];
  totalMaintenanceCost: number;

  // Management Fees
  managementFeeRate: number; // percentage
  managementFeeAmount: number;

  // Variance Analysis
  previousMonthNetIncome?: number;
  currentMonthNetIncome: number;
  varianceAmount: number;
  variancePercentage: number;

  // Net Owner Disbursement
  grossIncome: number;
  totalDeductions: number;
  netDisbursement: number;

  // Commentary
  managerCommentary?: string;

  // PDF Export
  pdfUrl?: string;
}

// ============================================================================
// 80/20 ANALYTICS TYPES
// ============================================================================

export interface TenantPerformanceMetrics {
  tenantId: string;
  tenantName: string;

  // Financial Contribution
  totalRentPaid: number;
  onTimePaymentRate: number; // percentage
  averageDaysLate: number;

  // Risk Metrics
  maintenanceRequestCount: number;
  complaintCount: number;
  leaseViolationCount: number;
  evictionRisk: 'Low' | 'Medium' | 'High';

  // Profitability
  totalRevenue: number;
  totalCosts: number; // maintenance, complaints, etc.
  netContribution: number;

  // Ranking
  revenueRank?: number; // 1 = highest
  profitabilityRank?: number;
  riskScore: number; // 0-100, higher = more risk
}

export interface PropertyPerformanceMetrics {
  propertyId: string;
  propertyName: string;

  // Income Metrics
  totalIncome: number;
  occupancyRate: number;
  averageRentPerUnit: number;

  // Expense Metrics
  totalExpenses: number;
  maintenanceFrequency: number; // requests per month
  averageMaintenanceCost: number;

  // Profitability
  noi: number; // Net Operating Income
  oer: number; // Operating Expense Ratio
  netYield: number; // percentage

  // Rankings
  incomeRank?: number;
  yieldRank?: number;
  efficiencyRank?: number; // based on OER
}

export interface VitalFewKPI extends KPI {
  isVitalFew: boolean; // Mark as one of the critical 5
  impactScore: number; // 1-10, how critical is this KPI
  reviewFrequency: 'Daily' | 'Weekly';
  alertThreshold: number; // Trigger alert if below this percentage of target
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

  // New modules
  tenantScreeningApplications: TenantScreeningApplication[];
  leaseRenewals: LeaseRenewal[];
  moveInInspections: MoveInInspection[];
  moveOutInspections: MoveOutInspection[];
  ownerStatements: OwnerStatement[];
}
