import axios from 'axios';

// Resolve API base URL with a few fallbacks:
// 1. VITE_API_URL (preferred for Vite builds via import.meta.env)
// 2. API_BASE_URL (infra-provided)
// 3. process.env (fallback for non-Vite environments)
// 4. Fallback to the dev proxy path '/v1'
const meta: any = import.meta as any;
let rawApi: string | undefined;
if (meta && meta.env) {
  rawApi = meta.env.VITE_API_URL ?? meta.env.API_BASE_URL;
} else if (typeof process !== 'undefined' && process.env) {
  rawApi = process.env.VITE_API_URL ?? process.env.API_BASE_URL;
}

let resolvedBase = '/v1';
if (rawApi) {
  const s = String(rawApi).replace(/\/+$/g, '');
  // If the provided URL already ends with /v1, use as-is, otherwise append /v1
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