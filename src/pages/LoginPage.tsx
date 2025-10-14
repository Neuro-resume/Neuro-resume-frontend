import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginScreen } from '@/components/LoginScreen';
import { useAuth } from '@/contexts/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Если пользователь уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    navigate('/', { replace: true });
  };

  // Не показываем форму логина, если идёт загрузка или пользователь авторизован
  if (isLoading || isAuthenticated) {
    return null;
  }

  return <LoginScreen onLogin={handleLogin} />;
}
