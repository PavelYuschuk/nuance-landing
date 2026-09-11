# TASK-063: Обновление Иллюстраций Портретов (Zone 1) и Синхронизация Кеша

**Status:** DONE  
**Target File(s):** `index.html`, `dist/assets/images/`  
**Parent Specification:** TASK-013, TASK-048, TASK-050, TASK-056, TASK-060  
**Assets Location:** `public/assets/images/`  

---

## 1. Контекст и Анализ Изменений

Пользователь сформулировал запрос:
> *«1. Обновить все иллюстрации <!-- Zone 1: Character Portrait PNG Layer»*

### Анализ графических ассетов:
1. В папке `public/assets/images/` размещены обновленные высокодетализированные PNG-иллюстрации оперативников отряда:
   - **`PORTRAIT PNG Presa4ek.png`** (обновлен: 10.09.2026 23:40, 1120 × 1600 px) — тактическая экипировка, нарукавник Under Armour, радиостанция, шеврон с эмблемой NUANCE, карабин с глушителем.
   - **`PORTRAIT PNG Art1zi.png`** (обновлен: 10.09.2026 23:41, 1120 × 1600 px) — тактический бронежилет с подсумками, шлем с ПНВ, тактические перчатки, часы, штурмовая винтовка.
   - **`PORTRAIT PNG Matvi4.png`** (1120 × 1600 px) — третий слот ростера.
2. **Проблема кеширования браузера:**  
   Поскольку имена файлов совпадают с ранее использовавшимися, браузеры и Vite dev-сервер могут отдавать закешированные старые версии из локального кеша пользователя.
3. **Необходимость синхронизации с `dist/`:**  
   В директории собранного проекта `dist/assets/images/` содержатся файлы предыдущей сборки. При запуске `npm run preview` или деплое необходима актуализация файлов.

---

## 2. Инженерная Спецификация (Implementation Spec)

### 2.1. Обновление Разметки и Сброс Кеша в `index.html`

Для гарантированного немедленного отображения обновленных иллюстраций всеми клиентами и браузерами без требования ручной очистки кеша (Ctrl+F5), к путям добавляется версионный query-параметр `?v=2`:

#### БЫЛО (строки 367–373):
```html
<!-- Zone 1: Character Portrait PNG Layer (.col-4 / .team-zone-1, z-index: 2) -->
<div class="col-4 team-zone-1">
  <div class="team-portrait-wrapper">
    <img src="/assets/images/PORTRAIT PNG Presa4ek.png" alt="Presa4ek Portrait" class="player-portrait-img layer-0 active" data-portrait-id="0" />
    <img src="/assets/images/PORTRAIT PNG Art1zi.png" alt="Art1zi Portrait" class="player-portrait-img layer-1" data-portrait-id="1" />
    <img src="/assets/images/PORTRAIT PNG Matvi4.png" alt="Matvi4 Portrait" class="player-portrait-img layer-2" data-portrait-id="2" />
  </div>
</div>
```

#### СТАЛО:
```html
<!-- Zone 1: Character Portrait PNG Layer (.col-4 / .team-zone-1, z-index: 2) -->
<div class="col-4 team-zone-1">
  <div class="team-portrait-wrapper">
    <img src="/assets/images/PORTRAIT PNG Presa4ek.png?v=2" alt="Presa4ek Portrait" class="player-portrait-img layer-0 active" data-portrait-id="0" />
    <img src="/assets/images/PORTRAIT PNG Art1zi.png?v=2" alt="Art1zi Portrait" class="player-portrait-img layer-1" data-portrait-id="1" />
    <img src="/assets/images/PORTRAIT PNG Matvi4.png?v=2" alt="Matvi4 Portrait" class="player-portrait-img layer-2" data-portrait-id="2" />
  </div>
</div>
```

---

### 2.2. Синергия с Дизайн-Спецификациями TASK-056 и TASK-060

Обновленные иллюстрации оперативников обладают высокой детализацией элементов снаряжения от шлема с ПНВ до обуви. Для их идеального отображения критически важны параметры из смежных задач:

1. **TASK-056 (Верхний горизонт):**  
   Слой `.team-zone-1` имеет подъем `margin-top: -76px`, за счет чего макушка бойца и навесное оборудование шлема стартуют строго на уровне подблока «КОМАНДА», максимально используя полезную высоту экрана.
2. **TASK-060 (Очистка от градиентных масок):**  
   - Псевдоэлемент `.team-portrait-wrapper::after` отключен (`display: none !important;`).
   - Свойства `mask-image: none !important;` и `-webkit-mask-image: none !important;` сняты с `.player-portrait-img`.
   - Это гарантирует, что ни шлем сверху, ни ботинки снизу не срезаются искусственными затемнениями, и новые детализированные арты выводятся со 100% резкостью.

---

### 2.3. Синхронизация Продакшн-Сборки (`dist/`)

При формировании релизной версии:
```bash
npm run build
```
Команда Vite автоматически перенесет обновленные файлы из `public/assets/images/` в `dist/assets/images/` и обновит ссылки в итоговом бандле.

---

## 3. Контрольный Чеклист Приемки (Verification Checklist)

| № | Проверяемый параметр | Ожидаемый результат | Статус проверки |
|---|----------------------|---------------------|-----------------|
| 1 | **Отображение Presa4ek** | Выводится обновленная иллюстрация с шевроном NUANCE, нарукавником Under Armour и карабином. | [x] Выполнено |
| 2 | **Отображение Art1zi** | Выводится обновленная иллюстрация с тактическим бронежилетом, ПНВ и штурмовой винтовкой. | [x] Выполнено |
| 3 | **Отображение Matvi4** | Выводится соответствующая иллюстрация для слота Matvi4 (id="2"). | [x] Выполнено |
| 4 | **Инвалидация кеша** | Изображения подгружаются сразу без необходимости ручной очистки кеша браузера (параметр `?v=2`). | [x] Выполнено |
| 5 | **Отсутствие масок (TASK-060)** | Новые иллюстрации не обрезаются виньетками сверху и снизу. | [x] Выполнено |
