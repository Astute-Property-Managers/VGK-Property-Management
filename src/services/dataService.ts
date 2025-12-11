/**
 * Data Service - Centralized data management for VGK Property Command
 * Implements CRUD operations with localStorage (demo) - Replace with secure backend for production
 */

import { STORAGE_PREFIX, INITIAL_OPSP, INITIAL_ROCKS, INITIAL_KPIS, INITIAL_CRITICAL_NUMBERS, INITIAL_PROPERTIES, INITIAL_TENANTS, INITIAL_MAINTENANCE_REQUESTS, INITIAL_VENDORS, INITIAL_CHART_OF_ACCOUNTS, INITIAL_GENERAL_LEDGER_ENTRIES, INITIAL_CASHFLOW_FORECAST } from '../constants';
import type { OnePageStrategicPlan, Rock, KPI, CriticalNumber, HuddleEntry, Property, Tenant, MaintenanceRequest, Vendor, Account, GeneralLedgerEntry, CashflowForecast, CashflowEntry, AccountCategory } from '../types';
import { sanitizeHtml, sanitizeObject } from './securityService';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStorageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(getStorageKey(key), JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
    throw new Error(`Storage error: Unable to save ${key}`);
  }
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(getStorageKey(key));
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return defaultValue;
  }
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// ============================================================================
// ONE PAGE STRATEGIC PLAN
// ============================================================================

export function getOPSP(): OnePageStrategicPlan {
  return loadFromStorage('opsp', INITIAL_OPSP);
}

export function saveOPSP(opsp: OnePageStrategicPlan): void {
  const sanitized: OnePageStrategicPlan = {
    ...opsp,
    coreValues: opsp.coreValues.map(v => sanitizeHtml(v)),
    purpose: sanitizeHtml(opsp.purpose),
    bhag: sanitizeHtml(opsp.bhag),
    threeYearPicture: sanitizeHtml(opsp.threeYearPicture),
    annualTheme: sanitizeHtml(opsp.annualTheme),
    annualInitiatives: opsp.annualInitiatives.map(i => sanitizeHtml(i)),
    quarterlyTheme: sanitizeHtml(opsp.quarterlyTheme),
    quarterlyObjectives: opsp.quarterlyObjectives.map(o => sanitizeHtml(o)),
    lastUpdated: new Date().toISOString(),
  };
  saveToStorage('opsp', sanitized);
}

// ============================================================================
// ROCKS (Quarterly Priorities)
// ============================================================================

export function getRocks(): Rock[] {
  return loadFromStorage('rocks', INITIAL_ROCKS);
}

export function saveRock(rock: Rock): void {
  const rocks = getRocks();
  const sanitized = sanitizeObject(rock, ['title', 'description', 'owner']);

  const index = rocks.findIndex(r => r.id === rock.id);
  if (index >= 0) {
    rocks[index] = sanitized;
  } else {
    sanitized.id = generateId('rock');
    rocks.push(sanitized);
  }

  saveToStorage('rocks', rocks);
}

export function deleteRock(id: string): void {
  const rocks = getRocks().filter(r => r.id !== id);
  saveToStorage('rocks', rocks);
}

// ============================================================================
// KPIs
// ============================================================================

export function getKPIs(): KPI[] {
  return loadFromStorage('kpis', INITIAL_KPIS);
}

export function saveKPI(kpi: KPI): void {
  const kpis = getKPIs();
  const sanitized = sanitizeObject(kpi, ['name', 'description', 'unit']);
  sanitized.lastUpdated = new Date().toISOString();

  const index = kpis.findIndex(k => k.id === kpi.id);
  if (index >= 0) {
    kpis[index] = sanitized;
  } else {
    sanitized.id = generateId('kpi');
    kpis.push(sanitized);
  }

  saveToStorage('kpis', kpis);
}

export function deleteKPI(id: string): void {
  const kpis = getKPIs().filter(k => k.id !== id);
  saveToStorage('kpis', kpis);
}

// ============================================================================
// CRITICAL NUMBERS
// ============================================================================

export function getCriticalNumbers(): CriticalNumber[] {
  return loadFromStorage('criticalNumbers', INITIAL_CRITICAL_NUMBERS);
}

