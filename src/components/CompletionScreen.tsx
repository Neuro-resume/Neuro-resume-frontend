import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle2, ArrowLeft, Loader2, Download, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { interviewApi } from '@/services/interview.api';

interface CompletionScreenProps {
  sessionId?: string;
  onRestart: () => void;
  onBack: () => void;
  onViewPreview: () => void;
}

export function CompletionScreen({
  sessionId,
  onRestart,
  onBack,
  onViewPreview,
}: CompletionScreenProps) {
  const [resumeMarkdown, setResumeMarkdown] = useState<string | null>(null);
  const [resumeFilename, setResumeFilename] = useState<string>('resume.md');
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log(
          'CompletionScreen: Загрузка резюме для sessionId:',
          sessionId
        );

        // Сначала получаем информацию о сессии
        const sessions = await interviewApi.getSessions();
        console.log('CompletionScreen: Получены сессии:', sessions);

        const session = sessions.data.find((s) => s.id === sessionId);
        console.log('CompletionScreen: Найдена сессия:', session);

        if (!session) {
          setError('Сессия не найдена');
          setIsLoading(false);
          return;
        }

        // Проверяем, есть ли резюме в сессии
        console.log(
          'CompletionScreen: resume_markdown =',
          session.resume_markdown
        );

        if (session.resume_markdown) {
          console.log(
            'CompletionScreen: Резюме найдено, длина:',
            session.resume_markdown.length
          );
          setResumeMarkdown(session.resume_markdown);
          setResumeFilename(`resume-${sessionId.slice(0, 8)}.md`);
        } else {
          // Если резюме нет, пробуем завершить интервью
          console.log(
            'Резюме не найдено в сессии, пробуем завершить интервью...'
          );
          setIsCompleting(true);

          try {
            const completeResponse =
              await interviewApi.completeInterview(sessionId);
            setResumeMarkdown(completeResponse.resume_markdown.content);
            setResumeFilename(
              completeResponse.resume_markdown.filename || 'resume.md'
            );
          } catch (completeError) {
            console.error('Ошибка завершения интервью:', completeError);
            setError(
              'Не удалось получить резюме. Попробуйте завершить интервью.'
            );
          } finally {
            setIsCompleting(false);
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка загрузки резюме';
        setError(message);
        console.error('Ошибка загрузки резюме:', err);
        setIsCompleting(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [sessionId]);

  const handleDownloadMarkdown = () => {
    if (resumeMarkdown) {
      const blob = new Blob([resumeMarkdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resumeFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="max-w-3xl w-full space-y-8">
        {/* Success message */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Резюме готово!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Ваше резюме успешно сформировано на основе предоставленной
            информации
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Resume info card */}
        {isLoading ? (
          <Card className="p-6">
            <div className="text-center space-y-3">
              {isCompleting ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                  <p className="text-gray-500">Формируется резюме...</p>
                </>
              ) : (
                <>
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                  <p className="text-gray-500">Загрузка резюме...</p>
                </>
              )}
            </div>
          </Card>
        ) : resumeMarkdown ? (
          <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2">
            <div className="space-y-6">
              {/* Действия с резюме */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={onViewPreview}
                  className="gap-2 h-20 text-lg"
                  size="lg"
                >
                  <Eye className="w-6 h-6" />
                  Посмотреть превью
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadMarkdown}
                  className="gap-2 h-20 text-lg"
                  size="lg"
                >
                  <Download className="w-6 h-6" />
                  Скачать резюме (MD)
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          !error && (
            <Card className="p-6">
              <div className="text-center space-y-3">
                <p className="text-gray-500">Резюме не найдено</p>
                <p className="text-sm text-gray-400">
                  Попробуйте завершить интервью или вернуться назад
                </p>
              </div>
            </Card>
          )
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Назад к сессиям
          </Button>
          <Button variant="outline" onClick={onRestart}>
            Создать новое резюме
          </Button>
        </div>
      </div>
    </div>
  );
}
