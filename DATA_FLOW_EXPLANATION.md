# 📊 Куди Йдуть Дані з Опросників - Детальне Пояснення

## 🎯 Короткий Огляд

**Поточний стан (Demo-режим):**
Дані з опросників **зберігаються тільки в консолі браузера** (console.log) і **НЕ зберігаються** в базу даних.

**Production-режим (з GCP BigQuery):**
Дані можуть зберігатись в Google BigQuery через Flask API сервер.

---

## 🔄 Потік Даних - Детально

### 1️⃣ Employee Questionnaire (Опросник Співробітника)

**Що відбувається зараз:**

```
Користувач заповнює форму
         ↓
Натискає "Submit Survey"
         ↓
JavaScript перехоплює подію (preventDefault)
         ↓
Збирає дані з полів форми
         ↓
Формує JSON об'єкт
         ↓
console.log() - друкує в консоль браузера
         ↓
Показує повідомлення "Success!"
         ↓
Форма ховається
         ↓
ДАНІ ВТРАЧАЮТЬСЯ (не зберігаються)
```

**Код (app.js, рядки 241-273):**

```javascript
questionnaireForm.addEventListener('submit', function(e) {
    e.preventDefault();  // ⚠️ Блокує стандартну відправку
    
    // Збір даних
    const formData = {
        employeeId: document.getElementById('employeeId').value,
        environmentSatisfaction: document.getElementById('environmentSatisfaction').value,
        jobSatisfaction: document.getElementById('jobSatisfaction').value,
        relationshipSatisfaction: document.getElementById('relationshipSatisfaction').value,
        workLifeBalance: document.getElementById('workLifeBalance').value,
        submissionDate: new Date().toISOString()
    };

    // ⚠️ ТІЛЬКИ ЛОГУВАННЯ - дані не зберігаються!
    console.log('Employee Questionnaire Submitted:', formData);

    // ❌ GCP відключено (USE_GCP_INTEGRATION = false)
    if (USE_GCP_INTEGRATION && typeof submitQuestionnaireToGCP === 'function') {
        submitQuestionnaireToGCP(formData);  // Не викликається
    }

    // Показує повідомлення
    document.getElementById('questionnaireSuccess').style.display = 'block';
    questionnaireForm.style.display = 'none';

    // 💡 ЗАКОМЕНТОВАНИЙ КОД - як МАЄ бути в production:
    // fetch('/api/questionnaire', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });
});
```

**Що отримує користувач:**
- ✅ Повідомлення про успіх
- ✅ Форма ховається
- ❌ Дані НЕ зберігаються ніде

---

### 2️⃣ Manager Appraisal (Оцінка Менеджера)

**Що відбувається:**

```
Менеджер оцінює співробітника
         ↓
Заповнює форму оцінки
         ↓
Натискає "Submit Appraisal"
         ↓
JavaScript збирає дані
         ↓
console.log() - друкує в консоль
         ↓
Оновлює статус картки співробітника (UI only)
         ↓
Показує повідомлення успіху
         ↓
ДАНІ ВТРАЧАЮТЬСЯ
```

**Код (app.js, рядки 278-316):**

```javascript
appraisalForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        employeeId: document.getElementById('appraisalEmployeeId').value,
        jobInvolvement: document.getElementById('jobInvolvement').value
    };
    
    // ⚠️ ТІЛЬКИ ЛОГУВАННЯ
    console.log('Manager Appraisal Submitted:', formData);

    // ❌ GCP відключено
    if (USE_GCP_INTEGRATION && typeof submitAppraisalToGCP === 'function') {
        submitAppraisalToGCP(formData);
    }

    // Показує повідомлення і змінює UI
    document.getElementById('appraisalSuccess').style.display = 'block';
    document.getElementById('appraisalFormSection').style.display = 'none';
    updateEmployeeStatus(formData.employeeId);  // Тільки візуальна зміна!

    // 💡 ЗАКОМЕНТОВАНО - має бути в production:
    // fetch('/api/appraisal', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });
});
```

---

## 🛠️ Як Увімкнути Збереження Даних

### Варіант 1: Локальне Збереження (Швидке Рішення)

Зберігати дані в `localStorage` браузера (доступні тільки локально):

```javascript
// Додати в app.js після console.log():

// Збереження в localStorage
const existingData = JSON.parse(localStorage.getItem('questionnaires') || '[]');
existingData.push(formData);
localStorage.setItem('questionnaires', JSON.stringify(existingData));

// Перегляд збережених даних:
console.log('All saved questionnaires:', 
    JSON.parse(localStorage.getItem('questionnaires')));
```

**Переваги:**
- ✅ Швидко реалізувати
- ✅ Не потрібен сервер
- ✅ Працює офлайн

**Недоліки:**
- ❌ Дані тільки у браузері користувача
- ❌ Видаляються при очищенні кешу
- ❌ Не доступні іншим користувачам
- ❌ Обмеження ~5-10MB

---

### Варіант 2: Backend API (Професійне Рішення)

**Крок 1: Створити Backend Endpoint**

