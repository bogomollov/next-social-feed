<div align="center">
<h1>Next Social Feed</h1>
<p align="center">Современная социальная лента с фокусом на производительность, типизацию и безопасность</p>
</div>

## Начало работы

1. Клонировать репозиторий

```bash
git clone https://github.com/bogomollov/next-social-feed
cd next-social-feed
```

2. Установить зависимости

```bash
npm install
```

3. Настроить переменные окружения

Скопируйте содержимое `.env.example` в новый файл `.env`. Заполните все необходимые ключи.

## Запуск проекта

### Режим разработки

Для запуска локального сервера с поддержкой hot-reload:

```bash
npm run dev
```

- Приложение доступно по адресу: http://localhost:3000

### Тестирование

Проект включает настроенный тестовый контур:

```bash
# Запуск unit-тестов (Vitest)
npm run test

# Запуск E2E тестов (Playwright)
npm run test:e2e
```

## Работа с базой данных (Drizzle ORM)

В проекте используется Drizzle ORM для управления схемой базы данных.

- **Генерация миграций**: `npx drizzle-kit generate`
- **Применение миграций**: `npx drizzle-kit migrate`
- **Просмотр БД (Drizzle Studio)**: `npx drizzle-kit studio`
- **Заполнение БД тестовыми данными**: `npm run db:seed`

## Стек технологий

**Frontend & Framework**
- Next.js 16 (App Router) + React 19
- TypeScript, Tailwind CSS 4
- next-intl (интернационализация)
- next-themes (управление темой)
- shadcn/ui, Radix UI, Lucide Icons

**Backend & Data**
- Better-Auth (аутентификация)
- Drizzle ORM + PostgreSQL (Neon)
- Redis (ioredis + better-auth-redis-storage)
- Zod (валидация данных)
- Resend (отправка email)

**Testing & Quality**
- Vitest + Testing Library
- Playwright (E2E)
- ESLint

## Лицензия

Copyright (c) 2026-present Bogdan Bogomolov<br>

Проект распространяется под лицензией MIT. Дополнительную информацию см. в [LICENSE](LICENSE)