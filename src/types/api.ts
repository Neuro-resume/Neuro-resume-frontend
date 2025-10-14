// API Types based on OpenAPI specification

// User Types (UserResponse schema)
export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expires_in: number;
}

export interface RefreshTokenResponse {
  token: string;
  user: User;
  expires_in: number;
}

// Interview Session Types (SessionResponse schema)
export interface InterviewProgress {
  percentage: number; // integer 0-100
}

export interface InterviewSession {
  id: string;
  user_id: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  progress: InterviewProgress;
  message_count: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  resume_markdown: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreateSessionRequest {
  // Empty object according to SessionCreate schema
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'ai';
  content: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface SendMessageRequest {
  content: string; // renamed from 'message' to 'content'
}

export interface SendMessageResponse {
  user_message: Message;
  ai_response: Message;
  progress: InterviewProgress;
}

export interface SessionMessagesResponse {
  session_id: string;
  messages: Message[];
}

export interface ResumeMarkdownPayload {
  content: string;
  filename: string;
  mime_type: string;
}

export interface CompleteInterviewResponse {
  session: InterviewSession;
  resume_markdown: ResumeMarkdownPayload;
}

// User Profile Update
export interface UpdateProfileRequest {
  username?: string | null;
  email?: string | null;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Error Types
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}
