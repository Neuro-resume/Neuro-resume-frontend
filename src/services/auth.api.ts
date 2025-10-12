import { API_ENDPOINTS } from '@/config/api';
import { apiPost } from '@/lib/api-client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenResponse,
} from '@/types/api';

// Auth API Service
export const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiPost<AuthResponse, LoginRequest>(
      API_ENDPOINTS.AUTH_LOGIN,
      credentials
    );
  },

  // Register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiPost<AuthResponse, RegisterRequest>(
      API_ENDPOINTS.AUTH_REGISTER,
      data
    );
  },

  // Logout
  logout: async (): Promise<void> => {
    return apiPost<void>(API_ENDPOINTS.AUTH_LOGOUT);
  },

  // Refresh token
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    return apiPost<RefreshTokenResponse>(API_ENDPOINTS.AUTH_REFRESH);
  },
};
