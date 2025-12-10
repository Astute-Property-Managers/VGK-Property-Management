// ============================================================================
// VGK Property Command - Data Service
// Centralized data management with localStorage (swap to API when ready)
// ============================================================================

import {
  OnePageStrategicPlan,
  Rock,
  KPI,
  CriticalNumber,
  HuddleEntry,
  Property,
  Tenant,
  PaymentRecord,
  MaintenanceRequest,
  Vendor,
  Account,
  GeneralLedgerEntry,
  CashflowEntry,
} from '../types';
import { storage } from './storage.service';
import {
  initialOPSP,
  initialRocks,
  initialKPIs,
  initialCriticalNumbers,
  initialProperties,
  initialTenants,
  initialVendors,
  initialAccounts,
} from '../constants/initialData';
import { generateId, getNowISO, getTodayISO } from '../utils/helpers';
import { sanitizeInput } from '../utils/validation';

// ============================================================================
// STORAGE KEYS
// ============================================================================

const KEYS = {
  OPSP: 'vgk_opsp',
  ROCKS: 'vgk_rocks',
  KPIS: 'vgk_kpis',
  CRITICAL_NUMBERS: 'vgk_critical_numbers',
  HUDDLES: 'vgk_huddles',
  PROPERTIES: 'vgk_properties',
  TENANTS: 'vgk_tenants',
  PAYMENTS: 'vgk_payments',
  MAINTENANCE: 'vgk_maintenance',
  VENDORS: 'vgk_vendors',
  ACCOUNTS: 'vgk_accounts',
  LEDGER_ENTRIES: 'vgk_ledger_entries',
  CASHFLOW_ENTRIES: 'vgk_cashflow_entries',
  INITIALIZED: 'vgk_initialized',
};

// ============================================================================
// DATA SERVICE CLASS
// ============================================================================

