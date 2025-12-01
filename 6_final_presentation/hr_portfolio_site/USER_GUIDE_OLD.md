# 📖 HR Analytics System - User Guide

## 🎯 Complete User Manual

Welcome to **HR Analytics System** — a comprehensive platform for employee data analysis, conducting surveys, and managing performance.

---

## 🚀 Quick Start

### 1. System Launch

```bash
# Step 1: Start the backend API
cd /Users/yevrud/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site
python3 simple_api.py

# Step 2: In a new terminal, start the frontend
python3 -m http.server 8888

# Step 3: Open in browser
# http://localhost:8888
```

### 2. Status Check

In the top right corner of the navigation bar, you will see the API status indicator:
- 🟢 **API Online** — system is working correctly
- 🟡 **Checking API...** — checking connection
- 🔴 **API Offline** — backend is not running

---

## 📋 Main Tabs

### 📊 Overview

**Purpose:** Main dashboard with employee analytics

**Key Metrics:**
- **Total Employees**: 1,470 active employees
- **Attrition Rate**: 16.1% (237 departed)
- **Avg. Job Satisfaction**: 2.73/4
- **Avg. Tenure**: 7.0 years

**Charts:**
1. **Attrition by Department** — employee turnover by department
2. **Attrition by Age Group** — turnover by age groups
3. **Overtime Impact** — impact of overtime work
4. **Work-Life Balance** — work-life balance distribution

**Key Insights:**
- Sales department has the highest turnover (38.8%)
- Employees aged 18-25 leave more often (35%)
- Overtime increases turnover by 3x
- 15% of employees have poor work-life balance

---

### 📝 Employee Survey

**Purpose:** Collect feedback from employees

**How to use:**
1. Enter **Employee ID** (e.g., EMP001)
2. Rate **4 parameters** on a scale of 1-4:
   - Environment Satisfaction
   - Job Satisfaction
   - Relationship Satisfaction
   - Work-Life Balance
3. Click **Submit Survey**

**What happens:**
- ✅ Data is saved to `data/questionnaires.json`
- 📊 Statistics update automatically
- 🔄 KPIs and charts are recalculated in real-time

**Rating Scale:**
- **1** — Low
- **2** — Medium
- **3** — High
- **4** — Very High

---

### ⭐ Manager Reviews (Оценка менеджера)

**Назначение:** Ежегодная оценка производительности сотрудников

**Процесс:**
1. Выберите сотрудника из списка
2. Нажмите **Evaluate** для начала оценки
3. Заполните форму оценки:
   - **Job Involvement** (Вовлеченность)
   - **Performance Rating** (Оценка производительности)
   - **Communication Skills** (Коммуникация)
   - **Innovation** (Инновационность)
   - **Leadership** (Лидерство)
4. Добавьте **Comments** (комментарии)
5. Нажмите **Submit Appraisal**

**Статусы сотрудников:**
- 🟡 **Appraisal Pending** — оценка не проведена
- 🟢 **Completed** — оценка завершена

**Лучшие практики:**
- Будьте конкретны — используйте примеры
- Будьте объективны — оценивайте работу, а не личность
- Баланс — отмечайте сильные стороны и области роста
- Ставьте цели — определяйте четкие задачи развития

---

### 📈 Live Insights (Живая аналитика)

**Назначение:** Реальная статистика на основе отправленных данных

**Основные блоки:**

#### 1. Real-time Statistics (KPI карточки)
- **Total Surveys** — количество заполненных опросов
- **Live Satisfaction** — текущая средняя удовлетворенность
- **Total Appraisals** — количество проведенных оценок
- **Live Performance** — текущая средняя производительность

#### 2. Live Satisfaction Breakdown (График)
Разбивка удовлетворенности по 4 категориям с реальными данными

#### 3. Satisfaction Trends (Тренд)
График изменения общей удовлетворенности по мере добавления данных

#### 4. Detailed Statistics (Детальная статистика)
Карточки с прогресс-барами для каждой категории:
- Environment Satisfaction
- Job Satisfaction
- Relationship Satisfaction
- Work-Life Balance

#### 5. Recent Submissions (Последние отправки)
Список из 10 последних submissions с:
- Типом (Survey/Appraisal)
- ID сотрудника
- Временем отправки
- Уникальным ID записи

