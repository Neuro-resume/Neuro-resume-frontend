import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  X,
  Key,
  FileText,
  History as HistoryIcon,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';
import { userApi } from '@/services/user.api';
import { interviewApi } from '@/services/interview.api';
import type { User as UserType, InterviewSession } from '@/types/api';

interface SettingsScreenProps {
  onNavigateToSessions?: () => void;
}

export function SettingsScreen({
  onNavigateToSessions,
}: SettingsScreenProps = {}) {
  const { updateUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  // Форма редактирования
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    loadProfileData();
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      console.log('SettingsScreen: Загрузка сессий для профиля...');
      const response = await interviewApi.getSessions({ limit: 10, offset: 0 });
      console.log('SettingsScreen: Получен ответ:', response);
      console.log(
        'SettingsScreen: Количество сессий:',
        response.items?.length || 0
      );
      setSessions(response.items || []);
    } catch (err) {
      console.error('SettingsScreen: Ошибка загрузки сессий:', err);
    }
  };

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await userApi.getProfile();
      setUser(userData);
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
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

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const updatedUser = await userApi.updateProfile({
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phone: formData.phone || undefined,
      });

      setUser(updatedUser);
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Ошибка сохранения профиля';
      setError(message);
      console.error('Ошибка сохранения профиля:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Загрузка профиля...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="p-8">
          <p className="text-red-600 dark:text-red-400">
            Не удалось загрузить профиль
          </p>
          {error && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {error}
            </p>
          )}
          <Button onClick={loadProfileData} className="mt-4">
            Попробовать снова
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Настройки профиля
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Управление личной информацией и безопасностью
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Information Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Личная информация</h2>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Редактировать
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Отмена
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* First Name */}
              <div>
                <Label
                  htmlFor="firstName"
                  className="flex items-center gap-2 mb-2"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  Имя
                </Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="Введите имя"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 pl-6">
                    {user.firstName || 'Не указано'}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <Label
                  htmlFor="lastName"
                  className="flex items-center gap-2 mb-2"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  Фамилия
                </Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Введите фамилию"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 pl-6">
                    {user.lastName || 'Не указано'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email
                </Label>
                <p className="text-gray-900 dark:text-gray-100 pl-6">
                  {user.email}
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    (нельзя изменить)
                  </span>
                </p>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Телефон
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+7 (___) ___-__-__"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 pl-6">
                    {user.phone || 'Не указано'}
                  </p>
                )}
              </div>

              {/* Registration Date */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Дата регистрации
                </Label>
                <p className="text-gray-900 dark:text-gray-100 pl-6">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </Card>

          {/* Sessions Overview Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Мои интервью</h2>
              {onNavigateToSessions && (
                <Button
                  onClick={onNavigateToSessions}
                  variant="outline"
                  className="gap-2"
                >
                  <HistoryIcon className="w-4 h-4" />
                  Все интервью
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  У вас пока нет интервью
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {sessions.filter((s) => s.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    В процессе
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {sessions.filter((s) => s.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Завершено
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {sessions.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Всего
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Security Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Безопасность</h2>

            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-gray-500" />
                  Пароль
                </Label>
                <div className="flex items-center justify-between pl-6">
                  <p className="text-gray-900 dark:text-gray-100">••••••••</p>
                  <Button
                    onClick={() => setShowChangePasswordDialog(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Сменить пароль
                  </Button>
                </div>
              </div>
            </div>
          </Card>
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
