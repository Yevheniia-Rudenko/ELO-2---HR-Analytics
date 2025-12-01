# 🚀 START HERE - Quick Launch Guide

## ⚡ 3 Simple Steps to Launch

### Step 1: Start Backend API (Terminal 1)
```bash
cd /Users/yevrud/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site
python3 simple_api.py
```

You should see:
```
============================================================
🚀 HR Analytics API Server Starting...
============================================================
📊 Questionnaires file: data/questionnaires.json
⭐ Appraisals file: data/appraisals.json
🌐 Server running on: http://localhost:5001
============================================================

Endpoints:
  POST /api/questionnaire - Save questionnaire
  POST /api/appraisal - Save appraisal
  GET  /api/satisfaction-stats - Get satisfaction statistics
  GET  /api/performance-stats - Get performance statistics
  GET  /api/all-data - Get all data
  GET  /api/health - Health check
============================================================
```

### Step 2: Start Frontend Server (Terminal 2)
```bash
cd /Users/yevrud/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site
python3 -m http.server 8888
```

### Step 3: Open in Browser
```
http://localhost:8888/index.html
```

## ✅ System Health Check

1. **API Status Indicator** in top right corner should show 🟢 **API Online**
2. **Welcome Banner** should display with 4 buttons
3. **Overview Dashboard** should show 4 KPI cards and charts

---

## 🎯 What to Do Next?

### For Quick Testing:
👉 Click **"🧪 Test Lab"** button in Welcome Banner

### To Learn the System:
👉 Click **"📚 Learn More"** for full documentation

### To Submit a Survey:
👉 Click **"📝 Take Survey"** or go to "Employee Survey" tab

### To View Real Data:
👉 Click **"📈 View Live Data"** or go to "Live Insights" tab

---

## 🎨 Main Features

### 📊 Overview Tab
- **4 KPI Cards**: Total Employees, Attrition Rate, Satisfaction, Tenure
- **6 Interactive Charts**: Department analysis, age groups, overtime impact
- **Key Insights**: Data-driven recommendations

### 📝 Survey Tab
- Employee satisfaction questionnaire
- 4 parameters (1-4 scale)
- Real-time data saving
- Instant statistics update

### ⭐ Reviews Tab
- Manager performance appraisals
- Employee list with status tracking
- Comprehensive evaluation form
- Comment section

### 📈 Insights Tab (NEW!)
- Real-time statistics
- Live charts with actual data
- Recent submissions list
- Export to JSON/CSV
- Auto-refresh every 30 seconds

---

## 📚 Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** — Complete user manual
- **[FEATURES_LIST.md](FEATURES_LIST.md)** — All features explained
- **[README.md](README.md)** — Project overview
- **[FORM_TO_DASHBOARD_FLOW.md](FORM_TO_DASHBOARD_FLOW.md)** — How data flows

---

## 🆘 Troubleshooting

### Problem: API shows Offline
**Solution:** Make sure `python3 simple_api.py` is running in Terminal 1

### Problem: Graphs not showing
**Solution:** Refresh the page (Ctrl+Shift+R) and check browser console (F12)

### Problem: Data not saving
**Solution:** Check that API Status shows "Online" and port 5001 is available

---

## 🎉 You're Ready!

The system is now running and ready to use. Explore the tabs, submit test data, and watch the real-time updates!

**Enjoy! 🚀**
