import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import {
  User,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
  Edit2,
  Save,
  X,
  Key,
  History,
} from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';
import { userApi } from '@/services/user.api';
import { interviewApi } from '@/services/interview.api';
import type { User as UserType, InterviewSession } from '@/types/api';

interface ProfileScreenProps {
  onLogout: () => void;
  onStartNewInterview: () => void;
  onShowSessions: () => void;
}

export function ProfileScreen({
  onLogout,
  onStartNewInterview,
  onShowSessions,
}: ProfileScreenProps) {
  const { updateUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  // Форма редактирования профиля
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  // Загрузка данных пользователя и сессий
  useEffect(() => {
    loadProfileData();
    loadSessions();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const userData = await userApi.getProfile();
      setUser(userData);
      setFormData({
        username: userData.username,
        email: userData.email,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Ошибка загрузки профиля';
      setError(message);
      console.error('Ошибка загрузки профиля:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await interviewApi.getSessions({ limit: 50, offset: 0 });
      setSessions(response.data || []);
    } catch (err) {
      console.error('Ошибка загрузки сессий:', err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setError(null);
      console.log('Отправка данных профиля:', formData);
      const updatedUser = await userApi.updateProfile(formData);
      console.log('Профиль успешно обновлен:', updatedUser);

      // Обновляем локальное состояние
      setUser(updatedUser);

      // Обновляем глобальный контекст аутентификации
      updateUser(updatedUser);

      setIsEditing(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Ошибка обновления профиля';
      setError(message);
      console.error('Ошибка обновления профиля:', err);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'ABANDONED':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Завершено';
      case 'IN_PROGRESS':
        return 'В процессе';
      case 'ABANDONED':
        return 'Отменено';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Загрузка профиля...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Профиль
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Управление личной информацией и историей интервью
              </p>
            </div>
            <Button variant="outline" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Личная информация</h2>
                {!isEditing ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Редактировать
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Сохранить
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Имя пользователя</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="Введите имя пользователя"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Имя пользователя
                      </p>
                      <p className="font-medium">
                        {user?.username || 'Не указано'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Дата регистрации
                      </p>
                      <p className="font-medium">
                        {user?.created_at
                          ? formatDate(user.created_at)
                          : 'Не указано'}
                      </p>
                    </div>
                  </div>

                  {/* Кнопка смены пароля */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      onClick={() => setShowChangePasswordDialog(true)}
                      className="w-full gap-2"
                    >
                      <Key className="w-4 h-4" />
                      Сменить пароль
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sessions Card */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">История интервью</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Всего сессий: {sessions.length}
                  </p>
                </div>
                <Button onClick={onStartNewInterview} className="gap-2">
                  <FileText className="w-4 h-4" />
                  Новое интервью
                </Button>
              </div>

              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    У вас пока нет интервью
                  </p>
                  <Button onClick={onStartNewInterview} className="gap-2">
                    <FileText className="w-4 h-4" />
                    Начать первое интервью
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Краткая статистика */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {
                          sessions.filter((s) => s.status === 'IN_PROGRESS')
                            .length
                        }
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        В процессе
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {
                          sessions.filter((s) => s.status === 'COMPLETED')
                            .length
                        }
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Завершено
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                        {
                          sessions.filter((s) => s.status === 'ABANDONED')
                            .length
                        }
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Отменено
                      </div>
                    </div>
                  </div>

                  {/* Кнопка просмотра всех сессий */}
                  <Button
                    onClick={onShowSessions}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <History className="w-4 h-4" />
                    Посмотреть все интервью
                  </Button>

                  {/* Последние 3 сессии */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Последние интервью:
                    </p>
                    {sessions.slice(0, 3).map((session) => (
                      <div
                        key={session.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(session.status)}
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {getStatusText(session.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                <span>{session.message_count} сообщений</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(session.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {session.progress.percentage}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
      />
    </div>
  );
}
