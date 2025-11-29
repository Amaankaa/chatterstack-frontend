import axios from 'axios';

// Resolve API base URL with a few fallbacks:
// 1. VITE_API_URL (preferred for Vite builds)
// 2. API_BASE_URL (suggested runtime name from infra)
// 3. Fallback to the dev proxy path '/v1'
const rawApi: string | undefined = (import.meta as any).VITE_API_URL ?? (import.meta as any).API_BASE_URL;
let resolvedBase = '/v1';
if (rawApi) {
  const s = String(rawApi).replace(/\/+$/g, '');
  resolvedBase = s.endsWith('/v1') ? s : `${s}/v1`;
}

export const api = axios.create({
  baseURL: resolvedBase,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});