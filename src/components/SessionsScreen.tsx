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
  Download,
  ChevronRight,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { interviewApi } from '@/services/interview.api';
import { resumeApi } from '@/services/resume.api';
import type { InterviewSession, Resume } from '@/types/api';

interface SessionsScreenProps {
  onContinueSession: (sessionId: string) => void;
  onStartNewInterview: () => void;
}

export function SessionsScreen({
  onContinueSession,
  onStartNewInterview,
}: SessionsScreenProps) {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [resumes, setResumes] = useState<Record<string, Resume>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingResumeId, setDownloadingResumeId] = useState<string | null>(
    null
  );
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null
  );
  const [completingSessionId, setCompletingSessionId] = useState<string | null>(
    null
  );
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

      const newSessions = sessionsResponse.items || [];
      const updatedSessions = reset
        ? newSessions
        : [...sessions, ...newSessions];
      setSessions(updatedSessions);
      setTotal(sessionsResponse.total || 0);
      setHasMore(sessionsResponse.has_more || false);

      // Загружаем резюме для всех загруженных сессий (с учетом новых)
      const totalSessionsCount = updatedSessions.length;
      const resumesResponse = await resumeApi.getResumes({
        limit: Math.max(totalSessionsCount, 10),
        offset: 0,
      });
      console.log('SessionsScreen: Получен ответ резюме:', resumesResponse);
      const resumesBySession: Record<string, Resume> = {};

      if (resumesResponse.items) {
        resumesResponse.items.forEach((resume) => {
          if (resume.sessionId) {
            resumesBySession[resume.sessionId] = resume;
          }
        });
      }

      console.log('SessionsScreen: Загружено сессий:', newSessions.length);
      console.log('SessionsScreen: Всего сессий:', sessionsResponse.total);
      console.log('SessionsScreen: Есть ещё:', sessionsResponse.has_more);
      console.log(
        'SessionsScreen: Загружено резюме:',
        Object.keys(resumesBySession).length
      );

      setResumes(resumesBySession);
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

  const handleDownloadResume = async (
    resumeId: string,
    format: 'pdf' | 'docx' | 'txt' = 'pdf'
  ) => {
    try {
      setDownloadingResumeId(resumeId);
      await resumeApi.downloadResume(resumeId, format);
    } catch (err) {
      console.error('Ошибка скачивания резюме:', err);
      setError(err instanceof Error ? err.message : 'Ошибка скачивания резюме');
    } finally {
      setDownloadingResumeId(null);
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'abandoned':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'in_progress':
        return 'В процессе';
      case 'abandoned':
        return 'Отменено';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'abandoned':
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
              const resume = resumes[session.id];
              const isClickable = session.status === 'in_progress';

              return (
                <Card
                  key={session.id}
                  className={`p-6 ${
                    isClickable
                      ? 'cursor-pointer hover:shadow-lg transition-all hover:border-blue-400'
                      : ''
                  }`}
                  onClick={() => isClickable && onContinueSession(session.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Статус и язык */}
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(session.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}
                        >
                          {getStatusText(session.status)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {session.language === 'ru'
                            ? '🇷🇺 Русский'
                            : '🇬🇧 English'}
                        </span>
                        {isClickable && (
                          <span className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            Нажмите для продолжения
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      {/* Кнопки действий для сессии */}
                      <div className="flex gap-2 mb-4">
                        {session.status === 'in_progress' && !resume && (
                          <Button
                            size="sm"
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
                            {session.messageCount}{' '}
                            {session.messageCount === 1
                              ? 'сообщение'
                              : 'сообщений'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {formatDate(session.createdAt)}
                          </span>
                        </div>
                        {session.completedAt && (
                          <div className="flex items-center gap-2 text-sm col-span-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600 dark:text-gray-400">
                              Завершено: {formatDate(session.completedAt)}
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

                      {/* Секции */}
                      {session.progress.completedSections.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {session.progress.completedSections.map((section) => (
                            <span
                              key={section}
                              className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs"
                            >
                              ✓ {section}
                            </span>
                          ))}
                          {session.progress.currentSection &&
                            session.status === 'in_progress' && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs">
                                ⟳ {session.progress.currentSection}
                              </span>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Резюме (если есть) */}
                    {resume && (
                      <div className="flex flex-col gap-2">
                        <div className="text-right mb-2">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Резюме готово
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {resume.template}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadResume(resume.id, 'pdf');
                          }}
                          disabled={downloadingResumeId === resume.id}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          {downloadingResumeId === resume.id
                            ? 'Скачивание...'
                            : 'Скачать PDF'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadResume(resume.id, 'docx');
                          }}
                          disabled={downloadingResumeId === resume.id}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Скачать DOCX
                        </Button>
                      </div>
                    )}
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
