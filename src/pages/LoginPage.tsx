import { useNavigate } from 'react-router-dom';
import { LoginScreen } from '@/components/LoginScreen';
import { useAuth } from '@/contexts/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    navigate('/', { replace: true });
  };

  return <LoginScreen onLogin={handleLogin} />;
}