Використати існуючий `api_server.py` і додати ендпоінти:

```python
# Додати в api_server.py:

@app.route('/api/questionnaire', methods=['POST'])
def save_questionnaire():
    """Зберегти відповіді опросника в BigQuery"""
    try:
        data = request.get_json()
        
        # Підготовка даних
        rows_to_insert = [{
            'employee_id': data['employeeId'],
            'environment_satisfaction': int(data['environmentSatisfaction']),
            'job_satisfaction': int(data['jobSatisfaction']),
            'relationship_satisfaction': int(data['relationshipSatisfaction']),
            'work_life_balance': int(data['workLifeBalance']),
            'submission_date': data['submissionDate']
        }]
        
        # Вставка в BigQuery
        table_id = 'YOUR_GCP_PROJECT_ID.IBMAnalytics.questionnaire_responses'
        errors = client.insert_rows_json(table_id, rows_to_insert)
        
        if errors:
            return jsonify({'success': False, 'errors': errors}), 500
        
        return jsonify({'success': True, 'message': 'Questionnaire saved'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/appraisal', methods=['POST'])
def save_appraisal():
    """Зберегти оцінку менеджера в BigQuery"""
    try:
        data = request.get_json()
        
        rows_to_insert = [{
            'employee_id': data['employeeId'],
            'job_involvement': int(data['jobInvolvement']),
            'performance_rating': int(data.get('performanceRating', 3)),
            'appraisal_date': datetime.now().isoformat(),
            'manager_id': data.get('managerId', 'unknown')
        }]
        
        table_id = 'YOUR_GCP_PROJECT_ID.IBMAnalytics.appraisal_records'
        errors = client.insert_rows_json(table_id, rows_to_insert)
        
        if errors:
            return jsonify({'success': False, 'errors': errors}), 500
        
        return jsonify({'success': True, 'message': 'Appraisal saved'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
```

**Крок 2: Створити Таблиці в BigQuery**

```sql
-- Таблиця для опросників
CREATE TABLE `YOUR_GCP_PROJECT_ID.IBMAnalytics.questionnaire_responses` (
    employee_id STRING NOT NULL,
    environment_satisfaction INT64,
    job_satisfaction INT64,
    relationship_satisfaction INT64,
    work_life_balance INT64,
    submission_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);

-- Таблиця для оцінок
CREATE TABLE `YOUR_GCP_PROJECT_ID.IBMAnalytics.appraisal_records` (
    employee_id STRING NOT NULL,
    job_involvement INT64,
    performance_rating INT64,
    appraisal_date TIMESTAMP,
    manager_id STRING,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);
```

**Крок 3: Оновити Frontend (app.js)**

Розкоментувати fetch() виклики:

```javascript
// Замінити console.log() на:

fetch('http://localhost:5000/api/questionnaire', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log('✅ Questionnaire saved to database:', data);
        document.getElementById('questionnaireSuccess').style.display = 'block';
        questionnaireForm.style.display = 'none';
    } else {
        console.error('❌ Error saving questionnaire:', data.error);
        alert('Error saving questionnaire. Please try again.');
    }
})
.catch(error => {
    console.error('❌ Network error:', error);
    alert('Network error. Please check your connection.');
});
```

**Крок 4: Запустити Backend**

```bash
# В окремому терміналі:
cd /Users/yevrud/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site

# Встановити залежності (якщо ще не встановлено):
pip3 install flask flask-cors google-cloud-bigquery

# Налаштувати GCP credentials:
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"

# Запустити API сервер:
python3 api_server.py
```

**Крок 5: Увімкнути GCP Integration**

```javascript
// В app.js змінити:
const USE_GCP_INTEGRATION = true;  // Було: false
```

---

### Варіант 3: Простий JSON File Backend (Без GCP)

Якщо не хочете використовувати BigQuery:

**Створити простий Flask backend:**

```python
# simple_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATA_FILE = 'survey_data.json'

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {'questionnaires': [], 'appraisals': []}

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/questionnaire', methods=['POST'])
def save_questionnaire():
    try:
        data = load_data()
        survey_data = request.get_json()
        survey_data['saved_at'] = datetime.now().isoformat()
        data['questionnaires'].append(survey_data)
        save_data(data)
        return jsonify({'success': True, 'message': 'Saved successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/appraisal', methods=['POST'])
def save_appraisal():
    try:
        data = load_data()
        appraisal_data = request.get_json()
        appraisal_data['saved_at'] = datetime.now().isoformat()
        data['appraisals'].append(appraisal_data)
        save_data(data)
        return jsonify({'success': True, 'message': 'Saved successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/data', methods=['GET'])
def get_all_data():
    """Переглянути всі збережені дані"""
    return jsonify(load_data())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

**Запустити:**

```bash
pip3 install flask flask-cors
python3 simple_api.py
```

**Переглянути дані:**

```bash
# В браузері або curl:
curl http://localhost:5000/api/data

