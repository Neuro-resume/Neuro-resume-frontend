import { API_CONFIG, STORAGE_KEYS } from '@/config/api';
import type { ApiError } from '@/types/api';

// Custom error class for API errors
export class ApiException extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Array<{ field: string; message: string }>,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// Get auth token from storage
function getAuthToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

// Check if token is expired
export function isTokenExpired(): boolean {
  const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
  if (!expiry) return true;
  return new Date().getTime() > parseInt(expiry, 10);
}

// Set auth token
export function setAuthToken(token: string, expiresIn: number): void {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  const expiryTime = new Date().getTime() + expiresIn * 1000;
  localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
  console.log(
    'Токен сохранён в localStorage. Истекает:',
    new Date(expiryTime).toLocaleString()
  );
}

// Clear auth token
export function clearAuthToken(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  console.log('Токен и данные пользователя удалены из localStorage');
}

// Base fetch wrapper with authentication and error handling
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const url = `${API_CONFIG.baseURL}${endpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 204 No Content - no response body expected
    if (response.status === 204) {
      return undefined as T;
    }

    // Handle non-JSON responses (like file downloads)
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new ApiException(
          'HTTP_ERROR',
          `HTTP error! status: ${response.status}`,
          undefined,
          response.status
        );
      }
      return response as T;
    }

    // Parse JSON response
    let data;
    try {
      const text = await response.text();
      // Если ответ пустой (например, 204), возвращаем undefined
      if (!text || text.trim() === '') {
        if (!response.ok) {
          throw new ApiException(
            'HTTP_ERROR',
            `HTTP error! status: ${response.status}`,
            undefined,
            response.status
          );
        }
        return undefined as T;
      }
      data = JSON.parse(text);
      console.log(`API Response [${endpoint}]:`, data);
    } catch {
      // Если не удалось распарсить JSON
      if (!response.ok) {
        throw new ApiException(
          'HTTP_ERROR',
          `HTTP error! status: ${response.status}`,
          undefined,
          response.status
        );
      }
      throw new ApiException('PARSE_ERROR', 'Failed to parse response as JSON');
    }

    if (!response.ok) {
      // Проверяем, есть ли структурированная ошибка API
      if (data && typeof data === 'object') {
        // Backend может вернуть { "detail": { "error": {...} } }
        if (
          'detail' in data &&
          data.detail &&
          typeof data.detail === 'object' &&
          'error' in data.detail
        ) {
          const error = data.detail as ApiError;
          throw new ApiException(
            error.error.code,
            error.error.message,
            error.error.details,
            response.status
          );
        }
        // Или напрямую { "error": {...} }
        else if (
          'error' in data &&
          data.error &&
          typeof data.error === 'object'
        ) {
          const error = data as ApiError;
          throw new ApiException(
            error.error.code,
            error.error.message,
            error.error.details,
            response.status
          );
        }
        // FastAPI validation error format { "detail": "string" }
        else if ('detail' in data) {
          const detail = data.detail;
          if (typeof detail === 'string') {
            throw new ApiException(
              'HTTP_ERROR',
              detail,
              undefined,
              response.status
            );
          } else if (Array.isArray(detail)) {
            // FastAPI validation error array
            const details = detail.map(
              (err: { loc?: string[]; msg?: string }) => ({
                field: err.loc?.join('.') || 'unknown',
                message: err.msg || 'Validation error',
              })
            );
            throw new ApiException(
              'VALIDATION_ERROR',
              'Validation failed',
              details,
              response.status
            );
          }
        } else if ('message' in data) {
          throw new ApiException(
            'HTTP_ERROR',
            data.message,
            undefined,
            response.status
          );
        }
      }

      // Fallback для неизвестного формата ошибки
      throw new ApiException(
        'HTTP_ERROR',
        `HTTP error! status: ${response.status}`,
        undefined,
        response.status
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiException('TIMEOUT', 'Request timeout');
      }
      throw new ApiException('NETWORK_ERROR', error.message);
    }

    throw new ApiException('UNKNOWN_ERROR', 'An unknown error occurred');
  }
}

// GET request
export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  let url = endpoint;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value.toString());
    });
    url = `${endpoint}?${searchParams.toString()}`;
  }

  return apiFetch<T>(url, { method: 'GET' });
}

// POST request
export async function apiPost<T, D = unknown>(
  endpoint: string,
  data?: D
): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PATCH request
export async function apiPatch<T, D = unknown>(
  endpoint: string,
  data: D
): Promise<T> {
  console.log(`PATCH ${endpoint}:`, data);
  return apiFetch<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// DELETE request
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'DELETE' });
}

// Download file
export async function apiDownload(
  endpoint: string,
  filename: string
): Promise<void> {
  const response = (await apiFetch(endpoint, {
    method: 'GET',
  })) as Response;

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
