// ============================================================================
// VGK Property Command - Formatting Utilities
// Format data for display (Ugandan context: UGX currency, local dates)
// ============================================================================

// ============================================================================
// CURRENCY FORMATTING (UGX)
// ============================================================================

export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return 'UGX 0';

  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return 'UGX 0';

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 1_000_000_000) {
    return `${sign}UGX ${(absAmount / 1_000_000_000).toFixed(1)}B`;
  } else if (absAmount >= 1_000_000) {
    return `${sign}UGX ${(absAmount / 1_000_000).toFixed(1)}M`;
  } else if (absAmount >= 1_000) {
    return `${sign}UGX ${(absAmount / 1_000).toFixed(1)}K`;
  }

  return formatCurrency(amount);
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

export function formatNumber(value: number, decimals: number = 0): string {
  if (typeof value !== 'number' || isNaN(value)) return '0';

  return new Intl.NumberFormat('en-UG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  if (typeof value !== 'number' || isNaN(value)) return '0%';

  return `${formatNumber(value, decimals)}%`;
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

export function formatDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsedDate);
}

export function formatDateLong(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-UG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsedDate);
}

export function formatDateTime(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsedDate);
}

export function formatRelativeDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - parsedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays === -1) return 'Tomorrow';
  if (diffDays > 0 && diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 0 && diffDays > -7) return `In ${Math.abs(diffDays)} days`;

  return formatDate(parsedDate);
}

export function getMonthName(monthStr: string): string {
  // Input: "2024-01" or "2024-1"
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);

  return new Intl.DateTimeFormat('en-UG', { month: 'long', year: 'numeric' }).format(date);
}

// ============================================================================
// PHONE NUMBER FORMATTING
// ============================================================================

export function formatPhoneNumber(phone: string): string {
  // Format +256XXXXXXXXX as +256 XXX XXX XXX
  if (phone.startsWith('+256') && phone.length === 13) {
    return `+256 ${phone.substring(4, 7)} ${phone.substring(7, 10)} ${phone.substring(10)}`;
  }

  return phone;
}

// ============================================================================
// TEXT FORMATTING
// ============================================================================

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

// ============================================================================
// STATUS FORMATTING
// ============================================================================

export function formatStatus(status: string): string {
  return status
    .split('-')
    .map((word) => capitalize(word))
    .join(' ');
}

// ============================================================================
// UNIT FORMATTING
// ============================================================================

export function formatSquareFeet(sqft: number): string {
  return `${formatNumber(sqft, 0)} sq ft`;
}

export function formatDuration(hours: number): string {
  if (hours < 24) {
    return `${formatNumber(hours, 1)} hours`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }

  return `${days}d ${Math.round(remainingHours)}h`;
}