#### 6. Data Management (Управление данными)
Кнопки для работы с данными:
- **📄 Export as JSON** — экспорт в JSON формат
- **📊 Export as CSV** — экспорт в CSV формат
- **👁️ View All Data** — просмотр всех данных в новом окне
- **🗑️ Clear All Data** — очистка всех данных (с подтверждением)

**Автообновление:**
- Данные обновляются каждые 30 секунд
- При переключении на вкладку — мгновенное обновление
- После отправки формы — автообновление через 500ms

---

### ℹ️ About (О проекте)

**Содержит:**
- 🎯 Project Overview — описание проекта
- 🛠️ Technology Stack — используемые технологии
- 👥 Team Members — команда разработки
- 📚 Resources — полезные ссылки

---

## 🧪 Дополнительные инструменты

### 📚 Documentation (Документация)
Кнопка в навигации → `how-it-works.html`

**Содержит:**
- Как работает система
- Архитектура проекта
- Детали ML моделей
- GCP интеграция
- API документация

### 🧪 Test Lab (Тестовая лаборатория)
Кнопка в навигации → `test-data-flow.html`

**Возможности:**
- Тестирование форм в изолированной среде
- Визуализация потока данных в реальном времени
- Console log для отладки
- Интерактивные графики
- Мгновенное обновление статистики

**Как использовать:**
1. Откройте Test Lab в новой вкладке
2. Заполните форму Employee Questionnaire или Manager Appraisal
3. Нажмите Submit
4. Наблюдайте, как обновляются:
   - KPI карточки
   - Детальная статистика
   - Графики (столбчатые)
   - Console log

---

## 🔄 Поток данных (как это работает)

```
1. Пользователь заполняет форму
   ↓
2. JavaScript собирает данные и отправляет POST запрос
   ↓
3. Flask API получает данные
   ↓
4. Данные сохраняются в data/*.json файлы
   ↓
5. Frontend запрашивает обновленную статистику (GET)
   ↓
6. Backend вычисляет средние значения
   ↓
7. Frontend обновляет KPI и графики с анимацией
   ↓
8. Пользователь видит обновленные данные (через 500ms)
```

---

## 📊 API Endpoints

### POST /api/questionnaire
Сохранение опроса сотрудника

**Request:**
```json
{
  "employeeId": "EMP001",
  "environmentSatisfaction": "4",
  "jobSatisfaction": "4",
  "relationshipSatisfaction": "3",
  "workLifeBalance": "3",
  "submissionDate": "2025-12-01T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Questionnaire saved successfully",
  "id": "Q-20251201100000"
}
```

### POST /api/appraisal
Сохранение оценки менеджера

**Request:**
```json
{
  "employeeId": "EMP001",
  "performanceRating": "4",
  "jobInvolvement": "3",
  "appraisalDate": "2025-12-01T12:00:00.000Z"
}
```

### GET /api/satisfaction-stats
Получение статистики удовлетворенности

**Response:**
```json
{
  "success": true,
  "data": {
    "total_responses": 5,
    "avg_environment": 3.2,
    "avg_job": 3.6,
    "avg_relationship": 3.2,
    "avg_work_life_balance": 2.8,
    "avg_overall": 3.2
  }
}
```

### GET /api/performance-stats
Получение статистики производительности

### GET /api/all-data
Получение всех сохраненных данных

### GET /api/health
Проверка работоспособности API

---

## 💡 Советы по использованию

### Для сотрудников:
1. **Будьте честны** — ваши ответы анонимны и помогают улучшить рабочую среду
2. **Заполняйте регулярно** — лучше отправлять опросы каждый квартал
3. **Используйте комментарии** — объясните свои оценки, если есть что добавить

### Для менеджеров:
1. **Готовьтесь заранее** — собирайте примеры в течение года
2. **Будьте объективны** — используйте конкретные метрики
3. **Проводите диалог** — обсуждайте оценку с сотрудником
4. **Ставьте SMART цели** — конкретные, измеримые, достижимые

### Для HR:
1. **Мониторьте Live Insights** — отслеживайте тренды в реальном времени
2. **Анализируйте паттерны** — ищите корреляции в данных
3. **Экспортируйте данные** — регулярно делайте backup в CSV/JSON
4. **Используйте инсайты** — принимайте решения на основе данных

---

## 🎨 Визуальные индикаторы

