# 📊 How Form Data Affects the Dashboard

## Data Flow Overview

This documentation explains how data entered by users in forms is processed and affects the dashboard visualization in real-time.

---

## 🔄 Complete Data Processing Cycle

### 1️⃣ **User Fills Out Form**

#### Employee Questionnaire
```javascript
// Form data:
{
  employeeId: "TEST001",
  environmentSatisfaction: "4",  // Rating from 1 to 4
  jobSatisfaction: "3",          // Rating from 1 to 4
  relationshipSatisfaction: "4",  // Rating from 1 to 4
  workLifeBalance: "3",          // Rating from 1 to 4
  submissionDate: "2025-12-01T10:00:00.000Z"
}
```

#### Manager Appraisal
```javascript
// Form data:
{
  employeeId: "TEST001",
  performanceRating: "4",   // Rating from 1 to 4
  jobInvolvement: "3",      // Rating from 1 to 4
  appraisalDate: "2025-12-01T12:00:00.000Z"
}
```

---

### 2️⃣ **Data Sent to Server (Frontend → Backend)**

#### Code in `app.js`:
```javascript
// When user submits questionnaire
questionnaireForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        employeeId: document.getElementById('employeeId').value,
        environmentSatisfaction: document.getElementById('environmentSatisfaction').value,
        jobSatisfaction: document.getElementById('jobSatisfaction').value,
        relationshipSatisfaction: document.getElementById('relationshipSatisfaction').value,
        workLifeBalance: document.getElementById('workLifeBalance').value,
        submissionDate: new Date().toISOString()
    };
    
    // Send POST request to backend
    fetch('http://localhost:5001/api/questionnaire', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Survey saved!', data);
        
        // Update dashboard after 500ms
        setTimeout(updateDashboardStats, 500);
    });
});
```

---

### 3️⃣ **Backend Processes Data (simple_api.py)**

```python
@app.route('/api/questionnaire', methods=['POST'])
def save_questionnaire():
    try:
        # Get data from request
        data = request.json
        
        # Generate unique ID
        submission_id = f"Q-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Add ID to data
        data['id'] = submission_id
        
        # Read existing questionnaires
        if os.path.exists(QUESTIONNAIRES_FILE):
            with open(QUESTIONNAIRES_FILE, 'r') as f:
                questionnaires = json.load(f)
        else:
            questionnaires = []
        
        # Add new questionnaire
        questionnaires.append(data)
        
        # Save to file
        with open(QUESTIONNAIRES_FILE, 'w') as f:
            json.dump(questionnaires, f, indent=2)
        
        return jsonify({
            'success': True,
            'message': 'Questionnaire saved successfully',
            'id': submission_id
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
```

---

### 4️⃣ **Data Saved to JSON File**

#### File: `data/questionnaires.json`
```json
[
  {
    "id": "Q-20251201100000",
    "employeeId": "TEST001",
    "environmentSatisfaction": "4",
    "jobSatisfaction": "3",
    "relationshipSatisfaction": "4",
    "workLifeBalance": "3",
    "submissionDate": "2025-12-01T10:00:00.000Z"
  },
  {
    "id": "Q-20251201110000",
    "employeeId": "TEST002",
    "environmentSatisfaction": "3",
    "jobSatisfaction": "4",
    "relationshipSatisfaction": "3",
    "workLifeBalance": "4",
    "submissionDate": "2025-12-01T11:00:00.000Z"
  }
]
```

---

### 5️⃣ **Frontend Requests Updated Statistics**

```javascript
function updateDashboardStats() {
    // Request satisfaction statistics
    fetch('http://localhost:5001/api/satisfaction-stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateSatisfactionDisplay(data.data);
            }
        });
    
    // Request performance statistics
    fetch('http://localhost:5001/api/performance-stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updatePerformanceDisplay(data.data);
            }
        });
}
```

---

### 6️⃣ **Backend Calculates Statistics**

