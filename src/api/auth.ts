import { api } from './client';
import axios from 'axios';
import { User } from '@/types'; // Ensure User type is imported
import { z } from 'zod';

// ... schemas remain the same ...

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// Matches Doc: { access_token, refresh_token }
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  // Note: If your backend DOES NOT return the user object here, 
  // we might need to fetch it separately. I'm keeping it optional just in case.
  user?: User; 
}

export const login = async (data: LoginInput) => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterInput) => {
  // Some deployments expose auth under a versioned path (e.g. /v1/auth/register).
  // If an explicit API base URL is provided (VITE_API_URL or API_BASE_URL),
  // call the absolute /v1/auth/register path on that host to match backend.
  const rawApi: string | undefined = (import.meta as any).VITE_API_URL ?? (import.meta as any).API_BASE_URL;
  if (rawApi) {
    const base = String(rawApi).replace(/\/+$/g, '');
    const v1Base = base.endsWith('/v1') ? base : `${base}/v1`;
    const url = `${v1Base}/auth/register`;
    const response = await axios.post<any>(url, data);
    return response.data;
  }

  // Fallback: use the api client with the configured baseURL
  const response = await api.post<any>('/auth/register', data);
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await api.get<User>(`/users/${userId}`);
  return response.data;
};

// Helper to get user details if Login doesn't return them
export const getUserByEmail = async (email: string) => {
  const response = await api.get<User>(`/users?email=${email}`);
  return response.data;
};