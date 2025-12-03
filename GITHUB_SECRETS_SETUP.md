# 🔐 Настройка GitHub Secrets для Cloud Run

## Шаг 1: Откройте настройки GitHub

Перейдите по ссылке:
```
https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/settings/secrets/actions
```

## Шаг 2: Добавьте GCP_PROJECT_ID

1. Нажмите **"New repository secret"**
2. Name: `GCP_PROJECT_ID`
3. Secret: `core-trees-478718-g0`
4. Нажмите **"Add secret"**

## Шаг 3: Добавьте GCP_SA_KEY

1. Нажмите **"New repository secret"**
2. Name: `GCP_SA_KEY`
3. Secret: Содержимое файла `/Users/yevrud/Downloads/core-trees-478718-g0-872ed77c14e2.json`

### Как получить содержимое:

**Вариант 1 - Через терминал:**
```bash
cat /Users/yevrud/Downloads/core-trees-478718-g0-872ed77c14e2.json | pbcopy
```
Это скопирует весь файл в буфер обмена.

**Вариант 2 - Через текстовый редактор:**
1. Откройте файл в TextEdit или VSCode
2. Выделите **ВСЁ** содержимое (Cmd+A)
3. Скопируйте (Cmd+C)
4. Вставьте в поле Secret на GitHub

**⚠️ ВАЖНО:** Файл должен начинаться с `{` и заканчиваться `}`

4. Нажмите **"Add secret"**

## Шаг 4: Проверьте secrets

У вас должно быть 2 secrets:
- ✅ `GCP_PROJECT_ID`
- ✅ `GCP_SA_KEY`

## Шаг 5: Запустите деплой

### Автоматический деплой:
После коммита в main ветку, GitHub Actions автоматически задеплоит на Cloud Run.

### Ручной деплой:
1. Перейдите в **Actions** → **Deploy to Google Cloud Run**
2. Нажмите **"Run workflow"**
3. Выберите ветку **main**
4. Нажмите **"Run workflow"**

## Шаг 6: Получите URL API

После успешного деплоя:
1. Откройте вкладку **Actions**
2. Выберите последний workflow **Deploy to Google Cloud Run**
3. В логах найдите строку с URL:
```
SERVICE_URL=https://hr-analytics-api-XXXXX-uc.a.run.app
```

## Шаг 7: Обновите config.js (если нужно)

Если URL отличается от предустановленного, обновите файл `js/config.js`:
```javascript
const CLOUD_RUN_API_URL = 'https://your-actual-url-here/api';
```

---

## ✅ Готово!

Теперь ваше приложение:
- 📊 Сохраняет данные в BigQuery
- 🌐 API работает на Cloud Run
- 🔒 Credentials безопасно хранятся в GitHub Secrets
- 🚀 Автоматически деплоится при каждом commit

## 🔍 Проверка работы

1. Откройте: https://yevheniia-rudenko.github.io/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site/
2. Проверьте консоль браузера (F12):
   ```
   🔧 Environment: production
   🌐 API URL: https://hr-analytics-api-...
   ✅ API Backend: Enabled
   ```
3. Статус API должен показывать: **"API Online ✓"**
4. Заполните форму → данные сохраняются в BigQuery
5. Обновите страницу → данные загружаются из BigQuery

---

## 🛠 Устранение проблем

### Secret не добавляется
- Убедитесь, что у вас есть права Admin на репозиторий
- Проверьте, что скопировали ВСЁ содержимое JSON файла

### Workflow fails
- Проверьте, что оба secrets добавлены правильно
- Проверьте логи в Actions
- Убедитесь, что GCP Service Account имеет нужные права

### API не отвечает
- Проверьте URL в config.js
- Проверьте CORS в simple_api.py
- Проверьте логи Cloud Run:
  ```bash
  gcloud run services logs read hr-analytics-api --region=us-central1
  ```
