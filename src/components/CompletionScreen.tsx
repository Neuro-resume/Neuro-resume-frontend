import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle2, FileText, Download, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { resumeApi } from '@/services/resume.api';
import type { Resume } from '@/types/api';

interface CompletionScreenProps {
  sessionId?: string;
  onRestart: () => void;
}

export function CompletionScreen({
  sessionId,
  onRestart,
}: CompletionScreenProps) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Получаем список резюме и находим последнее созданное для этой сессии
        const resumes = await resumeApi.getResumes({ limit: 10, offset: 0 });
        const sessionResume = resumes.items.find(
          (r) => r.sessionId === sessionId
        );

        if (sessionResume) {
          setResume(sessionResume);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Ошибка загрузки резюме';
        setError(message);
        console.error('Ошибка загрузки резюме:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [sessionId]);

  const handleDownload = async (format: 'pdf' | 'docx' | 'txt') => {
    if (!resume) return;

    setIsDownloading(format);
    try {
      await resumeApi.downloadResume(resume.id, format);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка скачивания';
      setError(message);
      console.error('Ошибка скачивания:', err);
    } finally {
      setIsDownloading(null);
    }
  };

  const formats = [
    {
      id: 'pdf' as const,
      icon: FileText,
      title: 'PDF',
      description: 'Профессиональный формат для печати и отправки',
      color: 'from-red-500 to-orange-500',
    },
    {
      id: 'docx' as const,
      icon: FileText,
      title: 'Word',
      description: 'Редактируемый формат для дальнейшей работы',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'txt' as const,
      icon: FileText,
      title: 'Текстовый файл',
      description: 'Простой текстовый формат',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка резюме...</p>
        </div>
      </div>
    );
  }

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

        {/* Resume preview */}
        {resume && (
          <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{resume.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {resume.data.personalInfo?.firstName}{' '}
                  {resume.data.personalInfo?.lastName}
                </p>
              </div>
              <div className="h-px bg-gray-300 dark:bg-gray-700"></div>
              <div className="space-y-2 text-sm">
                {resume.data.personalInfo?.email && (
                  <p>📧 {resume.data.personalInfo.email}</p>
                )}
                {resume.data.personalInfo?.phone && (
                  <p>📱 {resume.data.personalInfo.phone}</p>
                )}
                {resume.data.personalInfo?.location && (
                  <p>📍 {resume.data.personalInfo.location}</p>
                )}
              </div>
              {resume.data.summary && (
                <>
                  <div className="h-px bg-gray-300 dark:bg-gray-700"></div>
                  <div>
                    <h3 className="font-semibold mb-2">О себе</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {resume.data.summary}
                    </p>
                  </div>
                </>
              )}
              {resume.data.workExperience &&
                resume.data.workExperience.length > 0 && (
                  <>
                    <div className="h-px bg-gray-300 dark:bg-gray-700"></div>
                    <div>
                      <h3 className="font-semibold mb-2">Опыт работы</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {resume.data.workExperience[0]?.position} в{' '}
                        {resume.data.workExperience[0]?.company}
                      </p>
                    </div>
                  </>
                )}
            </div>
          </Card>
        )}

        {/* Format selection */}
        {resume && (
          <div className="space-y-4">
            <h2 className="text-center font-semibold text-lg">
              Выберите формат для скачивания
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formats.map((format) => (
                <Card
                  key={format.id}
                  className="p-6 cursor-pointer transition-all hover:shadow-lg"
                  onClick={() => handleDownload(format.id)}
                >
                  <div className="space-y-3">
                    <div
                      className={`p-3 bg-gradient-to-br ${format.color} rounded-lg w-fit`}
                    >
                      <format.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{format.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      disabled={isDownloading === format.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(format.id);
                      }}
                    >
                      {isDownloading === format.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Загрузка...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Скачать
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={onRestart}>
            Создать новое резюме
          </Button>
        </div>
      </div>
    </div>
  );
}
