import { API_ENDPOINTS } from '@/config/api';
import { apiGet, apiPost, apiDelete } from '@/lib/api-client';
import type {
  InterviewSession,
  CreateSessionRequest,
  PaginatedResponse,
  SendMessageRequest,
  SendMessageResponse,
  SessionMessagesResponse,
  CompleteInterviewResponse,
  ResumeMarkdownPayload,
} from '@/types/api';

// Interview API Service
export const interviewApi = {
  // Get all interview sessions
  getSessions: async (params?: {
    status?: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<InterviewSession>> => {
    return apiGet<PaginatedResponse<InterviewSession>>(
      API_ENDPOINTS.INTERVIEW_SESSIONS,
      params as Record<string, string | number>
    );
  },

  // Create new interview session
  createSession: async (
    data?: CreateSessionRequest
  ): Promise<InterviewSession> => {
    return apiPost<InterviewSession, CreateSessionRequest>(
      API_ENDPOINTS.INTERVIEW_SESSIONS,
      data
    );
  },

  // Get specific session
  getSession: async (sessionId: string): Promise<InterviewSession> => {
    return apiGet<InterviewSession>(API_ENDPOINTS.INTERVIEW_SESSION(sessionId));
  },

  // Delete session
  deleteSession: async (sessionId: string): Promise<void> => {
    return apiDelete<void>(API_ENDPOINTS.INTERVIEW_SESSION(sessionId));
  },

  // Get session messages
  getMessages: async (sessionId: string): Promise<SessionMessagesResponse> => {
    return apiGet<SessionMessagesResponse>(
      API_ENDPOINTS.INTERVIEW_MESSAGES(sessionId)
    );
  },

  // Send message
  sendMessage: async (
    sessionId: string,
    data: SendMessageRequest
  ): Promise<SendMessageResponse> => {
    return apiPost<SendMessageResponse, SendMessageRequest>(
      API_ENDPOINTS.INTERVIEW_MESSAGES(sessionId),
      data
    );
  },

  // Complete interview
  completeInterview: async (
    sessionId: string
  ): Promise<CompleteInterviewResponse> => {
    return apiPost<CompleteInterviewResponse>(
      API_ENDPOINTS.INTERVIEW_COMPLETE(sessionId)
    );
  },

  // Get session resume markdown
  getSessionResume: async (
    sessionId: string
  ): Promise<ResumeMarkdownPayload> => {
    return apiGet<ResumeMarkdownPayload>(
      API_ENDPOINTS.INTERVIEW_SESSION_RESUME(sessionId)
    );
  },
};