export function saveCriticalNumber(cn: CriticalNumber): void {
  const criticalNumbers = getCriticalNumbers();
  const sanitized = sanitizeObject(cn, ['name', 'description', 'unit']);

  const index = criticalNumbers.findIndex(c => c.id === cn.id);
  if (index >= 0) {
    criticalNumbers[index] = sanitized;
  } else {
    sanitized.id = generateId('cn');
    criticalNumbers.push(sanitized);
  }

  saveToStorage('criticalNumbers', criticalNumbers);
}

export function deleteCriticalNumber(id: string): void {
  const criticalNumbers = getCriticalNumbers().filter(c => c.id !== id);
  saveToStorage('criticalNumbers', criticalNumbers);
}

// ============================================================================
// HUDDLES
// ============================================================================

export function getHuddles(): HuddleEntry[] {
  return loadFromStorage('huddles', []);
}

export function saveHuddle(huddle: HuddleEntry): void {
  const huddles = getHuddles();
  const sanitized: HuddleEntry = {
    ...huddle,
    wins: huddle.wins.map(w => sanitizeHtml(w)),
    stucks: huddle.stucks.map(s => sanitizeHtml(s)),
    priorities: huddle.priorities.map(p => sanitizeHtml(p)),
    attendees: huddle.attendees.map(a => sanitizeHtml(a)),
    notes: sanitizeHtml(huddle.notes),
  };

  const index = huddles.findIndex(h => h.id === huddle.id);
  if (index >= 0) {
    huddles[index] = sanitized;
  } else {
    sanitized.id = generateId('huddle');
    huddles.push(sanitized);
  }

  saveToStorage('huddles', huddles);
}

export function deleteHuddle(id: string): void {
  const huddles = getHuddles().filter(h => h.id !== id);
  saveToStorage('huddles', huddles);
}

// ============================================================================
// PROPERTIES
// ============================================================================

export function getProperties(): Property[] {
  return loadFromStorage('properties', INITIAL_PROPERTIES);
}

export function saveProperty(property: Property): void {
  const properties = getProperties();
  const sanitized = sanitizeObject(property, ['name', 'address', 'owner', 'notes']);

  // Calculate vacancy rate
  sanitized.vacancyRate = sanitized.totalUnits > 0
    ? ((sanitized.totalUnits - sanitized.occupiedUnits) / sanitized.totalUnits) * 100
    : 0;

  const index = properties.findIndex(p => p.id === property.id);
  if (index >= 0) {
    properties[index] = sanitized;
  } else {
    sanitized.id = generateId('prop');
    properties.push(sanitized);
  }

  saveToStorage('properties', properties);
}

export function deleteProperty(id: string): void {
  const properties = getProperties().filter(p => p.id !== id);
  saveToStorage('properties', properties);
}

// ============================================================================
// TENANTS
// ============================================================================

export function getTenants(): Tenant[] {
  return loadFromStorage('tenants', INITIAL_TENANTS);
}

export function saveTenant(tenant: Tenant): void {
  const tenants = getTenants();
  const sanitized = sanitizeObject(tenant, ['name', 'contact', 'unitNumber', 'notes']);

  const index = tenants.findIndex(t => t.id === tenant.id);
  if (index >= 0) {
    tenants[index] = sanitized;
  } else {
    sanitized.id = generateId('tenant');
    tenants.push(sanitized);
  }

  saveToStorage('tenants', tenants);
}

export function deleteTenant(id: string): void {
  const tenants = getTenants().filter(t => t.id !== id);
  saveToStorage('tenants', tenants);
}

// ============================================================================
// MAINTENANCE REQUESTS
// ============================================================================

export function getMaintenanceRequests(): MaintenanceRequest[] {
  return loadFromStorage('maintenanceRequests', INITIAL_MAINTENANCE_REQUESTS);
}

export function saveMaintenanceRequest(request: MaintenanceRequest): void {
  const requests = getMaintenanceRequests();
  const sanitized = sanitizeObject(request, ['description', 'notes']);

  const index = requests.findIndex(r => r.id === request.id);
  if (index >= 0) {
    requests[index] = sanitized;
  } else {
    sanitized.id = generateId('maint');
    requests.push(sanitized);
  }

  saveToStorage('maintenanceRequests', requests);
}

