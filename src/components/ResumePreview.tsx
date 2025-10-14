import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Home,
  Loader2,
  Download,
  Eye,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { interviewApi } from '@/services/interview.api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ResumePreviewProps {
  sessionId?: string;
  onGoHome: () => void;
}

export function ResumePreview({ sessionId, onGoHome }: ResumePreviewProps) {
  const [resumeMarkdown, setResumeMarkdown] = useState<string | null>(null);
  const [resumeFilename, setResumeFilename] = useState<string>('resume.md');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      if (!sessionId) {
        setIsLoading(false);
        setError('Не указан ID сессии');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('ResumePreview: Загрузка резюме для sessionId:', sessionId);

        // Получаем информацию о сессии
        const sessions = await interviewApi.getSessions();
        const session = sessions.data.find((s) => s.id === sessionId);

        if (!session) {
          setError('Сессия не найдена');
          return;
        }

        console.log('ResumePreview: Найдена сессия:', session);

        // Проверяем, есть ли резюме в сессии
        if (session.resume_markdown) {
          console.log('ResumePreview: Резюме найдено');
          setResumeMarkdown(session.resume_markdown);
          setResumeFilename(`resume-${sessionId.slice(0, 8)}.md`);
        } else {
          setError('Резюме не найдено для этой сессии');
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

  const handleCopyMarkdown = () => {
    if (resumeMarkdown) {
      navigator.clipboard.writeText(resumeMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    <div className="flex flex-col min-h-screen px-4 py-8">
      <div className="max-w-4xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onGoHome} className="gap-2">
            <Home className="w-4 h-4" />В главное меню
          </Button>
          <h1 className="text-2xl font-bold">Превью резюме</h1>
          <div className="w-40"></div> {/* Spacer for alignment */}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Resume preview */}
        {isLoading ? (
          <Card className="p-12">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <p className="text-gray-500">Загрузка резюме...</p>
            </div>
          </Card>
        ) : resumeMarkdown ? (
          <Card className="p-6">
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex justify-between items-center pb-4 border-b">
                <div className="flex gap-2">
                  <Button
                    variant={showPreview ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowPreview(true)}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Превью
                  </Button>
                  <Button
                    variant={!showPreview ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowPreview(false)}
                    className="gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Исходник
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyMarkdown}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Скопировано
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Копировать
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadMarkdown}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Скачать MD
                  </Button>
                </div>
              </div>

              {/* Content */}
              {showPreview ? (
                <div className="prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-gray-950 p-8 rounded-lg border min-h-[600px]">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {resumeMarkdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm bg-white dark:bg-gray-950 p-6 rounded-lg border min-h-[600px] overflow-auto">
                  {resumeMarkdown}
                </pre>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-3">
              <p className="text-gray-500">Резюме не найдено</p>
              <Button onClick={onGoHome} variant="outline">
                В главное меню
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
