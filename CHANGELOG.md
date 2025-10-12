# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Полноценный UI для приложения НейроРезюме
- Интеграция Tailwind CSS v3.4 с темной темой
- Компоненты UI на основе Radix UI:
  - Button с вариантами (default, outline, destructive, ghost, link)
  - Card для отображения контента
  - Textarea для ввода текста
  - ScrollArea для прокрутки
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
