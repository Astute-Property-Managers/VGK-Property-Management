/**
 * Storage service with production API cutover.
 * - development: localStorage (for speed)
 * - production: backend state API (no local-only persistence)
 */
import { API_BASE_URL, API_ACCESS_TOKEN, APP_MODE } from './runtimeConfig';

const isProduction = APP_MODE === 'production';

function apiStateUrl(key: string): string {
  if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL is required for production storage operations.');
  return `${API_BASE_URL}/state/${encodeURIComponent(key)}`;
}

function requestSync(method: 'GET' | 'PUT' | 'DELETE', key: string, value?: string): string | null {
  const xhr = new XMLHttpRequest();
  xhr.open(method, apiStateUrl(key), false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', `Bearer ${API_ACCESS_TOKEN}`);
  xhr.send(method === 'PUT' ? JSON.stringify({ value: value ?? '' }) : null);

  if (xhr.status >= 200 && xhr.status < 300) {
    if (method === 'GET') {
      const payload = JSON.parse(xhr.responseText || '{}');
      return payload.value ?? null;
    }
    return null;
  }

  throw new Error(`State API ${method} failed with status ${xhr.status}`);
}

export function storageGetItem(key: string): string | null {
  if (isProduction) return requestSync('GET', key);
  return localStorage.getItem(key);
}

export function storageSetItem(key: string, value: string): void {
  if (isProduction) {
    requestSync('PUT', key, value);
    return;
  }
  localStorage.setItem(key, value);
}

export function storageRemoveItem(key: string): void {
  if (isProduction) {
    requestSync('DELETE', key);
    return;
  }
  localStorage.removeItem(key);
}

export function getStorageModeLabel(): string {
  return isProduction ? 'Backend API state storage' : 'Browser localStorage';
}
