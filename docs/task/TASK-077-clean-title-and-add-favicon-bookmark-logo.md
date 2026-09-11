# TASK-077: Очистка Тега Title и Добавление Логотипа для Закладок (Favicon)

**Status:** DONE  
**Target File(s):** `index.html`  
**Parent Specification:** TASK-001  
**Reference Asset:** `public/assets/images/NUANCE logo.png` (`dist/assets/images/NUANCE logo.png`)  

---

## 1. Контекст и Постановка Задачи

Пользователь поставил задачу внести два изменения в секцию `<head>` в [index.html](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/index.html):

1. **Очистить тег `<title>`:**  
   Убрать постфикс `" — Тактическая Группа"`, оставив лаконичное и чистое имя бренда:  
   `<title>NUANCE</title>`
2. **Добавить логотип для отображения во вкладках и закладках:**  
   Подключить файл логотипа `NUANCE logo.png` через стандартные мета-теги иконки сайта (`<link rel="icon">`, `<link rel="apple-touch-icon">`), чтобы логотип корректно отображался:
   - На вкладках браузера (Browser Tabs).
   - В панели и меню закладок (Bookmarks Bar).
   - В истории браузера и ярлыках быстрого доступа.

---

## 2. Техническая Спецификация Изменений в `index.html`

В файле [index.html](file:///c:/Users/Pavel/Desktop/NUANCE%20Site/nuance-landing/index.html) в секции `<head>` (строки 4–11):

### 2.1. Было:
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NUANCE — Тактическая Группа</title>
  <meta name="description" content="Лендинг-портфолио тактической группы NUANCE. Состав команды, философия бренда и ключевые компетенции." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;700;800;900&display=swap" rel="stylesheet">
</head>
```

### 2.2. Стало:
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NUANCE</title>
  <meta name="description" content="Лендинг-портфолио тактической группы NUANCE. Состав команды, философия бренда и ключевые компетенции." />

  <!-- Иконка сайта (Favicon) для вкладок и панели закладок (TASK-077) -->
  <link rel="icon" type="image/png" href="/assets/images/NUANCE logo.png" />
  <link rel="shortcut icon" type="image/png" href="/assets/images/NUANCE logo.png" />
  <link rel="apple-touch-icon" href="/assets/images/NUANCE logo.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;700;800;900&display=swap" rel="stylesheet">
</head>
```

---

## 3. Пути к Ресурсам в Vite

В сборщике Vite все статические ассеты из директории `public/` отдаются от корня сайта:
- Исходный файл: `public/assets/images/NUANCE logo.png`
- Скомпилированный файл: `dist/assets/images/NUANCE logo.png`
- Публичный URL в браузере: `/assets/images/NUANCE logo.png` (или `/assets/images/NUANCE%20logo.png`)

Браузер считывает `<link rel="icon" type="image/png" href="/assets/images/NUANCE logo.png" />`, кеширует PNG-логотип и автоматически отображает его рядом с заголовком **NUANCE** в заголовке окна и при сохранении сайта в закладки (Ctrl+D / Cmd+D).

---

## 4. План Верификации и Тестирования

1. **Проверка заголовка вкладки:**
   - [x] Заголовок вкладки в браузере отображается строго как `NUANCE` (без дефиса и надписи «Тактическая Группа»).
2. **Проверка отображения иконки:**
   - [x] Слева от заголовка вкладки отображается фирменный логотип NUANCE.
   - [x] При добавлении страницы в закладки (Ctrl+D) логотип подтягивается в качестве фавиконки закладки.
   - [x] В панели закладок отображается миниатюра логотипа.