export function deleteMaintenanceRequest(id: string): void {
  const requests = getMaintenanceRequests().filter(r => r.id !== id);
  saveToStorage('maintenanceRequests', requests);
}

// ============================================================================
// VENDORS
// ============================================================================

export function getVendors(): Vendor[] {
  return loadFromStorage('vendors', INITIAL_VENDORS);
}

export function saveVendor(vendor: Vendor): void {
  const vendors = getVendors();
  const sanitized = sanitizeObject(vendor, ['name', 'contactPerson', 'phone', 'email', 'notes']);

  const index = vendors.findIndex(v => v.id === vendor.id);
  if (index >= 0) {
    vendors[index] = sanitized;
  } else {
    sanitized.id = generateId('vendor');
    vendors.push(sanitized);
  }

  saveToStorage('vendors', vendors);
}

export function deleteVendor(id: string): void {
  const vendors = getVendors().filter(v => v.id !== id);
  saveToStorage('vendors', vendors);
}

// ============================================================================
// CHART OF ACCOUNTS
// ============================================================================

export function getAccounts(): Account[] {
  return loadFromStorage('chartOfAccounts', INITIAL_CHART_OF_ACCOUNTS);
}

export function saveAccount(account: Account): void {
  const accounts = getAccounts();
  const sanitized = sanitizeObject(account, ['number', 'name', 'type', 'description']);

  const index = accounts.findIndex(a => a.id === account.id);
  if (index >= 0) {
    accounts[index] = sanitized;
  } else {
    sanitized.id = generateId('acc');
    accounts.push(sanitized);
  }

  saveToStorage('chartOfAccounts', accounts);
}

export function deleteAccount(id: string): void {
  const accounts = getAccounts().filter(a => a.id !== id);
  saveToStorage('chartOfAccounts', accounts);
}

// ============================================================================
// GENERAL LEDGER
// ============================================================================

export function getGeneralLedgerEntries(): GeneralLedgerEntry[] {
  return loadFromStorage('generalLedger', INITIAL_GENERAL_LEDGER_ENTRIES);
}

export function saveGeneralLedgerEntry(entry: GeneralLedgerEntry): void {
  const entries = getGeneralLedgerEntries();
  const sanitized = sanitizeObject(entry, ['description']);
  sanitized.recordedAt = new Date().toISOString();

  const index = entries.findIndex(e => e.id === entry.id);
  if (index >= 0) {
    entries[index] = sanitized;
  } else {
    sanitized.id = generateId('gl');
    entries.push(sanitized);
  }

  saveToStorage('generalLedger', entries);
}

export function deleteGeneralLedgerEntry(id: string): void {
  const entries = getGeneralLedgerEntries().filter(e => e.id !== id);
  saveToStorage('generalLedger', entries);
}

/**
 * Helper to record a double-entry transaction
 */
export function recordTransaction(params: {
  date: string;
  description: string;
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  propertyId?: string;
  relatedEntityType?: 'tenant' | 'vendor' | 'property' | 'maintenance';
  relatedEntityId?: string;
}): void {
  const { date, description, debitAccountId, creditAccountId, amount, propertyId, relatedEntityType, relatedEntityId } = params;

  // Debit entry
  saveGeneralLedgerEntry({
    id: '',
    date,
    propertyId,
    accountId: debitAccountId,
    description,
    debit: amount,
    credit: 0,
    relatedEntityType,
    relatedEntityId,
    recordedAt: new Date().toISOString(),
  });

  // Credit entry
  saveGeneralLedgerEntry({
    id: '',
    date,
    propertyId,
    accountId: creditAccountId,
    description,
    debit: 0,
    credit: amount,
    relatedEntityType,
    relatedEntityId,
    recordedAt: new Date().toISOString(),
  });
}

/**
 * Aggregates GL entries for a specific month and account numbers
 */
