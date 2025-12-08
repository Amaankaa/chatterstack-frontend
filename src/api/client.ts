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

// Helper to choose the right header based on base URL
function authHeader(baseURL: string | undefined, token: string) {
  const isCF = baseURL && /cloudfront\.net/i.test(baseURL);
  // CloudFront expects raw token in X-Auth-Token; others expect Bearer in Authorization
  return isCF ? { 'X-Auth-Token': token } : { Authorization: 'Bearer ' + token };
}

// Attach token to every request, except for public endpoints
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  // List of public endpoints that should not receive the Authorization header
  const publicEndpoints = ['/auth/login', '/auth/register'];
  const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

  if (token && !isPublic) {
    const headers = authHeader(config.baseURL, token);
    config.headers = { ...config.headers, ...headers } as any;
    
    // Explicitly remove Authorization if we are using X-Auth-Token to avoid conflicts
    if (headers['X-Auth-Token']) {
      delete config.headers.Authorization;
    }
  }
  return config;
});