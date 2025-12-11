/**
 * Security Service - XSS Prevention & Input Sanitization
 * Implements core secure coding principles for VGK Property Command
 */

/**
 * Sanitizes HTML by escaping special characters to prevent XSS attacks
 * @param input - The string to sanitize
 * @returns Sanitized string with HTML entities escaped
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Sanitizes an object's string properties
 * @param obj - Object to sanitize
 * @param fields - Array of field names to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const sanitized = { ...obj };

  for (const field of fields) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeHtml(sanitized[field] as string) as T[keyof T];
    }
  }

  return sanitized;
}

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates Ugandan phone number format
 * @param phone - Phone number to validate
 * @returns True if valid format (+256 7XX XXX XXX)
 */
export function isValidUgandanPhone(phone: string): boolean {
  // Accepts: +256 700 123 456, +256700123456, 0700123456, 700123456
  const phoneRegex = /^(\+256|0)?7\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validates numeric input
 * @param value - Value to validate
 * @returns True if valid number
 */
export function isValidNumber(value: unknown): boolean {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  }
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  }
  return false;
}

/**
 * Validates date format (YYYY-MM-DD)
 * @param date - Date string to validate
 * @returns True if valid date
 */
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

/**
 * Security notice for localStorage usage
 */
export const SECURITY_NOTICE = `
⚠️ SECURITY NOTICE: This application uses localStorage for demonstration purposes.
For production use with sensitive financial data:
1. Implement a secure backend with proper authentication
2. Use HTTPS for all communications
3. Encrypt sensitive data at rest and in transit
4. Implement proper access controls and audit logging
5. Comply with Uganda Data Protection and Privacy Act
6. Regular security audits and penetration testing
`;
