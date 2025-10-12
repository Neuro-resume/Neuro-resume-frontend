import { Button } from './ui/button';
import { Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Кнопка выхода */}
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={logout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Выйти
        </Button>
      </div>

      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold">НейроРезюме</h1>
          {user && (
            <p className="text-lg text-blue-600 dark:text-blue-400">
              Добро пожаловать,{' '}
              <span className="font-semibold">{user.username}</span>!
            </p>
          )}
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Интеллектуальная система для создания резюме на основе диалога с ИИ
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <Button
            onClick={onStart}
            size="lg"
            className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Начать сеанс
          </Button>
          <div className="flex items-center gap-4 justify-center text-sm text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>5-10 минут</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <span>Автоматическое сохранение</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-semibold mb-2">Диалог с ИИ</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Нейросеть задаст персонализированные вопросы о вашем опыте
            </p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold mb-2">Сбор информации</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Структурированный сбор данных для вашего резюме
            </p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-semibold mb-2">Готовое резюме</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Профессионально оформленное резюме в нескольких форматах
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
