# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Современная система роутинга**: Миграция на React Router v6
  - Добавлен `react-router-dom` для декларативной навигации
  - Создан компонент `ProtectedRoute` для защиты приватных маршрутов
  - Поддержка URL параметров для sessionId
  - Полная поддержка browser history API (back/forward кнопки)
  - Deep linking - возможность делиться ссылками на конкретные страницы
- **Новая архитектура проекта**:
  - Папка `/routes` с централизованной конфигурацией роутера
  - Папка `/layouts` с переиспользуемыми layout компонентами:
    - `MainLayout` - layout с Navigation для основных страниц
    - `InterviewLayout` - layout без Navigation для интервью
  - Папка `/pages` со страницами-контейнерами:
    - `StartPage` - главная страница
    - `InterviewPage` - страница интервью
    - `CompletePage` - страница завершения
    - `SessionsPage` - страница сессий
    - `ProfilePage` - страница профиля
    - `LoginPage` - страница входа
- Пагинация сессий (10 сессий на страницу с кнопкой "Показать ещё")
- Функция удаления сессии с диалогом подтверждения
- Кнопка "Завершить интервью" для сохранения прогресса
- Кнопка "Вернуться" для возврата в меню с сохранением сессии

### Changed

- **Критический рефакторинг App.tsx**: сокращение с 118 строк до 5 строк (-95% кода)
  - Удалён весь state management (appState, sessionId, handlers)
  - Убрано условное отображение компонентов
  - Заменено на чистый `RouterProvider` из React Router
- **Разделение ответственности**:
  - Layouts отвечают за структуру страниц
  - Pages связывают компоненты с роутингом
  - Components остались чистыми, без знания о роутинге
- Обновлена структура навигации: state-based → URL-based
- Упрощена передача данных: prop drilling → URL параметры + hooks
- Сигнатура `onComplete` в `InterviewSession`: убран параметр messages
- Исправлен доступ к данным в API ответах: `resumes.data` → `resumes.items`

### Removed

- State-based роутинг из App.tsx
- Prop drilling (передача обработчиков через 3+ уровня)
- Дублирование логики навигации в разных компонентах

### Fixed

- Проблема с двойной инициализацией сессий в React Strict Mode
- Типизация API ответов (PaginatedResponse)
- Корректная обработка пустых сессий при выходе
- Консистентность форматов ответов от API

### Architecture

### Architecture

Новая структура проекта обеспечивает:

- **Масштабируемость**: легко добавлять новые страницы и маршруты
- **Тестируемость**: layouts и pages можно тестировать изолированно
- **Производительность**: React Router оптимизирован лучше state-based подхода
- **DX**: чище код, проще понимать и поддерживать
- **SEO**: правильные URL'ы для каждой страницы

## [0.2.0] - 2025-10-12

### Added

- Полноценный UI для приложения НейроРезюме
- Интеграция Tailwind CSS v3.4 с темной темой
- Компоненты UI на основе Radix UI:
  - Button с вариантами (default, outline, destructive, ghost, link)
  - Card для отображения контента
  - Textarea для ввода текста
  - ScrollArea для прокрутки
  - Dialog для модальных окон
- Три основных экрана приложения:
  - StartScreen - стартовый экран с приветствием
  - InterviewSession - чат-интерфейс для диалога с ИИ
  - CompletionScreen - экран завершения с выбором формата резюме
- Lucide React иконки
- Утилиты для работы с CSS классами (cn, clsx, tailwind-merge)
- Система управления состоянием приложения
- Анимации и переходы между экранами
- Адаптивный дизайн для мобильных и десктоп устройств

### Changed

- Обновлен package.json с новыми зависимостями (Radix UI, Tailwind, etc.)
- Переработан index.css с CSS переменными для темизации
- Обновлен App.tsx для управления состоянием экранов
- Добавлены конфигурации Tailwind и PostCSS

### Fixed

- Исправлены ошибки ESLint (неиспользуемые переменные)
- Решена проблема с Fast Refresh в button.tsx
- Добавлен тестовый скрипт в package.json для pre-commit hooks

## [0.1.0] - 2025-10-11

### Added

- Initial project setup
- React 18 with TypeScript
- Vite build tool configuration
- ESLint and Prettier setup
- Husky git hooks
- GitHub Actions CI/CD
- Project documentation
- Initial release
- Basic project structure