# Або відкрити файл:
cat survey_data.json
```

---

## 📊 Поточна Архітектура vs Production

### Поточний Стан (Demo)

```
┌─────────────────┐
│   Frontend      │
│  (index.html)   │
│                 │
│  User fills     │
│  form           │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   app.js        │
│                 │
│  1. preventDefault() ⚠️
│  2. console.log() ⚠️
│  3. Show success
│  4. Hide form
└─────────────────┘
         ↓
    ❌ ДАНІ ВТРАЧАЮТЬСЯ
```

### Production Architecture (Рекомендовано)

```
┌─────────────────┐
│   Frontend      │
│  (index.html)   │
│                 │
│  User fills     │
│  form           │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   app.js        │
│                 │
│  1. Collect data
│  2. fetch() POST ✅
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Flask API      │
│  (api_server.py)│
│  Port 5000      │
│                 │
│  1. Validate    │
│  2. Process     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  BigQuery       │
│  Database       │
│                 │
│  ✅ ЗБЕРІГАЄТЬСЯ │
│  ✅ Аналітика   │
│  ✅ Історія     │
└─────────────────┘
```

---

## 🔍 Як Перевірити Куди Йдуть Дані Зараз

### Метод 1: Browser Console

1. Відкрити платформу: http://localhost:8888
2. F12 → Console tab
3. Заповнити будь-яку форму
4. Натиснути Submit
5. Подивитись в Console - побачите:

```
Employee Questionnaire Submitted: {
  employeeId: "EMP001",
  environmentSatisfaction: "3",
  jobSatisfaction: "4",
  relationshipSatisfaction: "3",
  workLifeBalance: "2",
  submissionDate: "2025-12-01T20:15:00.000Z"
}
```

6. ⚠️ **Закрити вкладку → дані зникли назавжди**

### Метод 2: Network Tab

1. F12 → Network tab
2. Заповнити форму → Submit
3. ❌ **Немає запитів до /api/** - дані не відправляються!

### Метод 3: Перевірка localStorage

```javascript
// В Console виконати:
localStorage.getItem('questionnaires')
// → null (нічого не збережено)
```

---

## ✅ Рекомендації для Production

### Пріоритет 1: Критично Важливо

1. **Зберігати дані в БД** (BigQuery, PostgreSQL, MongoDB)
   - Інакше всі відповіді втрачаються
   
2. **Валідація на Backend**
   - Ніколи не довіряти frontend даним
   - Перевіряти типи, діапазони, формати

3. **Аутентифікація**
   - Тільки авторизовані користувачі
   - JWT tokens або session management

### Пріоритет 2: Важливо

4. **Error Handling**
   - Що якщо API недоступний?
   - Retry logic
   - Offline support

5. **Аудит Логи**
   - Хто, коли, що змінив
   - IP адреси
   - Timestamp для всього

6. **Backup & Recovery**
   - Автоматичні бекапи
   - Disaster recovery план

### Пріоритет 3: Покращення

7. **Real-time Updates**
   - WebSockets для live dashboard
   - Push notifications для менеджерів

8. **Export Features**
   - CSV/Excel експорт
   - PDF reports
   - Email notifications

9. **Analytics**
   - Trend analysis
   - Predictive models
   - Automated insights

---

## 🚀 План Впровадження

### Phase 1: Базове Збереження (1-2 дні)

```bash
✅ Створити simple_api.py
✅ Оновити app.js (розкоментувати fetch)
✅ Тестувати збереження в JSON
✅ Перевірити что дані зберігаються
```

### Phase 2: Database Integration (3-5 днів)

```bash
✅ Створити таблиці в BigQuery
✅ Налаштувати GCP credentials
✅ Оновити api_server.py
✅ Тестувати запис/читання
```

### Phase 3: Security & Validation (5-7 днів)

```bash
✅ Додати аутентифікацію
✅ Валідація на backend
✅ HTTPS/SSL
✅ Rate limiting
✅ Input sanitization
```

### Phase 4: Advanced Features (2-3 тижні)

```bash
✅ Real-time dashboard
✅ Email notifications
✅ Export функціонал
✅ Advanced analytics
```

---

## 📝 Висновок

**Зараз:**
- ❌ Дані НЕ зберігаються
- ❌ Тільки console.log
- ❌ Втрачаються при закритті браузера
- ✅ Працює як demo/прототип

**Для Production потрібно:**
1. Backend API (Flask/Django/Node.js)
2. Database (BigQuery/PostgreSQL/MongoDB)
3. Proper error handling
4. Authentication & authorization
5. Data validation
6. Backups & security

**Найпростіший старт:**
Використати `simple_api.py` з JSON файлами → пізніше мігрувати на BigQuery.

---

## 🔗 Корисні Ресурси

- [Flask Quickstart](https://flask.palletsprojects.com/en/2.3.x/quickstart/)
- [BigQuery Python Client](https://cloud.google.com/bigquery/docs/reference/libraries)
- [CORS in Flask](https://flask-cors.readthedocs.io/)
- [JSON Web Tokens](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Дата:** 1 грудня 2025  
**Статус:** Demo-режим (дані не зберігаються)  
**Наступний крок:** Впровадити Варіант 2 або 3 для збереження даних
