/**
 * Browser storage service.
 *
 * The application runs in the browser and persists data to localStorage.
 * For enterprise/production deployments, replace this adapter with an API-backed implementation.
 */

export function storageGetItem(key: string): string | null {
  return localStorage.getItem(key);
}

export function storageSetItem(key: string, value: string): void {
  localStorage.setItem(key, value);
}

export function storageRemoveItem(key: string): void {
  localStorage.removeItem(key);
}

export function getStorageModeLabel(): string {
  return 'Browser localStorage';
}
