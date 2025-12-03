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
http://localhost:8888
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
- R&D department has the highest attrition with 133 departures (56.1%)
- Sales follows with 92 departures (38.8%)
- Employees aged 18-25 leave more often (36%)
- Overtime increases turnover by 3x
- 29% of employees have poor work-life balance (ratings 1-2)

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

### ⭐ Manager Reviews

**Purpose:** Annual performance evaluation of employees

**Process:**
1. Select an employee from the list
2. Click **Evaluate** to begin assessment
3. Fill out the evaluation form:
   - **Job Involvement**
   - **Performance Rating**
   - **Communication Skills**
   - **Innovation**
   - **Leadership**
4. Add **Comments**
5. Click **Submit Appraisal**

**Employee Status:**
- 🟡 **Appraisal Pending** — not yet evaluated
- 🟢 **Completed** — evaluation complete

**Best Practices:**
- Be specific — use concrete examples
- Be objective — evaluate work, not personality
- Balance — note strengths and areas for improvement
- Set goals — define clear development tasks

---

### 📈 Live Insights

**Purpose:** Real-time statistics based on submitted data

**Main Sections:**

#### 1. Real-time Statistics (KPI Cards)
- **Total Surveys** — number of completed surveys
- **Live Satisfaction** — current average satisfaction
- **Total Appraisals** — number of completed appraisals
- **Live Performance** — current average performance

#### 2. Live Satisfaction Breakdown (Chart)
Breakdown of satisfaction across 4 categories with real data

#### 3. Satisfaction Trends (Trend Chart)
Graph showing changes in overall satisfaction as data is added

#### 4. Detailed Statistics
Cards with progress bars for each category:
- Environment Satisfaction
- Job Satisfaction
- Relationship Satisfaction
- Work-Life Balance

#### 5. Recent Submissions
List of the last 10 submissions with:
- Type (Survey/Appraisal)
- Employee ID
- Submission time
- Unique record ID

#### 6. Data Management
Buttons for data operations:
- **📄 Export as JSON** — export in JSON format
- **📊 Export as CSV** — export in CSV format
- **👁️ View All Data** — view all data in new window
- **🗑️ Clear All Data** — delete all data (with confirmation)

**Auto-refresh:**
- Data updates every 30 seconds
- Instant update when switching to tab
- Auto-update 500ms after form submission

---

### ℹ️ About

**Contains:**
- 🎯 Project Overview — project description
- 🛠️ Technology Stack — technologies used
- 👥 Team Members — development team
- 📚 Resources — useful links

---

## 🧪 Additional Tools

### 📚 Documentation
Button in navigation → `how-it-works.html`

**Contains:**
- How the system works
- Project architecture
- ML model details
- GCP integration
- API documentation

### 🧪 Test Lab
Button in navigation → `test-data-flow.html`

**Features:**
- Test forms in isolated environment
- Visualize data flow in real-time
- Console log for debugging
- Interactive charts
- Instant statistics updates

**How to use:**
1. Open Test Lab in new tab
2. Fill out Employee Questionnaire or Manager Appraisal
3. Click Submit
4. Watch updates in:
   - KPI cards
   - Detailed statistics
   - Charts (bar charts)
   - Console log

---

## 🔄 Data Flow (How It Works)

```
1. User fills out form
   ↓
2. JavaScript collects data and sends POST request
   ↓
3. Flask API receives data
   ↓
4. Data is saved to data/*.json files
   ↓
5. Frontend requests updated statistics (GET)
   ↓
6. Backend calculates averages
   ↓
7. Frontend updates KPIs and charts with animation
   ↓
8. User sees updated data (after 500ms)
```

---

## 📊 API Endpoints

### POST /api/questionnaire
Save employee survey

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
Save manager appraisal

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
Get satisfaction statistics

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
Get performance statistics

### GET /api/all-data
Get all saved data

### GET /api/health
Check API health status

---

## 💡 Usage Tips

### For Employees:
1. **Be honest** — your responses are anonymous and help improve the work environment
2. **Complete regularly** — best to submit surveys quarterly
3. **Use comments** — explain your ratings if you have additional feedback

