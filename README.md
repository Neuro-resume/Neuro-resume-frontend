# Neuro Resume Frontend

Современное фронтенд приложение на React + TypeScript + Vite.

## 🚀 Технологический стек

- **React 18** - библиотека для создания пользовательских интерфейсов
- **TypeScript** - типизированный JavaScript
- **Vite** - быстрый сборщик и dev-сервер
- **ESLint** - линтер для JavaScript/TypeScript
- **Prettier** - форматтер кода
- **Husky** - Git hooks для автоматизации проверок
- **lint-staged** - запуск линтеров на staged файлах

## 📋 Предварительные требования

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🛠️ Установка

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd Neuro-resume-frontend
```

2. Установите зависимости:

```bash
npm install
```

3. Скопируйте файл переменных окружения:

```bash
cp .env.example .env
```

4. Настройте переменные окружения в файле `.env`

## 🏃 Запуск

### Режим разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### Сборка для продакшена

```bash
npm run build
```

### Предварительный просмотр продакшен сборки

```bash
npm run preview
```

## 📝 Доступные команды

| Команда                | Описание                   |
| ---------------------- | -------------------------- |
| `npm run dev`          | Запуск dev-сервера         |
| `npm run build`        | Сборка для продакшена      |
| `npm run preview`      | Просмотр продакшен сборки  |
| `npm run lint`         | Проверка кода линтером     |
| `npm run lint:fix`     | Исправление ошибок линтера |
| `npm run format`       | Форматирование кода        |
| `npm run format:check` | Проверка форматирования    |
| `npm run type-check`   | Проверка типов TypeScript  |

## 🏗️ Структура проекта

```
Neuro-resume-frontend/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── .husky/                 # Git hooks
├── .vscode/                # Настройки VS Code
├── src/
│   ├── App.tsx            # Главный компонент
│   ├── main.tsx           # Точка входа
│   ├── App.css            # Стили компонента
│   ├── index.css          # Глобальные стили
│   └── vite-env.d.ts      # Типы для Vite
├── .editorconfig          # Настройки редактора
├── .env.example           # Пример переменных окружения
├── .gitignore             # Игнорируемые Git файлы
├── .prettierrc            # Конфигурация Prettier
├── eslint.config.js       # Конфигурация ESLint
├── index.html             # HTML шаблон
├── package.json           # Зависимости и скрипты
├── tsconfig.json          # Конфигурация TypeScript
├── tsconfig.node.json     # TS конфиг для Node.js
└── vite.config.ts         # Конфигурация Vite
```

## 🔧 Конфигурация

### ESLint

Проект использует современную конфигурацию ESLint 9 с поддержкой TypeScript и React hooks.

### Prettier

Автоматическое форматирование кода с единым стилем.

### Husky

Pre-commit хуки запускают lint-staged для проверки кода перед коммитом.

### TypeScript

Строгий режим TypeScript для максимальной типобезопасности.

## 🚦 CI/CD

Проект настроен с GitHub Actions для автоматической проверки:

- Линтинг кода
- Проверка типов TypeScript
- Проверка форматирования
- Сборка проекта

Workflow запускается при push и pull request в ветку `main`.

## � Документация

- [Руководство по настройке](docs/SETUP.md) - Детальная инструкция по запуску проекта
- [Архитектура](docs/ARCHITECTURE.md) - Обзор архитектуры и технологий
- [Стиль кода](docs/CODING_STYLE.md) - Соглашения и лучшие практики
- [Contributing](CONTRIBUTING.md) - Как внести вклад в проект
- [Code of Conduct](CODE_OF_CONDUCT.md) - Правила поведения
- [Changelog](CHANGELOG.md) - История изменений
- [Security](SECURITY.md) - Политика безопасности

MIT
