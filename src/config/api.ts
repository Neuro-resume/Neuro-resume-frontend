// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/v1';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  TOKEN_EXPIRY: 'token_expiry',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',

  // Interview
  INTERVIEW_SESSIONS: '/interview/sessions',
  INTERVIEW_SESSION: (id: string) => `/interview/sessions/${id}`,
  INTERVIEW_MESSAGES: (id: string) => `/interview/sessions/${id}/messages`,
  INTERVIEW_COMPLETE: (id: string) => `/interview/sessions/${id}/complete`,
  INTERVIEW_SESSION_RESUME: (id: string) => `/interview/sessions/${id}/resume`,

  // Resume
  RESUMES: '/resumes',
  RESUME: (id: string) => `/resumes/${id}`,
  RESUME_DOWNLOAD: (id: string, format: string) =>
    `/resumes/${id}/download?format=${format}`,
  RESUME_REGENERATE: (id: string) => `/resumes/${id}/regenerate`,

  // User
  USER_PROFILE: '/user/profile',
  USER_CHANGE_PASSWORD: '/user/change-password',
} as const;
