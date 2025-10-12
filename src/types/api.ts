// API Types based on OpenAPI specification

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
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
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

// Interview Session Types
export interface InterviewProgress {
  percentage: number;
  completedSections: string[];
  currentSection: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  language: 'ru' | 'en';
  progress: InterviewProgress;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateSessionRequest {
  language?: 'ru' | 'en';
}

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'ai';
  content: string;
  metadata?: {
    extractedData?: Record<string, unknown>;
  } | null;
  createdAt: string;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  userMessage: Message;
  aiResponse: Message;
  progress: InterviewProgress;
}

export interface SessionMessagesResponse {
  sessionId: string;
  messages: Message[];
}

export interface CompleteInterviewResponse {
  session: InterviewSession;
  resumeId: string;
}

// Resume Types
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  links?: Array<{
    type: string;
    url: string;
  }>;
}

export interface WorkExperience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: number | null;
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages?: Array<{
    language: string;
    level: string;
  }>;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string | null;
  credentialId?: string | null;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string | null;
  startDate: string;
  endDate?: string | null;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skills;
  certifications?: Certification[];
  projects?: Project[];
}

export interface Resume {
  id: string;
  userId: string;
  sessionId: string;
  title: string;
  template: 'modern' | 'classic' | 'minimal' | 'creative';
  language: 'ru' | 'en';
  data: ResumeData;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegenerateResumeRequest {
  template?: string;
  language?: string;
}

// Pagination
export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  items: T[]; // Бэкенд возвращает items, а не data
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

// User Profile Update
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
