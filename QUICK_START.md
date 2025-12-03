# 🚀 Quick Start Guide - GCP Cloud Run Deployment

## Что сейчас нужно сделать

### 1️⃣ Добавить GitHub Secrets (5 минут)

Откройте терминал и выполните:

```bash
# Скопируйте содержимое service account key в буфер обмена
cat /Users/yevrud/Downloads/core-trees-478718-g0-872ed77c14e2.json | pbcopy
```

Теперь идите на GitHub:
👉 https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/settings/secrets/actions

Добавьте 2 secrets:

**Secret 1:**
- Name: `GCP_PROJECT_ID`
- Value: `core-trees-478718-g0`

**Secret 2:**
- Name: `GCP_SA_KEY`
- Value: Вставьте из буфера обмена (Cmd+V)

### 2️⃣ Закоммитить и запушить изменения

```bash
cd /Users/yevrud/ELO-2---HR-Analytics

# Добавить все файлы
git add .

# Создать коммит
git commit -m "🚀 Setup BigQuery API integration with Cloud Run

- Created app_bigquery.py with full BigQuery integration
- Updated Dockerfile to use BigQuery API
- Added config.js for automatic API URL detection
- Enabled Cloud Run deployment workflow
- Updated CORS for GitHub Pages domain
- Ready for production deployment"

# Запушить в main
git push origin main
```

### 3️⃣ Дождаться деплоя (3-5 минут)

После push:
1. Откройте: https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/actions
2. Найдите workflow "Deploy to Google Cloud Run"
3. Дождитесь зеленой галочки ✅

### 4️⃣ Получить URL API

В логах workflow найдите:
```
SERVICE_URL=https://hr-analytics-api-XXXXX-uc.a.run.app
```

### 5️⃣ Обновить config.js (если нужно)

Если URL отличается, обновите `js/config.js`:
```javascript
const CLOUD_RUN_API_URL = 'https://ваш-url-здесь/api';
```

### 6️⃣ Проверить работу

Откройте: https://yevheniia-rudenko.github.io/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site/

В консоли браузера (F12) должно быть:
```
🔧 Environment: production
🌐 API URL: https://hr-analytics-api-...
✅ API Backend: Enabled
```

---

## 🧪 Тестирование локально (опционально)

```bash
cd 6_final_presentation/hr_portfolio_site
./test_bigquery_api.sh
```

Откройте в браузере: http://localhost:8080/api/health

---

## 📊 Что происходит под капотом

1. **Frontend** (GitHub Pages):
   - Определяет, что не localhost
   - Использует Cloud Run API URL
   - Отправляет данные формы на API

2. **API** (Cloud Run):
   - Получает данные
   - Сохраняет в BigQuery (`questionnaires` и `appraisals` таблицы)
   - Возвращает статистику

3. **Database** (BigQuery):
   - Хранит все данные
   - Доступен из любой точки мира
   - Бесплатный Free Tier

---

## ✅ Что готово

- ✅ BigQuery API (`app_bigquery.py`)
- ✅ Dockerfile настроен
- ✅ GitHub Actions workflow активирован
- ✅ Frontend auto-detection (config.js)
- ✅ CORS настроен для GitHub Pages
- ✅ Все credentials безопасно хранятся

## ⏳ Что нужно сделать

- ⏳ Добавить GitHub Secrets
- ⏳ Закоммитить изменения
- ⏳ Дождаться деплоя
- ⏳ Проверить работу

---

## 🎉 После завершения

Ваше приложение будет:
- 🌍 Доступно глобально через HTTPS
- 💾 Сохранять данные в BigQuery
- 📊 Показывать реал-тайм статистику
- 🔒 Полностью безопасно
- 💰 Бесплатно (Free Tier)

**Всё работает красиво и наглядно!** ✨
