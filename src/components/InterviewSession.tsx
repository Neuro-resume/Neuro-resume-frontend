import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Send, StopCircle, Sparkles, Loader2 } from 'lucide-react';
import { interviewApi } from '@/services/interview.api';
import type { Message } from '@/types/api';

interface InterviewSessionProps {
  sessionId: string;
  onComplete: () => void;
  onCancel: () => void;
}

export function InterviewSession({
  sessionId,
  onComplete,
  onCancel,
}: InterviewSessionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await interviewApi.getMessages(sessionId);
      setMessages(response.messages);
    } catch (err) {
      console.error('Ошибка загрузки сообщений:', err);
      setError(
        err instanceof Error ? err.message : 'Ошибка загрузки сообщений'
      );
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const messageContent = input.trim();
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await interviewApi.sendMessage(sessionId, {
        content: messageContent,
      });

      // Добавляем оба сообщения (пользователя и AI)
      setMessages((prev) => [
        ...prev,
        response.user_message,
        response.ai_response,
      ]);

      // Обновляем прогресс
      setProgress(response.progress.percentage);

      // Проверяем, нужно ли завершить интервью
      if (response.progress.percentage >= 100) {
        // Сессия завершается автоматически на бэкенде, просто переходим к результату
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
      setError(
        err instanceof Error ? err.message : 'Ошибка отправки сообщения'
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEarlyComplete = async () => {
    setIsCompleting(true);
    setError(null);
    try {
      // Завершаем интервью досрочно и генерируем резюме
      await interviewApi.completeInterview(sessionId);
      setShowEndDialog(false);
      // Показываем сообщение о генерации резюме
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (err) {
      console.error('Ошибка завершения интервью:', err);
      setError(
        err instanceof Error ? err.message : 'Ошибка завершения интервью'
      );
      setShowEndDialog(false);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleReturnLater = () => {
    setShowEndDialog(false);
    onCancel();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Сеанс интервью</h2>
              <p className="text-sm text-gray-500">
                {messages.length}{' '}
                {messages.length === 1 ? 'сообщение' : 'сообщений'} • Прогресс:{' '}
                {progress}%
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowEndDialog(true)}
            className="gap-2"
          >
            <StopCircle className="w-4 h-4" />
            Завершить досрочно
          </Button>
        </div>
      </div>{' '}
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium">Вы</span>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Введите ваш ответ... (Enter для отправки, Shift+Enter для новой строки)"
                className="min-h-[60px] max-h-[200px] resize-none"
                disabled={isTyping}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              size="lg"
              className="px-6 h-[60px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* End Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Завершить интервью?</DialogTitle>
            <DialogDescription>
              Выберите действие. При досрочном завершении будет сформировано
              резюме на основе собранной информации.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setShowEndDialog(false)}
                disabled={isCompleting}
                className="w-full sm:w-auto"
              >
                Отмена
              </Button>
              <Button
                variant="outline"
                onClick={handleReturnLater}
                disabled={isCompleting}
                className="w-full sm:w-auto"
              >
                Вернуться позже
              </Button>
              <Button
                onClick={handleEarlyComplete}
                disabled={isCompleting}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Формируется резюме...
                  </>
                ) : (
                  'Завершить досрочно'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
