import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { InterviewSession } from '@/components/InterviewSession';
import { interviewApi } from '@/services/interview.api';

export function InterviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionIdParam = searchParams.get('sessionId');
  const [sessionId, setSessionId] = useState<string | null>(sessionIdParam);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Если нет sessionId в URL, создаем новую сессию
    if (!sessionIdParam) {
      createNewSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createNewSession = async () => {
    try {
      setIsCreatingSession(true);
      const session = await interviewApi.createSession();
      setSessionId(session.id);
      // Обновляем URL с новым sessionId
      navigate(`/interview?sessionId=${session.id}`, { replace: true });
    } catch (err) {
      console.error('Ошибка создания сессии:', err);
      setError(err instanceof Error ? err.message : 'Ошибка создания сессии');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleComplete = () => {
    navigate(`/complete${sessionId ? `?sessionId=${sessionId}` : ''}`);
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  if (isCreatingSession || !sessionId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Создание сессии интервью...
          </p>
        </div>
      </div>
    );
  }

  return (
    <InterviewSession
      sessionId={sessionId}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
}
