import { API_ENDPOINTS } from '@/config/api';
import { apiGet, apiPost, apiDownload } from '@/lib/api-client';
import type {
  Resume,
  PaginatedResponse,
  RegenerateResumeRequest,
} from '@/types/api';

// Resume API Service
export const resumeApi = {
  // Get all resumes
  getResumes: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<Resume>> => {
    // API для резюме уже возвращает правильный формат {items, total, limit, offset, has_more}
    return apiGet<PaginatedResponse<Resume>>(
      API_ENDPOINTS.RESUMES,
      params as Record<string, string | number>
    );
  },

  // Get specific resume
  getResume: async (resumeId: string): Promise<Resume> => {
    return apiGet<Resume>(API_ENDPOINTS.RESUME(resumeId));
  },

  // Download resume
  downloadResume: async (
    resumeId: string,
    format: 'pdf' | 'docx' | 'txt' = 'pdf'
  ): Promise<void> => {
    const filename = `resume_${resumeId}.${format}`;
    return apiDownload(
      API_ENDPOINTS.RESUME_DOWNLOAD(resumeId, format),
      filename
    );
  },

  // Regenerate resume
  regenerateResume: async (
    resumeId: string,
    data?: RegenerateResumeRequest
  ): Promise<Resume> => {
    return apiPost<Resume, RegenerateResumeRequest>(
      API_ENDPOINTS.RESUME_REGENERATE(resumeId),
      data
    );
  },
};