```python
@app.route('/api/satisfaction-stats', methods=['GET'])
def get_satisfaction_stats():
    try:
        # Read questionnaires
        if not os.path.exists(QUESTIONNAIRES_FILE):
            return jsonify({
                'success': True,
                'data': {
                    'total_responses': 0,
                    'avg_environment': 0,
                    'avg_job': 0,
                    'avg_relationship': 0,
                    'avg_work_life_balance': 0,
                    'avg_overall': 0
                }
            })
        
        with open(QUESTIONNAIRES_FILE, 'r') as f:
            questionnaires = json.load(f)
        
        # Calculate averages
        total = len(questionnaires)
        
        avg_env = sum(int(q['environmentSatisfaction']) for q in questionnaires) / total
        avg_job = sum(int(q['jobSatisfaction']) for q in questionnaires) / total
        avg_rel = sum(int(q['relationshipSatisfaction']) for q in questionnaires) / total
        avg_wlb = sum(int(q['workLifeBalance']) for q in questionnaires) / total
        avg_overall = (avg_env + avg_job + avg_rel + avg_wlb) / 4
        
        return jsonify({
            'success': True,
            'data': {
                'total_responses': total,
                'avg_environment': round(avg_env, 2),
                'avg_job': round(avg_job, 2),
                'avg_relationship': round(avg_rel, 2),
                'avg_work_life_balance': round(avg_wlb, 2),
                'avg_overall': round(avg_overall, 2)
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
```

---

### 7️⃣ **Frontend Updates Dashboard**

#### Update KPI Cards:
```javascript
function updateSatisfactionDisplay(stats) {
    // Update "Live Satisfaction" KPI
    const satisfactionElement = document.getElementById('liveSatisfaction');
    if (satisfactionElement) {
        satisfactionElement.textContent = stats.avg_overall.toFixed(2);
        
        // Add pulse animation
        satisfactionElement.classList.add('pulse');
        setTimeout(() => {
            satisfactionElement.classList.remove('pulse');
        }, 1000);
    }
    
    // Update "Total Surveys" KPI
    const totalElement = document.getElementById('totalSurveys');
    if (totalElement) {
        totalElement.textContent = stats.total_responses;
    }
}
```

#### Update Charts:
```javascript
function updateSatisfactionChart(stats) {
    // Update chart data
    satisfactionChart.data.datasets[0].data = [
        stats.avg_environment,
        stats.avg_job,
        stats.avg_relationship,
        stats.avg_work_life_balance
    ];
    
    // Animate chart update
    satisfactionChart.update('active');
}
```

#### Update Progress Bars:
```javascript
function updateProgressBars(stats) {
    // Environment Satisfaction
    const envBar = document.getElementById('envProgressBar');
    const envPercent = (stats.avg_environment / 4) * 100;
    envBar.style.width = envPercent + '%';
    
    // Job Satisfaction
    const jobBar = document.getElementById('jobProgressBar');
    const jobPercent = (stats.avg_job / 4) * 100;
    jobBar.style.width = jobPercent + '%';
    
    // And so on...
}
```

---

## 📊 Visual Impact on Dashboard

### Before Submission:
```
Total Surveys: 0
Live Satisfaction: 0.00/4
Charts: Empty or with default data
Progress Bars: 0%
```

### After 1st Submission (4, 3, 4, 3):
```
Total Surveys: 1
Live Satisfaction: 3.50/4
Environment: 4.00 (100% bar)
Job: 3.00 (75% bar)
Relationship: 4.00 (100% bar)
Work-Life: 3.00 (75% bar)
```

### After 2nd Submission (3, 4, 3, 4):
```
Total Surveys: 2
Live Satisfaction: 3.50/4 (same, coincidentally)
Environment: 3.50 (87.5% bar)
Job: 3.50 (87.5% bar)
Relationship: 3.50 (87.5% bar)
Work-Life: 3.50 (87.5% bar)
```