export function aggregateGLEntriesForMonth(monthYear: string, targetAccountNumbers: string[]): number {
  const entries = getGeneralLedgerEntries();
  const accounts = getAccounts();

  // Get account IDs for target numbers
  const targetAccountIds = accounts
    .filter(acc => targetAccountNumbers.some(num => acc.number.startsWith(num)))
    .map(acc => acc.id);

  // Filter entries for this month
  const monthEntries = entries.filter(entry => entry.date.startsWith(monthYear));

  // Sum debits - credits for these accounts
  let total = 0;
  for (const entry of monthEntries) {
    if (targetAccountIds.includes(entry.accountId)) {
      total += (entry.debit - entry.credit);
    }
  }

  return total;
}

// ============================================================================
// CASHFLOW FORECAST
// ============================================================================

export function getCashflowForecast(): CashflowForecast {
  const forecast = loadFromStorage('cashflowForecast', INITIAL_CASHFLOW_FORECAST);

  // Update actuals from GL for each month
  forecast.entries = forecast.entries.map(entry => {
    const monthYear = entry.monthYear;

    // Aggregate income
    const actualRentIncome = aggregateGLEntriesForMonth(monthYear, ['4000']);
    const actualOtherIncome = aggregateGLEntriesForMonth(monthYear, ['4100', '4200']);

    // Aggregate expenses (note: expenses are debits, so they should be positive)
    const actualMaintenanceExpenses = Math.abs(aggregateGLEntriesForMonth(monthYear, ['5000']));
    const actualOperatingExpenses = Math.abs(aggregateGLEntriesForMonth(monthYear, ['5100', '5500']));
    const actualPropertyTaxInsurance = Math.abs(aggregateGLEntriesForMonth(monthYear, ['5200', '5300']));
    const actualManagementFees = Math.abs(aggregateGLEntriesForMonth(monthYear, ['5400']));

    // Calculate actual net
    const actualNet =
      Math.abs(actualRentIncome) +
      Math.abs(actualOtherIncome) -
      (actualMaintenanceExpenses +
        actualOperatingExpenses +
        actualPropertyTaxInsurance +
        actualManagementFees);

    // Calculate variance
    const variance = actualNet - entry.projectedNet;

    return {
      ...entry,
      actualRentIncome: Math.abs(actualRentIncome),
      actualOtherIncome: Math.abs(actualOtherIncome),
      actualMaintenanceExpenses,
      actualOperatingExpenses,
      actualPropertyTaxInsurance,
      actualManagementFees,
      actualNet,
      variance,
    };
  });

  return forecast;
}

export function saveCashflowForecast(forecast: CashflowForecast): void {
  // Recalculate projected and actual nets for each entry
  const updated: CashflowForecast = {
    ...forecast,
    entries: forecast.entries.map(entry => {
      const projectedNet =
        entry.projectedRentIncome +
        entry.projectedOtherIncome -
        (entry.projectedMaintenanceExpenses +
          entry.projectedOperatingExpenses +
          entry.projectedPropertyTaxInsurance +
          entry.projectedManagementFees);

      const actualNet =
        entry.actualRentIncome +
        entry.actualOtherIncome -
        (entry.actualMaintenanceExpenses +
          entry.actualOperatingExpenses +
          entry.actualPropertyTaxInsurance +
          entry.actualManagementFees);

      const variance = actualNet - projectedNet;

      return {
        ...entry,
        projectedNet,
        actualNet,
        variance,
      };
    }),
    lastUpdated: new Date().toISOString(),
  };

  saveToStorage('cashflowForecast', updated);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency in Ugandan Shillings
 */
export function formatUGX(amount: number): string {
  return `UGX ${amount.toLocaleString('en-UG')}`;
}

/**
 * Calculate payment status based on due date
 */
export function calculatePaymentStatus(nextPaymentDate: string): 'Paid' | 'Due' | 'Overdue' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(nextPaymentDate);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return 'Overdue';
  } else if (dueDate.getTime() === today.getTime()) {
    return 'Due';
  } else {
    return 'Paid';
  }
}

/**
 * Calculate next payment date (one month after base date)
 */
export function calculateNextPaymentDate(baseDateString: string): string {
  const baseDate = new Date(baseDateString);
  const nextDate = new Date(baseDate);
  nextDate.setMonth(nextDate.getMonth() + 1);

  // Handle month-end edge cases
  if (nextDate.getDate() !== baseDate.getDate()) {
    nextDate.setDate(0); // Set to last day of previous month
  }

  return nextDate.toISOString().split('T')[0];
}
