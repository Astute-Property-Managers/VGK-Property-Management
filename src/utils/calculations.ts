// ============================================================================
// VGK Property Command - Calculation Utilities
// Financial and operational metrics calculations
// ============================================================================

import {
  Property,
  Tenant,
  PaymentStatus,
  KPIStatus,
  KPITrend,
  GeneralLedgerEntry,
  AccountCategory,
} from '../types';

// ============================================================================
// PROPERTY METRICS
// ============================================================================

export function calculateOccupancyRate(totalUnits: number, occupiedUnits: number): number {
  if (totalUnits === 0) return 0;
  return (occupiedUnits / totalUnits) * 100;
}

export function calculateVacancyRate(totalUnits: number, occupiedUnits: number): number {
  return 100 - calculateOccupancyRate(totalUnits, occupiedUnits);
}

export function calculateNOI(monthlyIncome: number, monthlyExpenses: number): number {
  // Net Operating Income = Income - Operating Expenses
  return monthlyIncome - monthlyExpenses;
}

export function calculateOER(monthlyExpenses: number, monthlyIncome: number): number {
  // Operating Expense Ratio = Operating Expenses / Gross Operating Income
  if (monthlyIncome === 0) return 0;
  return (monthlyExpenses / monthlyIncome) * 100;
}

export function calculateCapRate(noi: number, propertyValue: number): number {
  // Capitalization Rate = (Annual NOI / Property Value) * 100
  if (propertyValue === 0) return 0;
  const annualNOI = noi * 12;
  return (annualNOI / propertyValue) * 100;
}

export function calculateCollectionRate(collected: number, due: number): number {
  if (due === 0) return 100;
  return (collected / due) * 100;
}

// ============================================================================
// TENANT PAYMENT STATUS
// ============================================================================

export function calculatePaymentStatus(
  lastPaymentDate: string | undefined,
  monthlyRent: number,
  outstandingBalance: number
): PaymentStatus {
  if (outstandingBalance === 0) return 'paid';

  if (!lastPaymentDate) return 'overdue';

  const lastPayment = new Date(lastPaymentDate);
  const today = new Date();
  const daysSincePayment = Math.floor(
    (today.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If more than 30 days since last payment, consider overdue
  if (daysSincePayment > 30) return 'overdue';

  // If outstanding balance exists and within 30 days, consider due
  if (outstandingBalance > 0) return 'due';

  return 'paid';
}

export function calculateOutstandingBalance(
  monthlyRent: number,
  leaseStartDate: string,
  totalPaid: number
): number {
  const startDate = new Date(leaseStartDate);
  const today = new Date();

  // Calculate number of months since lease start
  const monthsDiff =
    (today.getFullYear() - startDate.getFullYear()) * 12 +
    (today.getMonth() - startDate.getMonth());

  const expectedPayments = Math.max(0, monthsDiff + 1);
  const totalExpected = expectedPayments * monthlyRent;

  return Math.max(0, totalExpected - totalPaid);
}

// ============================================================================
// KPI STATUS CALCULATION
// ============================================================================

export function calculateKPIStatus(
  currentValue: number,
  targetValue: number,
  isHigherBetter: boolean = true
): KPIStatus {
  const percentOfTarget = (currentValue / targetValue) * 100;

  if (isHigherBetter) {
    if (percentOfTarget >= 100) return 'GREEN';
    if (percentOfTarget >= 80) return 'YELLOW';
    return 'RED';
  } else {
    // For metrics where lower is better (e.g., expenses, vacancy rate)
    if (percentOfTarget <= 100) return 'GREEN';
    if (percentOfTarget <= 120) return 'YELLOW';
    return 'RED';
  }
}

export function calculateKPITrend(history: Array<{ value: number }>): KPITrend {
  if (history.length < 2) return 'stable';

  const latest = history[history.length - 1].value;
  const previous = history[history.length - 2].value;

  const percentChange = ((latest - previous) / previous) * 100;

  if (Math.abs(percentChange) < 2) return 'stable';
  if (percentChange > 0) return 'up';
  return 'down';
}

// ============================================================================
// FINANCIAL CALCULATIONS
// ============================================================================

export function calculateAccountBalance(
  entries: GeneralLedgerEntry[],
  normalBalance: 'debit' | 'credit'
): number {
  const totalDebits = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = entries.reduce((sum, entry) => sum + entry.credit, 0);

  if (normalBalance === 'debit') {
    return totalDebits - totalCredits;
  } else {
    return totalCredits - totalDebits;
  }
}

export function validateDoubleEntry(
  entries: Array<{ debit: number; credit: number }>
): boolean {
  const totalDebits = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = entries.reduce((sum, entry) => sum + entry.credit, 0);

  // Allow for small rounding errors (1 UGX)
  return Math.abs(totalDebits - totalCredits) < 1;
}

export function calculateCashflowVariance(
  projected: number,
  actual: number
): { variance: number; variancePercent: number } {
  const variance = actual - projected;
  const variancePercent = projected !== 0 ? (variance / projected) * 100 : 0;

  return { variance, variancePercent };
}

export function aggregateByAccountCategory(
  entries: GeneralLedgerEntry[],
  accounts: Map<string, { category: AccountCategory; normalBalance: 'debit' | 'credit' }>
): Record<AccountCategory, number> {
  const aggregated: Record<AccountCategory, number> = {
    asset: 0,
    liability: 0,
    equity: 0,
    income: 0,
    expense: 0,
  };

  entries.forEach((entry) => {
    const account = accounts.get(entry.accountId);
    if (!account) return;

    const { category, normalBalance } = account;

    let amount = 0;
    if (normalBalance === 'debit') {
      amount = entry.debit - entry.credit;
    } else {
      amount = entry.credit - entry.debit;
    }

    aggregated[category] += amount;
  });

  return aggregated;
}

// ============================================================================
// PORTFOLIO AGGREGATIONS
// ============================================================================

export function aggregatePortfolioMetrics(properties: Property[]): {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  overallOccupancyRate: number;
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  portfolioNOI: number;
  portfolioValue: number;
} {
  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
  const occupiedUnits = properties.reduce((sum, p) => sum + p.occupiedUnits, 0);
  const totalMonthlyIncome = properties.reduce((sum, p) => sum + p.monthlyIncome, 0);
  const totalMonthlyExpenses = properties.reduce((sum, p) => sum + p.monthlyExpenses, 0);
  const portfolioValue = properties.reduce((sum, p) => sum + p.currentValue, 0);

  return {
    totalProperties,
    totalUnits,
    occupiedUnits,
    overallOccupancyRate: calculateOccupancyRate(totalUnits, occupiedUnits),
    totalMonthlyIncome,
    totalMonthlyExpenses,
    portfolioNOI: calculateNOI(totalMonthlyIncome, totalMonthlyExpenses),
    portfolioValue,
  };
}

// ============================================================================
// MAINTENANCE RESPONSE TIME
// ============================================================================

export function calculateResponseTime(reportedDate: string, completedDate: string): number {
  const reported = new Date(reportedDate);
  const completed = new Date(completedDate);

  const diffMs = completed.getTime() - reported.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours;
}

// ============================================================================
// STATISTICAL FUNCTIONS
// ============================================================================

export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;

  return sorted[Math.max(0, index)];
}
