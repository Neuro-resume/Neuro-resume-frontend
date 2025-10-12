import { API_ENDPOINTS } from '@/config/api';
import { apiGet, apiPatch, apiPost } from '@/lib/api-client';
import type {
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@/types/api';

// User API Service
export const userApi = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    return apiGet<User>(API_ENDPOINTS.USER_PROFILE);
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    return apiPatch<User, UpdateProfileRequest>(
      API_ENDPOINTS.USER_PROFILE,
      data
    );
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return apiPost<void, ChangePasswordRequest>(
      API_ENDPOINTS.USER_CHANGE_PASSWORD,
      data
    );
  },
};
