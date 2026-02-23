/**
 * Runtime configuration and enterprise guardrails.
 *
 * These checks keep production deployments explicit and avoid silently
 * running in insecure demo defaults.
 */

const rawMode = import.meta.env.VITE_APP_MODE;
const rawApiBase = import.meta.env.VITE_API_BASE_URL;

export const APP_MODE = rawMode === 'production' ? 'production' : 'development';
export const API_BASE_URL = rawApiBase?.trim() || '';

export function assertEnterpriseRuntimeConfiguration(): void {
  if (APP_MODE === 'production' && !API_BASE_URL) {
    throw new Error(
      'Missing VITE_API_BASE_URL for production mode. Configure a secure backend API endpoint before deployment.'
    );
  }
}