### KPI Trends (Тренды KPI)
- 🟢 **Positive** (зеленый) — показатель растет
- 🟡 **Neutral** (желтый) — показатель стабилен
- 🔴 **Negative** (красный) — показатель падает

### Progress Bars (Прогресс бары)
- Синий градиент — прогресс от 0% до 100%
- Заполнение = (значение / 4) × 100%

### Анимации
- **Pulse** — пульсация при обновлении KPI
- **Fade In** — плавное появление элементов
- **Slide Up** — анимация снизу вверх
- **Chart Update** — плавное изменение графиков

---

## ⚙️ Конфигурация

В файле `js/app.js`:

```javascript
const API_URL = 'http://localhost:5001/api';  // URL backend API
const USE_API_BACKEND = true;                 // Включить сохранение данных
const USE_GCP_INTEGRATION = false;            // GCP интеграция (пока отключено)
```

---

## 🐛 Устранение неполадок

### Графики не отображаются
**Решение:**
1. Откройте DevTools (F12) → Console
2. Проверьте ошибки JavaScript
3. Убедитесь, что Chart.js загружен
4. Обновите страницу (Ctrl+Shift+R)

### API Offline
**Решение:**
1. Проверьте, запущен ли `simple_api.py`
2. Убедитесь, что порт 5001 свободен
3. Проверьте логи в терминале

### Данные не сохраняются
**Решение:**
1. Проверьте статус API (должен быть Online)
2. Откройте Network tab в DevTools
3. Проверьте, что POST запросы возвращают 200 OK
4. Убедитесь, что папка `data/` существует

### Статистика не обновляется
**Решение:**
1. Проверьте `USE_API_BACKEND = true` в app.js
2. Обновите вкладку Live Insights вручную (кнопка Refresh)
3. Проверьте console.log на наличие ошибок

---

## 📁 Структура файлов

```
hr_portfolio_site/
├── index.html                  # Главная страница
├── how-it-works.html          # Документация
├── test-data-flow.html        # Тестовая лаборатория
├── css/
│   └── styles.css             # Все стили
├── js/
│   └── app.js                 # Вся логика
├── simple_api.py              # Flask backend API
├── data/
│   ├── questionnaires.json    # Опросы сотрудников
│   └── appraisals.json        # Оценки менеджеров
└── docs/
    ├── QUICK_START.md
    ├── DATA_FLOW_EXPLANATION.md
    ├── FORM_TO_DASHBOARD_FLOW.md
    ├── DASHBOARD_DOCUMENTATION.md
    ├── UI_MODERNIZATION_SUMMARY.md
    └── USER_GUIDE.md          # Этот файл
```

---

## 🎯 Часто задаваемые вопросы (FAQ)

**Q: Можно ли удалить отправленный опрос?**  
A: В текущей версии — нет. Но можно очистить все данные через "Clear All Data" или вручную удалить из JSON файлов.

**Q: Сколько данных можно хранить?**  
A: Ограничений нет, все данные хранятся в JSON файлах локально.

**Q: Можно ли экспортировать данные в Excel?**  
A: Да, экспортируйте в CSV формат, затем откройте в Excel.

**Q: Как изменить порт API?**  
A: В `simple_api.py` измените `app.run(port=5001)` на нужный порт, и обновите `API_URL` в `app.js`.

**Q: Работает ли система офлайн?**  
A: Частично. Дашборды и графики работают, но сохранение данных требует запущенного API.

**Q: Можно ли развернуть в продакшене?**  
A: Да, но нужно:
- Заменить Flask на production WSGI сервер (Gunicorn)
- Использовать PostgreSQL вместо JSON файлов
- Настроить HTTPS
- Добавить аутентификацию

---

## 📞 Поддержка

**Документация:**
- [QUICK_START.md](QUICK_START.md) — быстрый старт
- [DATA_FLOW_EXPLANATION.md](DATA_FLOW_EXPLANATION.md) — поток данных
- [FORM_TO_DASHBOARD_FLOW.md](FORM_TO_DASHBOARD_FLOW.md) — влияние форм на дашборд

**GitHub Repository:**
https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics

**Автор:** Yevheniia Rudenko  
**Проект:** MIT Emerging Talent - ELO-2 Module  
**Дата:** 2025-12-01  
**Версия:** 2.0

---

**Приятного использования! 🎉**
