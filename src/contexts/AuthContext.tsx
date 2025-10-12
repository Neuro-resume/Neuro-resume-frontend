import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { authApi } from '@/services/auth.api';
import { setAuthToken, clearAuthToken } from '@/lib/api-client';
import type { User, LoginRequest, RegisterRequest } from '@/types/api';
import { STORAGE_KEYS } from '@/config/api';

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверяем localStorage при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        clearAuthToken();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setError(null);
    setIsLoading(true);

    try {
      const credentials: LoginRequest = { username, password };
      const response = await authApi.login(credentials);

      // Сохраняем токен и данные пользователя
      setAuthToken(response.token, response.expiresIn);
      localStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(response.user)
      );
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка авторизации';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.register(data);

      // Сохраняем токен и данные пользователя
      setAuthToken(response.token, response.expiresIn);
      localStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(response.user)
      );
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка регистрации';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await authApi.logout();
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    } finally {
      setUser(null);
      clearAuthToken();
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: User): void => {
    // Обновляем состояние
    setUser(updatedUser);
    // Обновляем localStorage
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    console.log('Данные пользователя обновлены в контексте:', updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
