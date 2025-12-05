import axios from 'axios';

// Use absolute API base from environment across all environments
// Expect `VITE_API_URL` to be an absolute URL like
const envBase = (import.meta as any)?.env?.VITE_API_URL
  || process.env.VITE_API_URL
  || process.env.API_BASE_URL;

if (!envBase) {
  console.warn('[api] VITE_API_URL is not set. Please configure an absolute API base URL.');
}

export const api = axios.create({
  baseURL: envBase,
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