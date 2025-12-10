// ============================================================================
// VGK Property Command - Validation Utilities
// Security-first validation for Ugandan context
// ============================================================================

import { ValidationError } from '../types';

// ============================================================================
// INPUT SANITIZATION (XSS Prevention)
// ============================================================================

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ============================================================================
// UGANDAN PHONE NUMBER VALIDATION
// ============================================================================

export function validateUgandanPhone(phone: string): boolean {
  // Format: +256XXXXXXXXX (Uganda country code)
  const ugandanPhoneRegex = /^\+256[0-9]{9}$/;
  return ugandanPhoneRegex.test(phone);
}

export function formatUgandanPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Handle different input formats
  if (digits.startsWith('256')) {
    return `+${digits}`;
  } else if (digits.startsWith('0') && digits.length === 10) {
    return `+256${digits.substring(1)}`;
  } else if (digits.length === 9) {
    return `+256${digits}`;
  }

  return phone; // Return as-is if format unclear
}

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================================================
// DATE VALIDATION
// ============================================================================

export function validateDate(date: string): boolean {
  // ISO format: YYYY-MM-DD
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(date)) return false;

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

export function isDateInFuture(date: string): boolean {
  const targetDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return targetDate > today;
}

export function isDateInPast(date: string): boolean {
  const targetDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return targetDate < today;
}

// ============================================================================
// NUMERIC VALIDATION
// ============================================================================

export function validateNumber(value: number): boolean {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

export function validatePositiveNumber(value: number): boolean {
  return validateNumber(value) && value >= 0;
}

export function validatePercentage(value: number): boolean {
  return validateNumber(value) && value >= 0 && value <= 100;
}

// ============================================================================
// CURRENCY VALIDATION (UGX)
// ============================================================================

export function validateCurrency(amount: number): boolean {
  return validatePositiveNumber(amount) && amount < 1e15; // Reasonable upper limit
}

// ============================================================================
// COMPREHENSIVE VALIDATION FUNCTIONS
// ============================================================================

export function validateProperty(data: {
  name: string;
  address: string;
  totalUnits: number;
  squareFeet: number;
  purchasePrice: number;
  currentValue: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Property name must be at least 2 characters' });
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.push({ field: 'address', message: 'Address must be at least 5 characters' });
  }

  if (!validatePositiveNumber(data.totalUnits) || data.totalUnits < 1) {
    errors.push({ field: 'totalUnits', message: 'Total units must be at least 1' });
  }

  if (!validatePositiveNumber(data.squareFeet)) {
    errors.push({ field: 'squareFeet', message: 'Square feet must be a positive number' });
  }

  if (!validateCurrency(data.purchasePrice)) {
    errors.push({ field: 'purchasePrice', message: 'Invalid purchase price' });
  }

  if (!validateCurrency(data.currentValue)) {
    errors.push({ field: 'currentValue', message: 'Invalid current value' });
  }

  if (!validateCurrency(data.monthlyIncome)) {
    errors.push({ field: 'monthlyIncome', message: 'Invalid monthly income' });
  }

  if (!validateCurrency(data.monthlyExpenses)) {
    errors.push({ field: 'monthlyExpenses', message: 'Invalid monthly expenses' });
  }

  return errors;
}

export function validateTenant(data: {
  name: string;
  email: string;
  phone: string;
  unitNumber: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyRent: number;
  deposit: number;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Tenant name must be at least 2 characters' });
  }

  if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  if (!validateUgandanPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number (use +256XXXXXXXXX format)' });
  }

  if (!data.unitNumber || data.unitNumber.trim().length < 1) {
    errors.push({ field: 'unitNumber', message: 'Unit number is required' });
  }

  if (!validateDate(data.leaseStartDate)) {
    errors.push({ field: 'leaseStartDate', message: 'Invalid lease start date' });
  }

  if (!validateDate(data.leaseEndDate)) {
    errors.push({ field: 'leaseEndDate', message: 'Invalid lease end date' });
  }

  if (validateDate(data.leaseStartDate) && validateDate(data.leaseEndDate)) {
    if (new Date(data.leaseEndDate) <= new Date(data.leaseStartDate)) {
      errors.push({ field: 'leaseEndDate', message: 'Lease end date must be after start date' });
    }
  }

  if (!validateCurrency(data.monthlyRent) || data.monthlyRent < 1) {
    errors.push({ field: 'monthlyRent', message: 'Monthly rent must be greater than 0' });
  }

  if (!validateCurrency(data.deposit)) {
    errors.push({ field: 'deposit', message: 'Invalid deposit amount' });
  }

  return errors;
}

export function validateVendor(data: {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Vendor name must be at least 2 characters' });
  }

  if (!data.contactPerson || data.contactPerson.trim().length < 2) {
    errors.push({ field: 'contactPerson', message: 'Contact person name must be at least 2 characters' });
  }

  if (!validateUgandanPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number (use +256XXXXXXXXX format)' });
  }

  if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.push({ field: 'address', message: 'Address must be at least 5 characters' });
  }

  return errors;
}

export function validateAccount(data: {
  code: string;
  name: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.code || !/^\d{4,}$/.test(data.code)) {
    errors.push({ field: 'code', message: 'Account code must be at least 4 digits' });
  }

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Account name must be at least 2 characters' });
  }

  return errors;
}