### After 3rd Submission (2, 2, 2, 2):
```
Total Surveys: 3
Live Satisfaction: 3.00/4
Environment: 3.00 (75% bar)
Job: 3.00 (75% bar)
Relationship: 3.00 (75% bar)
Work-Life: 3.00 (75% bar)
```

---

## 🔍 Step-by-Step Example

### Scenario: Employee submits survey with all 4s

**Step 1: Form Submission**
```
User enters:
- Employee ID: EMP123
- Environment: 4
- Job: 4
- Relationship: 4
- Work-Life: 4
```

**Step 2: Data Processing**
```
POST http://localhost:5001/api/questionnaire
{
  "employeeId": "EMP123",
  "environmentSatisfaction": "4",
  "jobSatisfaction": "4",
  "relationshipSatisfaction": "4",
  "workLifeBalance": "4",
  "submissionDate": "2025-12-01T10:00:00.000Z"
}
```

**Step 3: Backend Response**
```
{
  "success": true,
  "message": "Questionnaire saved successfully",
  "id": "Q-20251201100000"
}
```

**Step 4: Statistics Calculation**
```
If this is the 1st response:
- Total: 1
- Avg Environment: 4.00
- Avg Job: 4.00
- Avg Relationship: 4.00
- Avg Work-Life: 4.00
- Avg Overall: 4.00

If there were 2 previous responses with avg 3.00:
- Total: 3
- New avg = (3.00 * 2 + 4.00) / 3 = 3.33
```

**Step 5: UI Updates**
```javascript
// KPI Card animates from 3.00 to 3.33
liveSatisfactionElement.textContent = '3.33';
liveSatisfactionElement.classList.add('pulse');

// Chart bars grow smoothly
satisfactionChart.update('active');

// Progress bars fill with animation
envProgressBar.style.width = '83.25%';  // (3.33/4)*100
```

**Step 6: User Sees Result**
```
✅ Success message: "Survey submitted successfully!"
📊 KPI updated: 3.00 → 3.33 (with pulse animation)
📈 Chart updated: Bars grow smoothly
📊 Progress bars: Fill to new percentages
📝 Recent Submissions: New entry appears at top
```

---

## 🎯 Real-Time Features

### Immediate Updates (< 1 second)
- Success/error message display
- Form reset
- Button state changes

### Quick Updates (500ms delay)
- KPI card values
- Chart data
- Statistics recalculation

### Delayed Updates (30 seconds auto-refresh)
- Live Insights tab
- Recent submissions list
- Trend charts

---

## 💡 Pro Tips

### For Developers:
1. **Debouncing**: Use `setTimeout` to batch updates
2. **Caching**: Store recent stats to reduce API calls
3. **Optimistic UI**: Update UI immediately, then verify
4. **Error Handling**: Always have fallback for failed requests

### For Users:
1. **Wait for Confirmation**: Don't submit twice
2. **Check API Status**: Ensure backend is running
3. **Refresh Manually**: Use refresh button if auto-update fails
4. **Export Regularly**: Backup your data to CSV/JSON

---

## 🔄 Data Flow Diagram

```
┌─────────────────┐
│  User Form      │
│  - Input Data   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JavaScript     │
│  - Validation   │
│  - Collect Data │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  POST Request   │
│  /api/quest...  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Flask Backend  │
│  - Receive      │
│  - Validate     │
│  - Save JSON    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON File      │
│  - Append Data  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GET Request    │
│  /api/stats     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Calculate Stats│
│  - Averages     │
│  - Totals       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Update UI      │
│  - KPI Cards    │
│  - Charts       │
│  - Progress     │
└─────────────────┘
```

---

## 📚 Related Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** — Complete user guide
- **[FEATURES_LIST.md](FEATURES_LIST.md)** — All features
- **[START_HERE.md](START_HERE.md)** — Quick start
- **[README.md](README.md)** — Project overview

---

**Version:** 2.0  
**Last Updated:** December 2025  
**Author:** Yevheniia Rudenko
