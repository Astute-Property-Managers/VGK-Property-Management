import { API_BASE_URL } from './runtimeConfig';
import { clearSession, setSession } from './sessionService';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: 'admin' | 'manager' | 'operator' | 'auditor';
  };
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Login failed');
  }

  const payload = (await response.json()) as LoginResponse;
  setSession(payload.token, payload.user);
  return payload;
}

export async function logout(): Promise<void> {
  const token = localStorage.getItem('altus_access_token');
  if (token) {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }
  clearSession();
}
