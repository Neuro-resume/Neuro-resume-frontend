import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Lock, User, AlertCircle, Mail } from 'lucide-react';
import { authApi } from '@/services/auth.api';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (mode === 'register' && !email.trim()) {
      setError('Email обязателен для регистрации');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'register') {
        // Регистрация нового пользователя
        await authApi.register({
          username,
          email,
          password,
        });
        // После успешной регистрации автоматически входим
        // (токен уже сохранен в authApi.register)
        window.location.reload();
      } else {
        // Вход существующего пользователя
        await onLogin(username, password);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ошибка ' + (mode === 'login' ? 'авторизации' : 'регистрации');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            НейроРезюме
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'login'
              ? 'Войдите в систему для создания резюме'
              : 'Создайте аккаунт для начала работы'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Логин *</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Введите логин"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Имя</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Иван"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                      autoComplete="given-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Фамилия</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Иванов"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                      autoComplete="family-name"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Пароль *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  disabled={isLoading}
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading
                ? mode === 'login'
                  ? 'Вход...'
                  : 'Регистрация...'
                : mode === 'login'
                  ? 'Войти'
                  : 'Зарегистрироваться'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                disabled={isLoading}
              >
                {mode === 'login'
                  ? 'Нет аккаунта? Зарегистрируйтесь'
                  : 'Уже есть аккаунт? Войдите'}
              </button>
            </div>

            {mode === 'login' && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                  💡 Нет аккаунта? Зарегистрируйтесь!
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Нажмите "Нет аккаунта? Зарегистрируйтесь" ниже кнопки входа
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