class DataService {
  constructor() {
    this.initialize();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  private initialize(): void {
    const isInitialized = storage.get<boolean>(KEYS.INITIALIZED);

    if (!isInitialized) {
      // First time setup - load demo data
      storage.set(KEYS.OPSP, initialOPSP);
      storage.set(KEYS.ROCKS, initialRocks);
      storage.set(KEYS.KPIS, initialKPIs);
      storage.set(KEYS.CRITICAL_NUMBERS, initialCriticalNumbers);
      storage.set(KEYS.HUDDLES, []);
      storage.set(KEYS.PROPERTIES, initialProperties);
      storage.set(KEYS.TENANTS, initialTenants);
      storage.set(KEYS.PAYMENTS, []);
      storage.set(KEYS.MAINTENANCE, []);
      storage.set(KEYS.VENDORS, initialVendors);
      storage.set(KEYS.ACCOUNTS, initialAccounts);
      storage.set(KEYS.LEDGER_ENTRIES, []);
      storage.set(KEYS.CASHFLOW_ENTRIES, []);
      storage.set(KEYS.INITIALIZED, true);
    }
  }

  resetAllData(): void {
    storage.clear();
    this.initialize();
  }

  // ==========================================================================
  // STRATEGIC PLANNING - OPSP
  // ==========================================================================

  getOPSP(): OnePageStrategicPlan | null {
    return storage.get<OnePageStrategicPlan>(KEYS.OPSP);
  }

  updateOPSP(opsp: Partial<OnePageStrategicPlan>): OnePageStrategicPlan | null {
    const current = this.getOPSP();
    if (!current) return null;

    const updated = {
      ...current,
      ...opsp,
      lastUpdated: getTodayISO(),
    };

    storage.set(KEYS.OPSP, updated);
    return updated;
  }

  // ==========================================================================
  // STRATEGIC PLANNING - ROCKS
  // ==========================================================================

  getAllRocks(): Rock[] {
    return storage.get<Rock[]>(KEYS.ROCKS) || [];
  }

  getRockById(id: string): Rock | null {
    const rocks = this.getAllRocks();
    return rocks.find((r) => r.id === id) || null;
  }

  createRock(data: Omit<Rock, 'id' | 'createdAt'>): Rock {
    const rock: Rock = {
      ...data,
      id: generateId('rock'),
      createdAt: getNowISO(),
      description: sanitizeInput(data.description),
      owner: sanitizeInput(data.owner),
    };

    const rocks = this.getAllRocks();
    rocks.push(rock);
    storage.set(KEYS.ROCKS, rocks);

    return rock;
  }

  updateRock(id: string, updates: Partial<Rock>): Rock | null {
    const rocks = this.getAllRocks();
    const index = rocks.findIndex((r) => r.id === id);

    if (index === -1) return null;

    rocks[index] = {
      ...rocks[index],
      ...updates,
      id,
      description: updates.description
        ? sanitizeInput(updates.description)
        : rocks[index].description,
      owner: updates.owner ? sanitizeInput(updates.owner) : rocks[index].owner,
    };

    if (updates.status === 'on-track' && rocks[index].progress === 100) {
      rocks[index].completedAt = getNowISO();
    }

    storage.set(KEYS.ROCKS, rocks);
    return rocks[index];
  }

  deleteRock(id: string): boolean {
    const rocks = this.getAllRocks();
    const filtered = rocks.filter((r) => r.id !== id);

    if (filtered.length === rocks.length) return false;

    storage.set(KEYS.ROCKS, filtered);
    return true;
  }

  // ==========================================================================
  // STRATEGIC PLANNING - KPIs
  // ==========================================================================

  getAllKPIs(): KPI[] {
    return storage.get<KPI[]>(KEYS.KPIS) || [];
  }

  getKPIById(id: string): KPI | null {
    const kpis = this.getAllKPIs();
    return kpis.find((k) => k.id === id) || null;
  }

  updateKPI(id: string, updates: Partial<KPI>): KPI | null {
    const kpis = this.getAllKPIs();
    const index = kpis.findIndex((k) => k.id === id);

    if (index === -1) return null;

    kpis[index] = {
      ...kpis[index],
      ...updates,
      id,
      lastUpdated: getTodayISO(),
    };

    storage.set(KEYS.KPIS, kpis);
    return kpis[index];
  }

  // ==========================================================================
  // STRATEGIC PLANNING - CRITICAL NUMBERS
  // ==========================================================================

  getAllCriticalNumbers(): CriticalNumber[] {
    return storage.get<CriticalNumber[]>(KEYS.CRITICAL_NUMBERS) || [];
  }

  updateCriticalNumber(id: string, value: number): CriticalNumber | null {
    const numbers = this.getAllCriticalNumbers();
    const index = numbers.findIndex((n) => n.id === id);

    if (index === -1) return null;

    numbers[index].history.push({
      date: getTodayISO(),
      value,
    });

    numbers[index].currentValue = value;
    numbers[index].lastUpdated = getTodayISO();

    storage.set(KEYS.CRITICAL_NUMBERS, numbers);
    return numbers[index];
  }

  // ==========================================================================
  // STRATEGIC PLANNING - HUDDLES
  // ==========================================================================

  getAllHuddles(): HuddleEntry[] {
    return storage.get<HuddleEntry[]>(KEYS.HUDDLES) || [];
  }

  createHuddle(data: Omit<HuddleEntry, 'id' | 'createdAt'>): HuddleEntry {
    const huddle: HuddleEntry = {
      ...data,
      id: generateId('huddle'),
      createdAt: getNowISO(),
      notes: sanitizeInput(data.notes),
      wins: data.wins.map(sanitizeInput),
      stucks: data.stucks.map(sanitizeInput),
      priorities: data.priorities.map(sanitizeInput),
    };

    const huddles = this.getAllHuddles();
    huddles.push(huddle);
    storage.set(KEYS.HUDDLES, huddles);

    return huddle;
  }

  // ==========================================================================
  // PROPERTIES
  // ==========================================================================

  getAllProperties(): Property[] {
    return storage.get<Property[]>(KEYS.PROPERTIES) || [];
  }

  getPropertyById(id: string): Property | null {
    const properties = this.getAllProperties();
    return properties.find((p) => p.id === id) || null;
  }

  createProperty(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property {
    const property: Property = {
      ...data,
      id: generateId('prop'),
      name: sanitizeInput(data.name),
      address: sanitizeInput(data.address),
      notes: sanitizeInput(data.notes),
      createdAt: getNowISO(),
      updatedAt: getNowISO(),
    };

    const properties = this.getAllProperties();
    properties.push(property);
    storage.set(KEYS.PROPERTIES, properties);

    return property;
  }

  updateProperty(id: string, updates: Partial<Property>): Property | null {
    const properties = this.getAllProperties();
    const index = properties.findIndex((p) => p.id === id);

    if (index === -1) return null;

    properties[index] = {
      ...properties[index],
      ...updates,
      id,
      updatedAt: getNowISO(),
      name: updates.name ? sanitizeInput(updates.name) : properties[index].name,
      address: updates.address ? sanitizeInput(updates.address) : properties[index].address,
      notes: updates.notes !== undefined ? sanitizeInput(updates.notes) : properties[index].notes,
    };

    storage.set(KEYS.PROPERTIES, properties);
    return properties[index];
  }

  deleteProperty(id: string): boolean {
    const properties = this.getAllProperties();
    const filtered = properties.filter((p) => p.id !== id);

    if (filtered.length === properties.length) return false;

    storage.set(KEYS.PROPERTIES, filtered);
    return true;
  }

  // ==========================================================================
  // TENANTS
  // ==========================================================================

  getAllTenants(): Tenant[] {
    return storage.get<Tenant[]>(KEYS.TENANTS) || [];
  }

  getTenantById(id: string): Tenant | null {
    const tenants = this.getAllTenants();
    return tenants.find((t) => t.id === id) || null;
  }

  getTenantsByProperty(propertyId: string): Tenant[] {
    return this.getAllTenants().filter((t) => t.propertyId === propertyId);
  }

  createTenant(data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Tenant {
    const tenant: Tenant = {
      ...data,
      id: generateId('tenant'),
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      unitNumber: sanitizeInput(data.unitNumber),
      notes: sanitizeInput(data.notes),
      createdAt: getNowISO(),
      updatedAt: getNowISO(),
    };

    const tenants = this.getAllTenants();
    tenants.push(tenant);
    storage.set(KEYS.TENANTS, tenants);

    return tenant;
  }

  updateTenant(id: string, updates: Partial<Tenant>): Tenant | null {
    const tenants = this.getAllTenants();
    const index = tenants.findIndex((t) => t.id === id);

    if (index === -1) return null;

    tenants[index] = {
      ...tenants[index],
      ...updates,
      id,
      updatedAt: getNowISO(),
    };

    storage.set(KEYS.TENANTS, tenants);
    return tenants[index];
  }

  deleteTenant(id: string): boolean {
    const tenants = this.getAllTenants();
    const filtered = tenants.filter((t) => t.id !== id);

    if (filtered.length === tenants.length) return false;

    storage.set(KEYS.TENANTS, filtered);
    return true;
  }

  // ==========================================================================
  // PAYMENTS
  // ==========================================================================

  getAllPayments(): PaymentRecord[] {
    return storage.get<PaymentRecord[]>(KEYS.PAYMENTS) || [];
  }

  getPaymentsByTenant(tenantId: string): PaymentRecord[] {
    return this.getAllPayments().filter((p) => p.tenantId === tenantId);
  }

  createPayment(data: Omit<PaymentRecord, 'id' | 'createdAt'>): PaymentRecord {
    const payment: PaymentRecord = {
      ...data,
      id: generateId('payment'),
      reference: sanitizeInput(data.reference),
      notes: sanitizeInput(data.notes),
      createdAt: getNowISO(),
    };

    const payments = this.getAllPayments();
    payments.push(payment);
    storage.set(KEYS.PAYMENTS, payments);

    // Update tenant payment status
    const tenant = this.getTenantById(data.tenantId);
    if (tenant) {
      this.updateTenant(tenant.id, {
        lastPaymentDate: data.paymentDate,
        lastPaymentAmount: data.amount,
        outstandingBalance: Math.max(0, tenant.outstandingBalance - data.amount),
      });
    }

    // Create GL entry
    this.createGLEntryForPayment(payment);

    return payment;
  }

  // ==========================================================================
  // MAINTENANCE
  // ==========================================================================

  getAllMaintenanceRequests(): MaintenanceRequest[] {
    return storage.get<MaintenanceRequest[]>(KEYS.MAINTENANCE) || [];
  }

  getMaintenanceByProperty(propertyId: string): MaintenanceRequest[] {
    return this.getAllMaintenanceRequests().filter((m) => m.propertyId === propertyId);
  }

  createMaintenanceRequest(
    data: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>
  ): MaintenanceRequest {
    const request: MaintenanceRequest = {
      ...data,
      id: generateId('maint'),
      description: sanitizeInput(data.description),
      notes: sanitizeInput(data.notes),
      createdAt: getNowISO(),
      updatedAt: getNowISO(),
    };

    const requests = this.getAllMaintenanceRequests();
    requests.push(request);
    storage.set(KEYS.MAINTENANCE, requests);

    return request;
  }

  updateMaintenanceRequest(id: string, updates: Partial<MaintenanceRequest>): MaintenanceRequest | null {
    const requests = this.getAllMaintenanceRequests();
    const index = requests.findIndex((m) => m.id === id);

    if (index === -1) return null;

    requests[index] = {
      ...requests[index],
      ...updates,
      id,
      updatedAt: getNowISO(),
    };

    // Calculate response time if completed
    if (updates.status === 'completed' && updates.completedDate && !requests[index].responseTime) {
      const reported = new Date(requests[index].reportedDate);
      const completed = new Date(updates.completedDate);
      const diffMs = completed.getTime() - reported.getTime();
      requests[index].responseTime = diffMs / (1000 * 60 * 60); // Convert to hours
    }

    storage.set(KEYS.MAINTENANCE, requests);

    // Create GL entry if actual cost is recorded
    if (updates.actualCost && updates.actualCost > 0 && !requests[index].glEntryId) {
      this.createGLEntryForMaintenance(requests[index]);
    }

    return requests[index];
  }

  // ==========================================================================
  // VENDORS
  // ==========================================================================

  getAllVendors(): Vendor[] {
    return storage.get<Vendor[]>(KEYS.VENDORS) || [];
  }

  getVendorById(id: string): Vendor | null {
    const vendors = this.getAllVendors();
    return vendors.find((v) => v.id === id) || null;
  }

  createVendor(data: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Vendor {
    const vendor: Vendor = {
      ...data,
      id: generateId('vendor'),
      name: sanitizeInput(data.name),
      contactPerson: sanitizeInput(data.contactPerson),
      address: sanitizeInput(data.address),
      notes: sanitizeInput(data.notes),
      createdAt: getNowISO(),
      updatedAt: getNowISO(),
    };

    const vendors = this.getAllVendors();
    vendors.push(vendor);
    storage.set(KEYS.VENDORS, vendors);

    return vendor;
  }

  updateVendor(id: string, updates: Partial<Vendor>): Vendor | null {
    const vendors = this.getAllVendors();
    const index = vendors.findIndex((v) => v.id === id);

    if (index === -1) return null;

    vendors[index] = {
      ...vendors[index],
      ...updates,
      id,
      updatedAt: getNowISO(),
    };

    storage.set(KEYS.VENDORS, vendors);
    return vendors[index];
  }

  deleteVendor(id: string): boolean {
    const vendors = this.getAllVendors();
    const filtered = vendors.filter((v) => v.id !== id);

    if (filtered.length === vendors.length) return false;

    storage.set(KEYS.VENDORS, filtered);
    return true;
  }

  // ==========================================================================
  // CHART OF ACCOUNTS
  // ==========================================================================

  getAllAccounts(): Account[] {
    return storage.get<Account[]>(KEYS.ACCOUNTS) || [];
  }

  getAccountById(id: string): Account | null {
    const accounts = this.getAllAccounts();
    return accounts.find((a) => a.id === id) || null;
  }

  createAccount(data: Omit<Account, 'id' | 'currentBalance' | 'createdAt' | 'updatedAt'>): Account {
    const account: Account = {
      ...data,
      id: generateId('acc'),
      currentBalance: 0,
      code: sanitizeInput(data.code),
      name: sanitizeInput(data.name),
      createdAt: getNowISO(),
      updatedAt: getNowISO(),
    };

    const accounts = this.getAllAccounts();
    accounts.push(account);
    storage.set(KEYS.ACCOUNTS, accounts);

    return account;
  }

  // ==========================================================================
  // GENERAL LEDGER
  // ==========================================================================

  getAllLedgerEntries(): GeneralLedgerEntry[] {
    return storage.get<GeneralLedgerEntry[]>(KEYS.LEDGER_ENTRIES) || [];
  }

  getLedgerEntriesByAccount(accountId: string): GeneralLedgerEntry[] {
    return this.getAllLedgerEntries().filter((e) => e.accountId === accountId && !e.isReversed);
  }

  createLedgerEntry(data: Omit<GeneralLedgerEntry, 'id' | 'createdAt' | 'isReversed'>): GeneralLedgerEntry {
    const entry: GeneralLedgerEntry = {
      ...data,
      id: generateId('gl'),
      description: sanitizeInput(data.description),
      createdAt: getNowISO(),
      isReversed: false,
    };

    const entries = this.getAllLedgerEntries();
    entries.push(entry);
    storage.set(KEYS.LEDGER_ENTRIES, entries);

    // Update account balance
    this.updateAccountBalance(data.accountId);

    return entry;
  }

  private updateAccountBalance(accountId: string): void {
    const account = this.getAccountById(accountId);
    if (!account) return;

    const entries = this.getLedgerEntriesByAccount(accountId);
    const totalDebits = entries.reduce((sum, e) => sum + e.debit, 0);
    const totalCredits = entries.reduce((sum, e) => sum + e.credit, 0);

    const newBalance =
      account.normalBalance === 'debit' ? totalDebits - totalCredits : totalCredits - totalDebits;

    const accounts = this.getAllAccounts();
    const index = accounts.findIndex((a) => a.id === accountId);
    if (index !== -1) {
      accounts[index].currentBalance = newBalance;
      accounts[index].updatedAt = getNowISO();
      storage.set(KEYS.ACCOUNTS, accounts);
    }
  }

  private createGLEntryForPayment(payment: PaymentRecord): void {
    // Debit: Cash (increase asset)
    this.createLedgerEntry({
      date: payment.paymentDate,
      accountId: 'acc_1000', // Cash and Cash Equivalents
      debit: payment.amount,
      credit: 0,
      description: `Rent payment from tenant - ${payment.reference}`,
      reference: payment.id,
      sourceType: 'payment',
      sourceId: payment.id,
      createdBy: payment.recordedBy,
    });

    // Credit: Rental Income (increase income)
    this.createLedgerEntry({
      date: payment.paymentDate,
      accountId: 'acc_4000', // Rental Income
      debit: 0,
      credit: payment.amount,
      description: `Rent payment from tenant - ${payment.reference}`,
      reference: payment.id,
      sourceType: 'payment',
      sourceId: payment.id,
      createdBy: payment.recordedBy,
    });
  }

  private createGLEntryForMaintenance(request: MaintenanceRequest): void {
    // Debit: Maintenance Expense (increase expense)
    this.createLedgerEntry({
      date: request.completedDate || getTodayISO(),
      accountId: 'acc_5000', // Maintenance and Repairs
      debit: request.actualCost,
      credit: 0,
      description: `Maintenance: ${request.description}`,
      reference: request.id,
      sourceType: 'maintenance',
      sourceId: request.id,
      createdBy: 'system',
    });

    // Credit: Cash (decrease asset)
    this.createLedgerEntry({
      date: request.completedDate || getTodayISO(),
      accountId: 'acc_1000', // Cash and Cash Equivalents
      debit: 0,
      credit: request.actualCost,
      description: `Maintenance: ${request.description}`,
      reference: request.id,
      sourceType: 'maintenance',
      sourceId: request.id,
      createdBy: 'system',
    });
  }

  // ==========================================================================
  // CASHFLOW
  // ==========================================================================

  getAllCashflowEntries(): CashflowEntry[] {
    return storage.get<CashflowEntry[]>(KEYS.CASHFLOW_ENTRIES) || [];
  }

  getCashflowByMonth(month: string): CashflowEntry[] {
    return this.getAllCashflowEntries().filter((e) => e.month === month);
  }
}

export const dataService = new DataService();
