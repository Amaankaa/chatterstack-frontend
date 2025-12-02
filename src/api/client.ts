import axios from 'axios';

// Resolve API base URL with a few fallbacks:
// 1. VITE_API_URL (preferred for Vite builds via import.meta.env)
// 2. API_BASE_URL (infra-provided)
// 3. process.env (fallback for non-Vite environments)
// 4. Fallback to the dev proxy path '/v1'
// Use relative path /v1 so requests are proxied by Vercel (production) or Vite (development)
const resolvedBase = '/v1';

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