import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle2, FileText, Image, Download } from 'lucide-react';
import { useState } from 'react';

interface CompletionScreenProps {
  onRestart: () => void;
}

export function CompletionScreen({ onRestart }: CompletionScreenProps) {
  const [selectedFormat, setSelectedFormat] = useState<
    'pdf' | 'image' | 'text' | null
  >(null);

  const formats = [
    {
      id: 'pdf' as const,
      icon: FileText,
      title: 'PDF',
      description: 'Профессиональный формат для печати и отправки',
      color: 'from-red-500 to-orange-500',
    },
    {
      id: 'image' as const,
      icon: Image,
      title: 'Изображение',
      description: 'PNG формат для социальных сетей',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'text' as const,
      icon: FileText,
      title: 'Текстовый файл',
      description: 'Редактируемый формат для дальнейшей работы',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const handleDownload = (format: 'pdf' | 'image' | 'text') => {
    setSelectedFormat(format);
    // Симуляция загрузки
    setTimeout(() => {
      alert(`Резюме в формате ${format.toUpperCase()} будет загружено`);
    }, 500);
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

        {/* Resume preview */}
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Иван Петров</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Frontend Разработчик
              </p>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-700"></div>
            <div className="space-y-2 text-sm">
              <p>📧 ivan.petrov@example.com</p>
              <p>📱 +7 (999) 123-45-67</p>
              <p>📍 Москва, Россия</p>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-700"></div>
            <div>
              <h3 className="font-semibold mb-2">Опыт работы</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Основано на ваших ответах...
              </p>
            </div>
          </div>
        </Card>

        {/* Format selection */}
        <div className="space-y-4">
          <h2 className="text-center font-semibold text-lg">
            Выберите формат для скачивания
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formats.map((format) => (
              <Card
                key={format.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedFormat === format.id
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : ''
                }`}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(format.id);
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Скачать
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

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
