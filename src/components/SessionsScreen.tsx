import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  Calendar,
  RefreshCw,
  Trash2,
  Eye,
  Download,
} from 'lucide-react';
import { interviewApi } from '@/services/interview.api';
import type { InterviewSession } from '@/types/api';

interface SessionsScreenProps {
  onContinueSession: (sessionId: string) => void;
  onViewResume: (sessionId: string) => void;
  onStartNewInterview: () => void;
}

export function SessionsScreen({
  onContinueSession,
  onViewResume,
  onStartNewInterview,
}: SessionsScreenProps) {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null
  );
  const [completingSessionId, setCompletingSessionId] = useState<string | null>(
    null
  );
  const [downloadingSessionId, setDownloadingSessionId] = useState<
    string | null
  >(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const LIMIT = 10;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async (reset = true) => {
    try {
      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const offset = reset ? 0 : sessions.length;

      console.log('SessionsScreen: Начинаем загрузку сессий...', {
        offset,
        limit: LIMIT,
      });

      // Загружаем сессии
      const sessionsResponse = await interviewApi.getSessions({
        limit: LIMIT,
        offset,
      });
      console.log('SessionsScreen: Получен ответ сессий:', sessionsResponse);

      const newSessions = sessionsResponse.data || [];
      const updatedSessions = reset
        ? newSessions
        : [...sessions, ...newSessions];
      setSessions(updatedSessions);
      setTotal(sessionsResponse.total || 0);
      setHasMore(sessionsResponse.has_more || false);

      console.log('SessionsScreen: Загружено сессий:', newSessions.length);
      console.log('SessionsScreen: Всего сессий:', sessionsResponse.total);
      console.log('SessionsScreen: Есть ещё:', sessionsResponse.has_more);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Ошибка загрузки данных';
      setError(message);
      console.error('Ошибка загрузки сессий:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    loadData(false);
  };

  const handleRefresh = () => {
    loadData(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    setSessionToDelete(sessionId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;

    try {
      setDeletingSessionId(sessionToDelete);
      await interviewApi.deleteSession(sessionToDelete);

      // Удаляем сессию из локального состояния
      setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete));

      // Обновляем total
      setTotal((prev) => Math.max(0, prev - 1));

      // Закрываем диалог
      setShowDeleteDialog(false);
      setSessionToDelete(null);
    } catch (err) {
      console.error('Ошибка удаления сессии:', err);
      setError(err instanceof Error ? err.message : 'Ошибка удаления сессии');
      setShowDeleteDialog(false);
      setSessionToDelete(null);
    } finally {
      setDeletingSessionId(null);
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      setCompletingSessionId(sessionId);
      await interviewApi.completeInterview(sessionId);

      // Обновляем список сессий
      await loadData(true);
    } catch (err) {
      console.error('Ошибка завершения сессии:', err);
      setError(err instanceof Error ? err.message : 'Ошибка завершения сессии');
    } finally {
      setCompletingSessionId(null);
    }
  };

  const handleDownloadResume = async (sessionId: string) => {
    try {
      setDownloadingSessionId(sessionId);
      const data = await interviewApi.getSessionResume(sessionId);

      // Создаем и скачиваем файл
      const blob = new Blob([data.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || 'resume.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Ошибка скачивания резюме:', err);
      setError(err instanceof Error ? err.message : 'Ошибка скачивания резюме');
    } finally {
      setDownloadingSessionId(null);
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ABANDONED':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
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
          <p className="text-gray-600 dark:text-gray-400">Загрузка сессий...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                История интервью
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {total > 0
                  ? `Всего сессий: ${total}`
                  : `Загружено сессий: ${sessions.length}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Обновить
              </Button>
              <Button onClick={onStartNewInterview} className="gap-2">
                <FileText className="w-4 h-4" />
                Новое интервью
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              Попробовать снова
            </Button>
          </div>
        )}

        {sessions.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                У вас пока нет интервью
              </p>
              <Button onClick={onStartNewInterview} className="gap-2">
                <FileText className="w-4 h-4" />
                Начать первое интервью
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const hasResume = session.resume_markdown !== null;
              const isInProgress = session.status === 'IN_PROGRESS';
              const isCompleted = session.status === 'COMPLETED';

              return (
                <Card key={session.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Статус */}
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(session.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}
                        >
                          {getStatusText(session.status)}
                        </span>
                      </div>

                      {/* Кнопки действий для сессии */}
                      <div className="flex gap-2 mb-4">
                        {/* Для сессий в статусе IN_PROGRESS - кнопка "Продолжить диалог" */}
                        {isInProgress && (
                          <Button
                            size="sm"
                            onClick={() => onContinueSession(session.id)}
                            className="gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Продолжить диалог
                          </Button>
                        )}

                        {/* Для завершенных сессий с резюме - кнопка "Посмотреть резюме" */}
                        {isCompleted && hasResume && (
                          <Button
                            size="sm"
                            onClick={() => onViewResume(session.id)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Посмотреть резюме
                          </Button>
                        )}

                        {/* Для завершенных сессий БЕЗ резюме - показать кнопку завершения */}
                        {isCompleted && !hasResume && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteSession(session.id);
                            }}
                            disabled={completingSessionId === session.id}
                            className="gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {completingSessionId === session.id
                              ? 'Формирование резюме...'
                              : 'Сформировать резюме'}
                          </Button>
                        )}

                        {/* Кнопка завершения для незавершенных сессий */}
                        {isInProgress && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteSession(session.id);
                            }}
                            disabled={completingSessionId === session.id}
                            className="gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {completingSessionId === session.id
                              ? 'Завершение...'
                              : 'Завершить интервью'}
                          </Button>
                        )}

                        {/* Кнопка скачивания резюме (для завершенных сессий с резюме) */}
                        {isCompleted && hasResume && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadResume(session.id);
                            }}
                            disabled={downloadingSessionId === session.id}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            {downloadingSessionId === session.id
                              ? 'Скачивание...'
                              : 'Скачать'}
                          </Button>
                        )}

                        {/* Кнопка удаления с предупреждением */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                          disabled={deletingSessionId === session.id}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingSessionId === session.id
                            ? 'Удаление...'
                            : 'Удалить'}
                        </Button>
                      </div>

                      {/* Информация о сессии */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {session.message_count}{' '}
                            {session.message_count === 1
                              ? 'сообщение'
                              : 'сообщений'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {formatDate(session.created_at)}
                          </span>
                        </div>
                        {session.completed_at && (
                          <div className="flex items-center gap-2 text-sm col-span-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600 dark:text-gray-400">
                              Завершено: {formatDate(session.completed_at)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Прогресс */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Прогресс
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {session.progress.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${session.progress.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Резюме готово */}
                      {hasResume && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">
                              Резюме сгенерировано
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Кнопка "Показать ещё" */}
        {hasMore && !isLoading && sessions.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              variant="outline"
              className="gap-2"
            >
              {isLoadingMore ? 'Загрузка...' : 'Показать ещё'}
            </Button>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить сессию?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить эту сессию? Это действие нельзя
              отменить. Все данные сессии и связанное резюме будут удалены.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSessionToDelete(null);
              }}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteSession}
              disabled={deletingSessionId !== null}
            >
              {deletingSessionId ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
