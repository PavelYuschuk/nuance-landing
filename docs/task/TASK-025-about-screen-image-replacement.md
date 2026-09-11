# TASK-025: Замена Иллюстрации в Секции "3.3. Генезис"

**Status:** DONE  
**Target File(s):** `index.html`  
**Parent Specification:** TASK-003, TASK-004

---

## 1. Контекст и Цель Модификации
Замена графического исходника файла иллюстрации для блока Генезиса:
- **Устаревший файл:** `/assets/images/About. Screen 0.png`
- **Новый актуальный файл:** `/assets/images/About. Screen 0 (2).png`

Все остальные параметры верстки, стилизации, прогресс-бара и текста сохраняются **без изменений**.

---

## 2. Инженерная Спецификация (Asset Spec)

### 2.1. Точный Маппинг Изображения в DOM (`index.html`)

В разметке секции `#genesis` (в слое, где используется `About. Screen 0.png`):

```html
<!-- Было: -->
<img src="/assets/images/About. Screen 0.png" ... />

<!-- Стало: -->
<img src="/assets/images/About. Screen 0 (2).png" alt="NUANCE Тактическая группа" loading="lazy" />
```

---

## 3. Чек-лист проверки выполнения (Verification)
- [ ] Статус ТЗ установлен в `Status: To do`.
- [ ] Ссылка на изображение обновлена на `/assets/images/About. Screen 0 (2).png`.
- [ ] Иллюстрация корректно подгружается в браузере без ошибки 404.