### For Managers:
1. **Prepare in advance** — collect examples throughout the year
2. **Be objective** — use specific metrics
3. **Conduct dialogue** — discuss evaluation with employee
4. **Set SMART goals** — specific, measurable, achievable

### For HR:
1. **Monitor Live Insights** — track trends in real-time
2. **Analyze patterns** — look for correlations in data
3. **Export data** — regularly backup to CSV/JSON
4. **Use insights** — make data-driven decisions

---

## 🎨 Visual Indicators

### KPI Trends
- 🟢 **Positive** (green) — metric is increasing
- 🟡 **Neutral** (yellow) — metric is stable
- 🔴 **Negative** (red) — metric is decreasing

### Progress Bars
- Blue gradient — progress from 0% to 100%
- Fill = (value / 4) × 100%

### Animations
- **Pulse** — pulsing when KPI updates
- **Fade In** — smooth element appearance
- **Slide Up** — bottom-to-top animation
- **Chart Update** — smooth chart transitions

---

## ⚙️ Configuration

In `js/app.js`:

```javascript
const API_URL = 'http://localhost:5001/api';  // Backend API URL
const USE_API_BACKEND = true;                 // Enable data saving
const USE_GCP_INTEGRATION = false;            // GCP integration (currently disabled)
```

---

## 🐛 Troubleshooting

### Charts not displaying
**Solution:**
1. Open DevTools (F12) → Console
2. Check for JavaScript errors
3. Ensure Chart.js is loaded
4. Refresh page (Ctrl+Shift+R)

### API Offline
**Solution:**
1. Check if `simple_api.py` is running
2. Ensure port 5001 is available
3. Check terminal logs

### Data not saving
**Solution:**
1. Check API status (should be Online)
2. Open Network tab in DevTools
3. Verify POST requests return 200 OK
4. Ensure `data/` folder exists

### Statistics not updating
**Solution:**
1. Check `USE_API_BACKEND = true` in app.js
2. Manually refresh Live Insights tab (Refresh button)
3. Check console.log for errors

---

## 📁 File Structure

```
hr_portfolio_site/
├── index.html                  # Main page
├── how-it-works.html          # Documentation
├── test-data-flow.html        # Test laboratory
├── css/
│   └── styles.css             # All styles
├── js/
│   └── app.js                 # All logic
├── simple_api.py              # Flask backend API
├── data/
│   ├── questionnaires.json    # Employee surveys
│   └── appraisals.json        # Manager appraisals
└── docs/
    ├── START_HERE.md
    ├── FEATURES_LIST.md
    ├── FORM_TO_DASHBOARD_FLOW.md
    ├── QUICK_START.md
    ├── README.md
    └── USER_GUIDE.md          # This file
```

---

## 🎯 Frequently Asked Questions (FAQ)

**Q: Can I delete a submitted survey?**  
A: Not in the current version. But you can clear all data via "Clear All Data" or manually delete from JSON files.

**Q: How much data can be stored?**  
A: No limits, all data is stored in local JSON files.

**Q: Can I export data to Excel?**  
A: Yes, export to CSV format, then open in Excel.

**Q: How to change the API port?**  
A: In `simple_api.py` change `app.run(port=5001)` to desired port, and update `API_URL` in `app.js`.

**Q: Does the system work offline?**  
A: Partially. Dashboards and charts work, but data saving requires running API.

**Q: Can this be deployed to production?**  
A: Yes, but you need to:
- Replace Flask with production WSGI server (Gunicorn)
- Use PostgreSQL instead of JSON files
- Configure HTTPS
- Add authentication

---

## 📞 Support

**Documentation:**
- [START_HERE.md](START_HERE.md) — quick start guide
- [FEATURES_LIST.md](FEATURES_LIST.md) — complete feature list
- [FORM_TO_DASHBOARD_FLOW.md](FORM_TO_DASHBOARD_FLOW.md) — how forms affect dashboard
- [README.md](README.md) — project overview

**GitHub Repository:**
https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics

**Author:** Yevheniia Rudenko  
**Project:** MIT Emerging Talent - ELO-2 Module  
**Date:** December 2025  
**Version:** 2.0

---

**Enjoy using the system! 🎉**
