/**
 * Client-side observability helper.
 * In production this should be wired to your centralized logging/SIEM.
 */

import { APP_MODE } from './runtimeConfig';

interface LogPayload {
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, unknown>;
}

export function logEvent(payload: LogPayload): void {
  const enriched = {
    ...payload,
    timestamp: new Date().toISOString(),
    path: typeof window !== 'undefined' ? window.location.pathname : 'n/a',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a',
  };

  if (payload.level === 'error') {
    console.error('[Altus]', enriched);
  } else if (payload.level === 'warn') {
    console.warn('[Altus]', enriched);
  } else {
    console.info('[Altus]', enriched);
  }

  // Placeholder for enterprise logging sink.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  APP_MODE === 'production';
}
