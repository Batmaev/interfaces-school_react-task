# Задание по React в Школе разработки интерфейсов

## Инструкция по запуску

```bash
npm install
npm run dev
```

## Архитектура

React, TypeScript, Zustand, CSS Modules, Fetch, React Router, Vite.

Каждая страница находится в отдельной папке в `src/pages`. Бизнес-логика отделена от UI-логики и находится в отдельных `ts` файлах.

## Тесты

```bash
npm run test
```
Для тестов используется `vitest` и `@testing-library/react`.

Тесты хранятся в папках вида `src/pages/<page-name>/__tests__/`.

Проверяется функционал каждой страницы и навигация (она отдельно в файле `src/pages/shared/Navigation/Navigation.test.tsx`).
